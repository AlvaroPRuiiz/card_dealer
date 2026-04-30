#include "fsm.h"

#include "config.h"
#include "debug.h"
#include "diagnostics.h"
#include "hardware.h"
#include "ui.h"

#include <stdio.h>
#include <string.h>

static FsmState state = FsmState::OFF;
static bool state_initialized = false;

static uint8_t count_P = 1;
static uint8_t count_C = 1;
static uint16_t dealt_count = 0;
static uint8_t player_idx = 0;
static uint8_t slot_current = 0;
static uint8_t slot_target = 0;
static Config::CardSensorId target_card_sensor = Config::CardSensorId::CARD_1;
static Config::MotorId target_deal_motor = Config::MotorId::DEAL_1;
static unsigned long state_entry_ms = 0UL;
static FsmErrorCode error_code = FsmErrorCode::NONE;
static bool auto_start_after_home = false;

static bool hall_rearmed = true;
static bool card_sensor_rearmed = true;
static bool lcd_cache_valid = false;
static char lcd_line_1[17] = "";
static char lcd_line_2[17] = "";

static void set_state(FsmState next_state);

static uint16_t total_cards_to_deal() {
  return static_cast<uint16_t>(count_P) * static_cast<uint16_t>(count_C);
}

static bool state_timed_out(unsigned long timeout_ms) {
  return millis() - state_entry_ms >= timeout_ms;
}

static void copy_lcd_line(char *destination, const char *source) {
  strncpy(destination, source != nullptr ? source : "", 16);
  destination[16] = '\0';
}

static void reset_lcd_cache() {
  lcd_cache_valid = false;
  lcd_line_1[0] = '\0';
  lcd_line_2[0] = '\0';
}

static void show_two_lines(const char *line_1, const char *line_2) {
  char next_line_1[17];
  char next_line_2[17];
  copy_lcd_line(next_line_1, line_1);
  copy_lcd_line(next_line_2, line_2);

  if (lcd_cache_valid &&
      strcmp(lcd_line_1, next_line_1) == 0 &&
      strcmp(lcd_line_2, next_line_2) == 0) {
    return;
  }

  copy_lcd_line(lcd_line_1, next_line_1);
  copy_lcd_line(lcd_line_2, next_line_2);
  lcd_cache_valid = true;
  Ui::ui_show_message(lcd_line_1, lcd_line_2);
}

static void show_selection(const char *title, uint8_t value, uint8_t max_value) {
  char line_2[17];
  snprintf(line_2, sizeof(line_2), "%u/%u",
           static_cast<unsigned>(value),
           static_cast<unsigned>(max_value));
  show_two_lines(title, line_2);
}

static void show_dealing_progress() {
  char line_2[17];
  snprintf(line_2, sizeof(line_2), "%u/%u P%u S%u",
           static_cast<unsigned>(dealt_count),
           static_cast<unsigned>(total_cards_to_deal()),
           static_cast<unsigned>(player_idx + 1),
           static_cast<unsigned>(slot_target));
  show_two_lines("Dealing", line_2);
}

static void show_ready() {
  show_two_lines("Ready", "ADD one PWR auto");
}

static void show_error_screen(FsmErrorCode code) {
  switch (code) {
    case FsmErrorCode::NONE:
      show_two_lines("Error", "UNKNOWN");
      break;

    case FsmErrorCode::ROTATE_TIMEOUT:
      show_two_lines("ROTATE_TIMEOUT", "PWR recover");
      break;

    case FsmErrorCode::CARD_TIMEOUT:
      show_two_lines("CARD_TIMEOUT", "PWR recover");
      break;

    case FsmErrorCode::RETURN_HOME_TIMEOUT:
      show_two_lines("RETURN_HOME", "TIMEOUT");
      break;
  }
}

static void debug_core_values(const char *event_name) {
  Debug::debug_log_event(event_name);
  Debug::debug_log_value("player_idx", player_idx);
  Debug::debug_log_value("slot_current", slot_current);
  Debug::debug_log_value("slot_target", slot_target);
  Debug::debug_log_value("dealt_count", dealt_count);
}

static void clear_all_sensor_events() {
  Hardware::sensors_clear_events();
  hall_rearmed = true;
  card_sensor_rearmed = true;
}

static void clear_hall_wait_events() {
  Hardware::hall_home_clear_events();
  hall_rearmed = false;
  Debug::debug_log_event("Hall events cleared for state entry");
}

static void clear_card_wait_events() {
  Hardware::card_sensor_clear_events(target_card_sensor);
  card_sensor_rearmed = false;
  Debug::debug_log_event("Card sensor events cleared for state entry");
}

static bool hall_ready_for_new_edge() {
  if (millis() - state_entry_ms < Config::HALL_REARM_MS) {
    Hardware::hall_home_clear_events();
    return false;
  }

  if (!hall_rearmed) {
    Hardware::hall_home_clear_events();
    hall_rearmed = true;
    Debug::debug_log_event("Hall rearmed");
    return false;
  }

  return true;
}

static bool card_sensor_ready_for_new_edge() {
  if (millis() - state_entry_ms < Config::CARD_SENSOR_REARM_MS) {
    Hardware::card_sensor_clear_events(target_card_sensor);
    return false;
  }

  if (!card_sensor_rearmed) {
    Hardware::card_sensor_clear_events(target_card_sensor);
    card_sensor_rearmed = true;
    Debug::debug_log_event("Card sensor rearmed");
    return false;
  }

  return true;
}

static void reset_runtime() {
  dealt_count = 0;
  player_idx = 0;
  slot_target = 0;
  target_card_sensor = Config::CardSensorId::CARD_1;
  target_deal_motor = Config::MotorId::DEAL_1;
  auto_start_after_home = false;
  debug_core_values("Runtime reset");
}

static uint8_t calculate_slot_target(uint8_t player_index) {
  if (count_P == 0) {
    return 0;
  }

  return static_cast<uint8_t>(
    (static_cast<uint16_t>(player_index) * Config::SLOT_COUNT) / count_P
  );
}

static uint8_t deal_channel_for_player(uint8_t player_index) {
  return static_cast<uint8_t>(player_index % Config::DEAL_CHANNEL_COUNT);
}

static void prepare_player_target() {
  slot_target = calculate_slot_target(player_idx);

  const uint8_t deal_channel = deal_channel_for_player(player_idx);
  target_deal_motor = Config::DEAL_MOTORS[deal_channel];
  target_card_sensor = Config::DEAL_CARD_SENSORS[deal_channel];
  Debug::debug_log_value("deal_channel", deal_channel);
  debug_core_values("Target updated");
}

static void start_rotation() {
  Hardware::motor_forward(Config::MotorId::ROTATION, Config::ROTATION_PWM);
}

static void stop_rotation() {
  Hardware::motor_stop(Config::MotorId::ROTATION);
}

static void start_deal_motor() {
  Hardware::motor_forward(target_deal_motor, Config::DEAL_PWM);
}

static void stop_deal_motor() {
  Hardware::motor_stop(target_deal_motor);
}

static void enter_state(FsmState next_state) {
  state_entry_ms = millis();
  if (next_state != FsmState::ERROR) {
    error_code = FsmErrorCode::NONE;
  }

  switch (next_state) {
    case FsmState::OFF:
      auto_start_after_home = false;
      Hardware::motors_stop_all();
      clear_all_sensor_events();
      Ui::ui_set_menu_state(Ui::MenuState::OFF);
      show_two_lines("OFF", "Hold SELECT");
      break;

    case FsmState::INIT:
      Hardware::motors_stop_all();
      clear_all_sensor_events();
      Ui::ui_set_menu_state(Ui::MenuState::SET_PLAYERS);
      show_two_lines("Init", "Please wait");
      break;

    case FsmState::SET_PLAYERS:
      Hardware::motors_stop_all();
      Ui::ui_set_menu_state(Ui::MenuState::SET_PLAYERS);
      show_selection("Players", count_P, Config::MAX_PLAYERS);
      break;

    case FsmState::SET_CARDS:
      Hardware::motors_stop_all();
      Ui::ui_set_menu_state(Ui::MenuState::SET_CARDS);
      show_selection("Cards", count_C, Config::CMAX);
      break;

    case FsmState::AUTO_INIT:
      Hardware::motors_stop_all();
      clear_all_sensor_events();
      Ui::ui_set_menu_state(Ui::MenuState::AUTO_MODE);
      show_two_lines("Dealing", "Init");
      break;

    case FsmState::ROTATE_AUTO:
      clear_hall_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::AUTO_MODE);
      show_dealing_progress();
      if (slot_current != slot_target) {
        start_rotation();
      } else {
        stop_rotation();
      }
      break;

    case FsmState::PUSH_AUTO:
      clear_card_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::AUTO_MODE);
      show_dealing_progress();
      start_deal_motor();
      break;

    case FsmState::RETURN_HOME_AUTO:
      clear_hall_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::AUTO_MODE);
      show_two_lines(auto_start_after_home ? "Homing" : "Returning", "Home");
      start_rotation();
      break;

    case FsmState::IDLE_HOME:
      Hardware::motors_stop_all();
      clear_all_sensor_events();
      Ui::ui_set_menu_state(Ui::MenuState::MANUAL_MODE);
      show_ready();
      break;

    case FsmState::ROTATE_ONE:
      prepare_player_target();
      clear_hall_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::MANUAL_MODE);
      show_two_lines("Manual", "Rotate");
      if (slot_current != slot_target) {
        start_rotation();
      } else {
        stop_rotation();
      }
      break;

    case FsmState::PUSH_ONE:
      clear_card_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::MANUAL_MODE);
      show_two_lines("Manual", "Deal one");
      start_deal_motor();
      break;

    case FsmState::RETURN_HOME_MANUAL:
      clear_hall_wait_events();
      Ui::ui_set_menu_state(Ui::MenuState::MANUAL_MODE);
      show_two_lines("Returning", "Home");
      start_rotation();
      break;

    case FsmState::ERROR:
      Hardware::motors_stop_all();
      clear_all_sensor_events();
      Ui::ui_set_menu_state(Ui::MenuState::ERROR_MESSAGE);
      show_error_screen(error_code);
      Debug::debug_log_value("error_code", static_cast<long>(error_code));
      break;
  }
}

static void set_state(FsmState next_state) {
  if (state_initialized && state == next_state) {
    return;
  }

  const FsmState previous_state = state;
  state = next_state;

  if (state_initialized) {
    Debug::debug_log_transition(fsm_state_name(previous_state), fsm_state_name(state));
  } else {
    Debug::debug_log_state(fsm_state_name(state));
  }

  state_initialized = true;
  enter_state(state);
}

static void set_error(FsmErrorCode next_error_code, const char *event_name) {
  error_code = next_error_code;
  auto_start_after_home = false;
  Debug::debug_log_event(event_name);
  set_state(FsmState::ERROR);
}

static void handle_hall_slot(FsmState next_state) {
  if (!hall_ready_for_new_edge()) {
    return;
  }

  if (!Hardware::hall_home_consume_rising_edge()) {
    return;
  }

  Debug::debug_log_event("Hall detected");
  slot_current = static_cast<uint8_t>((slot_current + 1) % Config::SLOT_COUNT);
  Debug::debug_log_value("slot_current", slot_current);

  if (slot_current == slot_target) {
    stop_rotation();
    set_state(next_state);
  }
}

static void handle_return_home(FsmState next_state) {
  if (!hall_ready_for_new_edge()) {
    return;
  }

  if (!Hardware::hall_home_consume_rising_edge()) {
    return;
  }

  Debug::debug_log_event("Hall detected");
  slot_current = 0;
  Debug::debug_log_event("Logical HOME redefined");
  Debug::debug_log_value("slot_current", slot_current);
  stop_rotation();
  if (next_state == FsmState::ROTATE_AUTO) {
    auto_start_after_home = false;
  }
  set_state(next_state);
}

static void advance_after_auto_card() {
  Debug::debug_log_event("Card detected");
  stop_deal_motor();
  ++dealt_count;

  if (dealt_count >= total_cards_to_deal()) {
    player_idx = 0;
    prepare_player_target();
    set_state(FsmState::RETURN_HOME_AUTO);
    return;
  }

  player_idx = static_cast<uint8_t>((player_idx + 1) % count_P);
  Debug::debug_log_value("player_idx", player_idx);
  prepare_player_target();
  set_state(FsmState::ROTATE_AUTO);
}

static void advance_after_manual_card() {
  Debug::debug_log_event("Card detected");
  stop_deal_motor();
  player_idx = static_cast<uint8_t>((player_idx + 1) % count_P);
  Debug::debug_log_value("player_idx", player_idx);
  prepare_player_target();
  set_state(FsmState::RETURN_HOME_MANUAL);
}

void fsm_init() {
  if (CARD_DEALER_DIAGNOSTIC_MODE) {
    diagnostics_init();
    return;
  }

  Debug::debug_init();
  Hardware::hardware_init();
  Ui::ui_init();

  state_initialized = false;
  reset_lcd_cache();
  set_state(FsmState::OFF);
}

void fsm_update() {
  if (CARD_DEALER_DIAGNOSTIC_MODE) {
    diagnostics_update();
    return;
  }

  Hardware::hardware_update();
  Ui::ui_update();

  const Ui::UiEvent ui_event = Ui::ui_read_event();

  if (ui_event == Ui::UiEvent::PWR_LONG) {
    if (state == FsmState::OFF) {
      set_state(FsmState::INIT);
    } else {
      set_state(FsmState::OFF);
    }
    return;
  }

  switch (state) {
    case FsmState::OFF:
      break;

    case FsmState::INIT:
      reset_runtime();
      set_state(FsmState::SET_PLAYERS);
      break;

    case FsmState::SET_PLAYERS:
      if (ui_event == Ui::UiEvent::PWR_SHORT) {
        set_state(FsmState::SET_CARDS);
      } else if (ui_event == Ui::UiEvent::ADD_SHORT) {
        count_P = static_cast<uint8_t>((count_P % Config::MAX_PLAYERS) + 1);
        if (player_idx >= count_P) {
          player_idx = 0;
        }
        prepare_player_target();
        show_selection("Players", count_P, Config::MAX_PLAYERS);
      }
      break;

    case FsmState::SET_CARDS:
      if (ui_event == Ui::UiEvent::PWR_SHORT) {
        set_state(FsmState::AUTO_INIT);
      } else if (ui_event == Ui::UiEvent::ADD_SHORT) {
        count_C = static_cast<uint8_t>((count_C % Config::CMAX) + 1);
        Debug::debug_log_value("count_C", count_C);
        show_selection("Cards", count_C, Config::CMAX);
      }
      break;

    case FsmState::AUTO_INIT:
      reset_runtime();
      prepare_player_target();
      auto_start_after_home = true;
      set_state(FsmState::RETURN_HOME_AUTO);
      break;

    case FsmState::ROTATE_AUTO:
      if (state_timed_out(Config::ROTATE_TIMEOUT_MS)) {
        set_error(FsmErrorCode::ROTATE_TIMEOUT, "Rotate timeout");
      } else if (slot_current == slot_target) {
        stop_rotation();
        set_state(FsmState::PUSH_AUTO);
      } else {
        handle_hall_slot(FsmState::PUSH_AUTO);
      }
      break;

    case FsmState::PUSH_AUTO:
      if (state_timed_out(Config::PUSH_TIMEOUT_MS)) {
        set_error(FsmErrorCode::CARD_TIMEOUT, "Card timeout");
      } else if (card_sensor_ready_for_new_edge() &&
                 Hardware::card_sensor_consume_rising_edge(target_card_sensor)) {
        advance_after_auto_card();
      }
      break;

    case FsmState::RETURN_HOME_AUTO:
      if (state_timed_out(Config::RETURN_HOME_TIMEOUT_MS)) {
        set_error(FsmErrorCode::RETURN_HOME_TIMEOUT, "Return HOME timeout");
      } else {
        handle_return_home(auto_start_after_home ? FsmState::ROTATE_AUTO : FsmState::IDLE_HOME);
      }
      break;

    case FsmState::IDLE_HOME:
      if (ui_event == Ui::UiEvent::PWR_SHORT) {
        set_state(FsmState::AUTO_INIT);
      } else if (ui_event == Ui::UiEvent::ADD_SHORT) {
        set_state(FsmState::ROTATE_ONE);
      }
      break;

    case FsmState::ROTATE_ONE:
      if (state_timed_out(Config::ROTATE_TIMEOUT_MS)) {
        set_error(FsmErrorCode::ROTATE_TIMEOUT, "Rotate timeout");
      } else if (slot_current == slot_target) {
        stop_rotation();
        set_state(FsmState::PUSH_ONE);
      } else {
        handle_hall_slot(FsmState::PUSH_ONE);
      }
      break;

    case FsmState::PUSH_ONE:
      if (state_timed_out(Config::PUSH_TIMEOUT_MS)) {
        set_error(FsmErrorCode::CARD_TIMEOUT, "Card timeout");
      } else if (card_sensor_ready_for_new_edge() &&
                 Hardware::card_sensor_consume_rising_edge(target_card_sensor)) {
        advance_after_manual_card();
      }
      break;

    case FsmState::RETURN_HOME_MANUAL:
      if (state_timed_out(Config::RETURN_HOME_TIMEOUT_MS)) {
        set_error(FsmErrorCode::RETURN_HOME_TIMEOUT, "Return HOME timeout");
      } else {
        handle_return_home(FsmState::IDLE_HOME);
      }
      break;

    case FsmState::ERROR:
      if (ui_event == Ui::UiEvent::PWR_SHORT) {
        set_state(FsmState::RETURN_HOME_AUTO);
      }
      break;
  }
}

FsmState fsm_state() {
  return state;
}

const char *fsm_state_name(FsmState state_value) {
  switch (state_value) {
    case FsmState::OFF:
      return "OFF";
    case FsmState::INIT:
      return "INIT";
    case FsmState::SET_PLAYERS:
      return "SET_PLAYERS";
    case FsmState::SET_CARDS:
      return "SET_CARDS";
    case FsmState::AUTO_INIT:
      return "AUTO_INIT";
    case FsmState::ROTATE_AUTO:
      return "ROTATE_AUTO";
    case FsmState::PUSH_AUTO:
      return "PUSH_AUTO";
    case FsmState::RETURN_HOME_AUTO:
      return "RETURN_HOME_AUTO";
    case FsmState::IDLE_HOME:
      return "IDLE_HOME";
    case FsmState::ROTATE_ONE:
      return "ROTATE_ONE";
    case FsmState::PUSH_ONE:
      return "PUSH_ONE";
    case FsmState::RETURN_HOME_MANUAL:
      return "RETURN_HOME_MANUAL";
    case FsmState::ERROR:
      return "ERROR";
  }

  return "UNKNOWN";
}

uint8_t fsm_player_count() {
  return count_P;
}

uint8_t fsm_cards_per_player() {
  return count_C;
}

uint8_t fsm_current_player() {
  return player_idx;
}

uint16_t fsm_dealt_count() {
  return dealt_count;
}

uint8_t fsm_slot_current() {
  return slot_current;
}

uint8_t fsm_slot_target() {
  return slot_target;
}

FsmErrorCode fsm_error_code() {
  return error_code;
}

const char *fsm_error_name(FsmErrorCode error_code_value) {
  switch (error_code_value) {
    case FsmErrorCode::NONE:
      return "NONE";
    case FsmErrorCode::ROTATE_TIMEOUT:
      return "ROTATE_TIMEOUT";
    case FsmErrorCode::CARD_TIMEOUT:
      return "CARD_TIMEOUT";
    case FsmErrorCode::RETURN_HOME_TIMEOUT:
      return "RETURN_HOME_TIMEOUT";
  }

  return "UNKNOWN";
}

bool fsm_is_busy() {
  switch (state) {
    case FsmState::INIT:
    case FsmState::AUTO_INIT:
    case FsmState::ROTATE_AUTO:
    case FsmState::PUSH_AUTO:
    case FsmState::RETURN_HOME_AUTO:
    case FsmState::ROTATE_ONE:
    case FsmState::PUSH_ONE:
    case FsmState::RETURN_HOME_MANUAL:
      return true;

    case FsmState::OFF:
    case FsmState::SET_PLAYERS:
    case FsmState::SET_CARDS:
    case FsmState::IDLE_HOME:
    case FsmState::ERROR:
      return false;
  }

  return false;
}

#include "diagnostics.h"

#include "config.h"
#include "debug.h"
#include "hardware.h"
#include "ui.h"

#include <stdio.h>
#include <string.h>

enum class DiagnosticPage : uint8_t {
  DIAG_HOME = 0,
  DIAG_CARD_1,
  DIAG_CARD_2,
  DIAG_CARD_3,
  DIAG_ROTATION,
  DIAG_DEAL_1,
  DIAG_DEAL_2,
  DIAG_DEAL_3,
  DIAG_SUMMARY
};

static const unsigned long EDGE_VISIBLE_MS = 600UL;

static DiagnosticPage current_page = DiagnosticPage::DIAG_HOME;
static bool motor_on[Config::MOTOR_COUNT] = {false, false, false, false};
static bool lcd_cache_valid = false;
static char lcd_line_1[17] = "";
static char lcd_line_2[17] = "";
static bool sensor_active_known = false;
static bool last_sensor_active = false;
static bool edge_visible = false;
static unsigned long edge_visible_until_ms = 0UL;

static void enter_page(DiagnosticPage page);

static const char *page_name(DiagnosticPage page) {
  switch (page) {
    case DiagnosticPage::DIAG_HOME:
      return "DIAG HOME";
    case DiagnosticPage::DIAG_CARD_1:
      return "DIAG CARD 1";
    case DiagnosticPage::DIAG_CARD_2:
      return "DIAG CARD 2";
    case DiagnosticPage::DIAG_CARD_3:
      return "DIAG CARD 3";
    case DiagnosticPage::DIAG_ROTATION:
      return "DIAG ROTATION";
    case DiagnosticPage::DIAG_DEAL_1:
      return "DIAG DEAL 1";
    case DiagnosticPage::DIAG_DEAL_2:
      return "DIAG DEAL 2";
    case DiagnosticPage::DIAG_DEAL_3:
      return "DIAG DEAL 3";
    case DiagnosticPage::DIAG_SUMMARY:
      return "DIAG SUMMARY";
  }

  return "DIAG UNKNOWN";
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

static DiagnosticPage next_page(DiagnosticPage page) {
  switch (page) {
    case DiagnosticPage::DIAG_HOME:
      return DiagnosticPage::DIAG_CARD_1;
    case DiagnosticPage::DIAG_CARD_1:
      return DiagnosticPage::DIAG_CARD_2;
    case DiagnosticPage::DIAG_CARD_2:
      return DiagnosticPage::DIAG_CARD_3;
    case DiagnosticPage::DIAG_CARD_3:
      return DiagnosticPage::DIAG_ROTATION;
    case DiagnosticPage::DIAG_ROTATION:
      return DiagnosticPage::DIAG_DEAL_1;
    case DiagnosticPage::DIAG_DEAL_1:
      return DiagnosticPage::DIAG_DEAL_2;
    case DiagnosticPage::DIAG_DEAL_2:
      return DiagnosticPage::DIAG_DEAL_3;
    case DiagnosticPage::DIAG_DEAL_3:
      return DiagnosticPage::DIAG_SUMMARY;
    case DiagnosticPage::DIAG_SUMMARY:
      return DiagnosticPage::DIAG_HOME;
  }

  return DiagnosticPage::DIAG_HOME;
}

static bool page_is_sensor(DiagnosticPage page) {
  return page == DiagnosticPage::DIAG_HOME ||
         page == DiagnosticPage::DIAG_CARD_1 ||
         page == DiagnosticPage::DIAG_CARD_2 ||
         page == DiagnosticPage::DIAG_CARD_3;
}

static bool page_is_motor(DiagnosticPage page) {
  return page == DiagnosticPage::DIAG_ROTATION ||
         page == DiagnosticPage::DIAG_DEAL_1 ||
         page == DiagnosticPage::DIAG_DEAL_2 ||
         page == DiagnosticPage::DIAG_DEAL_3;
}

static Config::MotorId motor_for_page(DiagnosticPage page) {
  switch (page) {
    case DiagnosticPage::DIAG_ROTATION:
      return Config::MotorId::ROTATION;
    case DiagnosticPage::DIAG_DEAL_1:
      return Config::MotorId::DEAL_1;
    case DiagnosticPage::DIAG_DEAL_2:
      return Config::MotorId::DEAL_2;
    case DiagnosticPage::DIAG_DEAL_3:
      return Config::MotorId::DEAL_3;
    case DiagnosticPage::DIAG_HOME:
    case DiagnosticPage::DIAG_CARD_1:
    case DiagnosticPage::DIAG_CARD_2:
    case DiagnosticPage::DIAG_CARD_3:
    case DiagnosticPage::DIAG_SUMMARY:
      break;
  }

  return Config::MotorId::ROTATION;
}

static uint8_t motor_index(Config::MotorId motor) {
  return static_cast<uint8_t>(motor);
}

static uint8_t pwm_for_motor(Config::MotorId motor) {
  return motor == Config::MotorId::ROTATION ? Config::ROTATION_PWM : Config::DEAL_PWM;
}

static const char *motor_status_text(DiagnosticPage page, bool enabled) {
  switch (page) {
    case DiagnosticPage::DIAG_ROTATION:
      return enabled ? "ROTATION ON" : "ROTATION OFF";
    case DiagnosticPage::DIAG_DEAL_1:
      return enabled ? "DEAL 1 ON" : "DEAL 1 OFF";
    case DiagnosticPage::DIAG_DEAL_2:
      return enabled ? "DEAL 2 ON" : "DEAL 2 OFF";
    case DiagnosticPage::DIAG_DEAL_3:
      return enabled ? "DEAL 3 ON" : "DEAL 3 OFF";
    case DiagnosticPage::DIAG_HOME:
    case DiagnosticPage::DIAG_CARD_1:
    case DiagnosticPage::DIAG_CARD_2:
    case DiagnosticPage::DIAG_CARD_3:
    case DiagnosticPage::DIAG_SUMMARY:
      break;
  }

  return "";
}

static void stop_all_motors() {
  Hardware::motors_stop_all();
  for (uint8_t i = 0; i < Config::MOTOR_COUNT; ++i) {
    motor_on[i] = false;
  }
}

static bool sensor_active_for_page(DiagnosticPage page) {
  switch (page) {
    case DiagnosticPage::DIAG_HOME:
      return Hardware::hall_home_active();
    case DiagnosticPage::DIAG_CARD_1:
      return Hardware::card_sensor_active(Config::CardSensorId::CARD_1);
    case DiagnosticPage::DIAG_CARD_2:
      return Hardware::card_sensor_active(Config::CardSensorId::CARD_2);
    case DiagnosticPage::DIAG_CARD_3:
      return Hardware::card_sensor_active(Config::CardSensorId::CARD_3);
    case DiagnosticPage::DIAG_ROTATION:
    case DiagnosticPage::DIAG_DEAL_1:
    case DiagnosticPage::DIAG_DEAL_2:
    case DiagnosticPage::DIAG_DEAL_3:
    case DiagnosticPage::DIAG_SUMMARY:
      break;
  }

  return false;
}

static bool consume_sensor_edge_for_page(DiagnosticPage page) {
  switch (page) {
    case DiagnosticPage::DIAG_HOME:
      return Hardware::hall_home_consume_rising_edge();
    case DiagnosticPage::DIAG_CARD_1:
      return Hardware::card_sensor_consume_rising_edge(Config::CardSensorId::CARD_1);
    case DiagnosticPage::DIAG_CARD_2:
      return Hardware::card_sensor_consume_rising_edge(Config::CardSensorId::CARD_2);
    case DiagnosticPage::DIAG_CARD_3:
      return Hardware::card_sensor_consume_rising_edge(Config::CardSensorId::CARD_3);
    case DiagnosticPage::DIAG_ROTATION:
    case DiagnosticPage::DIAG_DEAL_1:
    case DiagnosticPage::DIAG_DEAL_2:
    case DiagnosticPage::DIAG_DEAL_3:
    case DiagnosticPage::DIAG_SUMMARY:
      break;
  }

  return false;
}

static void show_sensor_page(DiagnosticPage page) {
  char line_2[17];
  snprintf(line_2, sizeof(line_2), "Act:%c Edge:%c",
           sensor_active_for_page(page) ? 'Y' : 'N',
           edge_visible ? 'Y' : 'N');
  show_two_lines(page_name(page), line_2);
}

static void show_motor_page(DiagnosticPage page) {
  const Config::MotorId motor = motor_for_page(page);
  show_two_lines(page_name(page), motor_status_text(page, motor_on[motor_index(motor)]));
}

static void update_sensor_page(DiagnosticPage page) {
  const unsigned long now_ms = millis();
  const bool active = sensor_active_for_page(page);

  if (!sensor_active_known || active != last_sensor_active) {
    Debug::debug_log_event(page_name(page));
    Debug::debug_log_value("active", active ? 1 : 0);
    sensor_active_known = true;
    last_sensor_active = active;
  }

  if (consume_sensor_edge_for_page(page)) {
    edge_visible = true;
    edge_visible_until_ms = now_ms + EDGE_VISIBLE_MS;
    Debug::debug_log_event(page == DiagnosticPage::DIAG_HOME ? "Hall edge" : "Card sensor edge");
    Debug::debug_log_event(page_name(page));
  }

  if (edge_visible && now_ms - edge_visible_until_ms < 0x80000000UL) {
    edge_visible = false;
  }

  show_sensor_page(page);
}

static void toggle_current_motor() {
  if (!page_is_motor(current_page)) {
    return;
  }

  const Config::MotorId motor = motor_for_page(current_page);
  const uint8_t index = motor_index(motor);
  motor_on[index] = !motor_on[index];

  if (motor_on[index]) {
    Hardware::motor_forward(motor, pwm_for_motor(motor));
    Debug::debug_log_event("Diagnostic motor ON");
  } else {
    Hardware::motor_stop(motor);
    Debug::debug_log_event("Diagnostic motor OFF");
  }

  Debug::debug_log_event(page_name(current_page));
  show_motor_page(current_page);
}

static void enter_page(DiagnosticPage page) {
  stop_all_motors();
  Hardware::sensors_clear_events();

  current_page = page;
  sensor_active_known = false;
  last_sensor_active = false;
  edge_visible = false;
  edge_visible_until_ms = 0UL;
  reset_lcd_cache();

  Debug::debug_log_event("Diagnostic page");
  Debug::debug_log_event(page_name(page));

  if (page_is_sensor(page)) {
    show_sensor_page(page);
  } else if (page_is_motor(page)) {
    show_motor_page(page);
  } else {
    show_two_lines("DIAG SUMMARY", "Done PWR home");
  }
}

void diagnostics_init() {
  Debug::debug_init();
  Hardware::hardware_init();
  Ui::ui_init();
  Debug::debug_log_event("Diagnostic mode enabled");
  enter_page(DiagnosticPage::DIAG_HOME);
}

void diagnostics_update() {
  Hardware::hardware_update();
  Ui::ui_update();

  const Ui::UiEvent event = Ui::ui_read_event();

  if (event == Ui::UiEvent::PWR_LONG) {
    Debug::debug_log_event("Diagnostic safe reset");
    enter_page(DiagnosticPage::DIAG_HOME);
    return;
  }

  if (event == Ui::UiEvent::PWR_SHORT) {
    enter_page(next_page(current_page));
    return;
  }

  if (event == Ui::UiEvent::ADD_SHORT) {
    toggle_current_motor();
  }

  if (page_is_sensor(current_page)) {
    update_sensor_page(current_page);
  } else if (page_is_motor(current_page)) {
    show_motor_page(current_page);
  } else {
    show_two_lines("DIAG SUMMARY", "Done PWR home");
  }
}

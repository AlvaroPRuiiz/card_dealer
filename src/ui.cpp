#include "ui.h"
#include "config.h"

#include <LiquidCrystal.h>
#include <string.h>

namespace Ui {

static LiquidCrystal lcd(
  Config::LCD_RS,
  Config::LCD_EN,
  Config::LCD_D4,
  Config::LCD_D5,
  Config::LCD_D6,
  Config::LCD_D7
);

static MenuState current_menu_state = MenuState::OFF;
static UiEvent pending_event = UiEvent::NONE;
static PhysicalButtonId stable_physical_button = PhysicalButtonId::NONE;
static PhysicalButtonId last_raw_physical_button = PhysicalButtonId::NONE;
static UiButtonId stable_logical_button = UiButtonId::NONE;
static UiButtonId pressed_logical_button = UiButtonId::NONE;
static unsigned long raw_changed_ms = 0UL;
static unsigned long press_started_ms = 0UL;
static bool long_press_reported = false;
static char display_line_1[17] = "";
static char display_line_2[17] = "";
static bool display_dirty = true;
static bool backlight_is_enabled = true;
static int last_keypad_reading = 1023;

static PhysicalButtonId physical_button_from_analog(int analog_value) {
  if (analog_value < Config::KEYPAD_RIGHT_MAX) {
    return PhysicalButtonId::RIGHT;
  }
  if (analog_value < Config::KEYPAD_UP_MAX) {
    return PhysicalButtonId::UP;
  }
  if (analog_value < Config::KEYPAD_DOWN_MAX) {
    return PhysicalButtonId::DOWN;
  }
  if (analog_value < Config::KEYPAD_LEFT_MAX) {
    return PhysicalButtonId::LEFT;
  }
  if (analog_value < Config::KEYPAD_SELECT_MAX) {
    return PhysicalButtonId::SELECT;
  }

  return PhysicalButtonId::NONE;
}

static UiButtonId logical_button_from_physical(PhysicalButtonId button) {
  if (button == PhysicalButtonId::SELECT) {
    return UiButtonId::PWR;
  }
  if (button == PhysicalButtonId::RIGHT) {
    return UiButtonId::ADD;
  }

  return UiButtonId::NONE;
}

static uint8_t event_priority(UiEvent event) {
  switch (event) {
    case UiEvent::PWR_LONG:
      return 3;
    case UiEvent::PWR_SHORT:
      return 2;
    case UiEvent::ADD_SHORT:
      return 1;
    case UiEvent::NONE:
      return 0;
  }

  return 0;
}

static void queue_event(UiEvent event) {
  if (event_priority(event) > event_priority(pending_event)) {
    pending_event = event;
  }
}

static void handle_logical_button_change(UiButtonId next_button, unsigned long now_ms) {
  if (next_button == stable_logical_button) {
    return;
  }

  if (next_button == UiButtonId::NONE && pressed_logical_button != UiButtonId::NONE) {
    if (pressed_logical_button == UiButtonId::PWR && !long_press_reported) {
      queue_event(UiEvent::PWR_SHORT);
    } else if (pressed_logical_button == UiButtonId::ADD) {
      queue_event(UiEvent::ADD_SHORT);
    }

    pressed_logical_button = UiButtonId::NONE;
    press_started_ms = 0UL;
    long_press_reported = false;
  } else if (next_button != UiButtonId::NONE) {
    pressed_logical_button = next_button;
    press_started_ms = now_ms;
    long_press_reported = false;
  }

  stable_logical_button = next_button;
}

static void update_keypad() {
  const unsigned long now_ms = millis();
  last_keypad_reading = analogRead(Config::LCD_KEYPAD);
  const PhysicalButtonId raw_button = physical_button_from_analog(last_keypad_reading);

  if (raw_button != last_raw_physical_button) {
    last_raw_physical_button = raw_button;
    raw_changed_ms = now_ms;
  }

  if (raw_button != stable_physical_button &&
      now_ms - raw_changed_ms >= Config::UI_DEBOUNCE_MS) {
    stable_physical_button = raw_button;
    handle_logical_button_change(logical_button_from_physical(stable_physical_button), now_ms);
  }

  if (pressed_logical_button == UiButtonId::PWR && !long_press_reported &&
      now_ms - press_started_ms >= Config::UI_LONG_PRESS_MS) {
    long_press_reported = true;
    queue_event(UiEvent::PWR_LONG);
  }
}

static void print_lcd_line(uint8_t row, const char *text) {
  lcd.setCursor(0, row);
  for (uint8_t i = 0; i < 16; ++i) {
    const char c = text[i];
    lcd.print(c != '\0' ? c : ' ');
  }
}

static void update_lcd() {
  if (!display_dirty) {
    return;
  }

  print_lcd_line(0, display_line_1);
  print_lcd_line(1, display_line_2);
  display_dirty = false;
}

void ui_init() {
  pinMode(Config::LCD_KEYPAD, INPUT);
  pinMode(Config::LCD_BACKLIGHT, OUTPUT);
  ui_set_backlight(true);

  lcd.begin(16, 2);
  ui_show_message("", "");
  update_lcd();
}

void ui_update() {
  update_keypad();
  update_lcd();
}

UiEvent ui_read_event() {
  const UiEvent event = pending_event;
  pending_event = UiEvent::NONE;
  return event;
}

PhysicalButtonId ui_physical_button() {
  return stable_physical_button;
}

UiButtonId ui_logical_button() {
  return stable_logical_button;
}

int ui_last_keypad_reading() {
  return last_keypad_reading;
}

void ui_set_menu_state(MenuState state) {
  current_menu_state = state;
  (void)current_menu_state;
}

MenuState ui_menu_state() {
  return current_menu_state;
}

void ui_set_backlight(bool enabled) {
  backlight_is_enabled = enabled;
  digitalWrite(Config::LCD_BACKLIGHT, enabled ? HIGH : LOW);
}

bool ui_backlight_enabled() {
  return backlight_is_enabled;
}

void ui_show_message(const char *line_1, const char *line_2) {
  strncpy(display_line_1, line_1 != nullptr ? line_1 : "", sizeof(display_line_1) - 1);
  display_line_1[sizeof(display_line_1) - 1] = '\0';

  strncpy(display_line_2, line_2 != nullptr ? line_2 : "", sizeof(display_line_2) - 1);
  display_line_2[sizeof(display_line_2) - 1] = '\0';

  display_dirty = true;
}

}

#ifndef CARD_DEALER_UI_H
#define CARD_DEALER_UI_H

#include <Arduino.h>
#include "config.h"

namespace Ui {

using UiButtonId = Config::UiButtonId;
using PhysicalButtonId = Config::PhysicalButtonId;

enum class UiEvent : uint8_t {
  NONE = 0,
  PWR_SHORT,
  PWR_LONG,
  ADD_SHORT
};

enum class MenuState : uint8_t {
  OFF = 0,
  SET_PLAYERS,
  SET_CARDS,
  AUTO_MODE,
  MANUAL_MODE,
  ERROR_MESSAGE
};

void ui_init();
void ui_update();

// User events are derived from the wired LCD Keypad Shield keypad on A0.
UiEvent ui_read_event();

PhysicalButtonId ui_physical_button();
UiButtonId ui_logical_button();
int ui_last_keypad_reading();

void ui_set_menu_state(MenuState state);
MenuState ui_menu_state();

void ui_set_backlight(bool enabled);
bool ui_backlight_enabled();
void ui_show_message(const char *line_1, const char *line_2);

}

#endif

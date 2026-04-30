#ifndef CARD_DEALER_CONFIG_H
#define CARD_DEALER_CONFIG_H

#include <Arduino.h>

// Compile-time switch for physical bring-up diagnostics.
// false: normal FSM. true: diagnostics module owns fsm_init/fsm_update.
#ifndef CARD_DEALER_DIAGNOSTIC_MODE
#define CARD_DEALER_DIAGNOSTIC_MODE false
#endif

// Single source of truth for Arduino Mega pin assignments and shared runtime
// constants. Hardware code must use logical IDs instead of raw pin numbers.

namespace Config {

// LCD / keypad
// LCD Keypad Shield, wired manually instead of plugged as a shield.
static const uint8_t LCD_D4 = 4;
static const uint8_t LCD_D5 = 5;
static const uint8_t LCD_D6 = 6;
static const uint8_t LCD_D7 = 7;
static const uint8_t LCD_RS = 8;
static const uint8_t LCD_EN = 9;
static const uint8_t LCD_BACKLIGHT = 10;
static const uint8_t LCD_KEYPAD = A0;

// LCD Keypad Shield analog thresholds on A0.
static const int KEYPAD_RIGHT_MAX = 60;
static const int KEYPAD_UP_MAX = 200;
static const int KEYPAD_DOWN_MAX = 400;
static const int KEYPAD_LEFT_MAX = 600;
static const int KEYPAD_SELECT_MAX = 800;

// L298N #1
static const uint8_t L298_1_ENA = 11;
static const uint8_t L298_1_ENB = 12;
static const uint8_t L298_1_IN1 = 22;
static const uint8_t L298_1_IN2 = 23; 
static const uint8_t L298_1_IN3 = 24;
static const uint8_t L298_1_IN4 = 25;

// L298N #2
static const uint8_t L298_2_ENA = 2;
static const uint8_t L298_2_ENB = 3;
static const uint8_t L298_2_IN1 = 26;
static const uint8_t L298_2_IN2 = 27;
static const uint8_t L298_2_IN3 = 28;
static const uint8_t L298_2_IN4 = 29;

// Sensors
static const uint8_t CARD_SENSOR_1 = 30;
static const uint8_t CARD_SENSOR_2 = 31;
static const uint8_t CARD_SENSOR_3 = 32;
static const uint8_t HOME_SENSOR = 33;

static const uint8_t CARD_SENSOR_COUNT = 3;
static const uint8_t CARD_SENSOR_PINS[CARD_SENSOR_COUNT] = {
  CARD_SENSOR_1,
  CARD_SENSOR_2,
  CARD_SENSOR_3
};

static const uint8_t HOME_SENSOR_PIN = HOME_SENSOR;

// Sensor electrical behavior is centralized here. Change these constants if
// the installed modules are active LOW or need pull-ups.
static const uint8_t CARD_SENSOR_INPUT_MODE = INPUT;
static const uint8_t CARD_SENSOR_ACTIVE_LEVEL = HIGH;
static const uint8_t HOME_SENSOR_INPUT_MODE = INPUT;
static const uint8_t HOME_SENSOR_ACTIVE_LEVEL = HIGH;

// FSM parameters
static const uint8_t MAX_PLAYERS = 6;
static const uint8_t SLOT_COUNT = 6;
static const uint8_t MAX_CARDS_PER_PLAYER = 10;
static const uint8_t CMAX = MAX_CARDS_PER_PLAYER;
static const uint8_t MOTOR_COUNT = 4;

enum class MotorId : uint8_t {
  ROTATION = 0,
  DEAL_1,
  DEAL_2,
  DEAL_3
};

enum class CardSensorId : uint8_t {
  CARD_1 = 0,
  CARD_2,
  CARD_3
};

enum class MotorDirection : uint8_t {
  STOPPED = 0,
  FORWARD,
  REVERSE
};

enum class PhysicalButtonId : uint8_t {
  NONE = 0,
  RIGHT,
  UP,
  DOWN,
  LEFT,
  SELECT
};

enum class UiButtonId : uint8_t {
  NONE = 0,
  PWR,
  ADD
};

// Logical motor to L298N channel mapping. Rotation is always one-way.
static const uint8_t MOTOR_PWM_PINS[MOTOR_COUNT] = {
  L298_1_ENA,  // ROTATION: L298N #1 channel A.
  L298_1_ENB,  // DEAL_1:   L298N #1 channel B.
  L298_2_ENA,  // DEAL_2:   L298N #2 channel A.
  L298_2_ENB   // DEAL_3:   L298N #2 channel B.
};

static const uint8_t MOTOR_IN_A_PINS[MOTOR_COUNT] = {
  L298_1_IN1,
  L298_1_IN3,
  L298_2_IN1,
  L298_2_IN3
};

static const uint8_t MOTOR_IN_B_PINS[MOTOR_COUNT] = {
  L298_1_IN2,
  L298_1_IN4,
  L298_2_IN2,
  L298_2_IN4
};

// Deal channels pair each card ejector motor with its own card sensor.
static const uint8_t DEAL_CHANNEL_COUNT = 3;
static const MotorId DEAL_MOTORS[DEAL_CHANNEL_COUNT] = {
  MotorId::DEAL_1,
  MotorId::DEAL_2,
  MotorId::DEAL_3
};

static const CardSensorId DEAL_CARD_SENSORS[DEAL_CHANNEL_COUNT] = {
  CardSensorId::CARD_1,
  CardSensorId::CARD_2,
  CardSensorId::CARD_3
};

// Timing defaults. These values are intentionally conservative and should be
// calibrated with the real mechanics during bring-up.
static const unsigned long ROTATE_TIMEOUT_MS = 5000UL;
static const unsigned long PUSH_TIMEOUT_MS = 1500UL;
static const unsigned long RETURN_HOME_TIMEOUT_MS = 6000UL;
static const unsigned long UI_LONG_PRESS_MS = 1200UL;
static const unsigned long UI_DEBOUNCE_MS = 40UL;

// Hall HOME filtering.
static const unsigned long HALL_DEAD_TIME_MS = 50UL;
static const unsigned long HALL_DEBOUNCE_MS = 20UL;
static const unsigned long HALL_REARM_MS = 80UL;
static const uint8_t HALL_STABLE_SAMPLE_COUNT = 3;

// Card sensor filtering.
static const unsigned long CARD_SENSOR_DEBOUNCE_MS = 25UL;
static const unsigned long CARD_SENSOR_DEAD_TIME_MS = 80UL;
static const unsigned long CARD_SENSOR_REARM_MS = 40UL;
static const uint8_t CARD_SENSOR_STABLE_SAMPLE_COUNT = 3;

// Initial motor PWM values. Tune these on the real mechanics.
static const uint8_t ROTATION_PWM = 215; //no giran menos de 140
static const uint8_t DEAL_PWM = 200;

// Diagnostic parameters
// Diagnostic mode is controlled by CARD_DEALER_DIAGNOSTIC_MODE above.

}

#include "config_checks.h"

#endif

#ifndef CARD_DEALER_CONFIG_CHECKS_H
#define CARD_DEALER_CONFIG_CHECKS_H

namespace ConfigChecks {

template<int Pin, int... Pins>
struct ContainsPin;

template<int Pin>
struct ContainsPin<Pin> {
  static const bool value = false;
};

template<int Pin, int First, int... Rest>
struct ContainsPin<Pin, First, Rest...> {
  static const bool value = (Pin == First) || ContainsPin<Pin, Rest...>::value;
};

template<int... Pins>
struct UniquePins;

template<>
struct UniquePins<> {
  static const bool value = true;
};

template<int Pin, int... Rest>
struct UniquePins<Pin, Rest...> {
  static const bool value = !ContainsPin<Pin, Rest...>::value && UniquePins<Rest...>::value;
};

}

static_assert(Config::CARD_SENSOR_COUNT == 3, "CARD_SENSOR_COUNT must be 3 for final dealer hardware");
static_assert(Config::MOTOR_COUNT == 4, "MOTOR_COUNT must be 4");
static_assert(Config::DEAL_CHANNEL_COUNT == 3, "DEAL_CHANNEL_COUNT must be 3");
static_assert(Config::MAX_PLAYERS == 6, "MAX_PLAYERS must be 6");
static_assert(Config::SLOT_COUNT == 6, "SLOT_COUNT must be 6");
static_assert(Config::CMAX > 0, "CMAX must be greater than zero");
static_assert(Config::ROTATE_TIMEOUT_MS > 0, "ROTATE_TIMEOUT_MS must be greater than zero");
static_assert(Config::PUSH_TIMEOUT_MS > 0, "PUSH_TIMEOUT_MS must be greater than zero");
static_assert(Config::RETURN_HOME_TIMEOUT_MS > 0, "RETURN_HOME_TIMEOUT_MS must be greater than zero");
static_assert(Config::HALL_REARM_MS > 0, "HALL_REARM_MS must be greater than zero");
static_assert(Config::CARD_SENSOR_REARM_MS > 0, "CARD_SENSOR_REARM_MS must be greater than zero");
static_assert(Config::UI_LONG_PRESS_MS > Config::UI_DEBOUNCE_MS, "UI_LONG_PRESS_MS must be greater than UI_DEBOUNCE_MS");
static_assert(Config::ROTATION_PWM > 0, "ROTATION_PWM must be greater than zero");
static_assert(Config::DEAL_PWM > 0, "DEAL_PWM must be greater than zero");

static_assert(
  sizeof(Config::MOTOR_PWM_PINS) / sizeof(Config::MOTOR_PWM_PINS[0]) == Config::MOTOR_COUNT,
  "MOTOR_PWM_PINS length must match MOTOR_COUNT"
);
static_assert(
  sizeof(Config::MOTOR_IN_A_PINS) / sizeof(Config::MOTOR_IN_A_PINS[0]) == Config::MOTOR_COUNT,
  "MOTOR_IN_A_PINS length must match MOTOR_COUNT"
);
static_assert(
  sizeof(Config::MOTOR_IN_B_PINS) / sizeof(Config::MOTOR_IN_B_PINS[0]) == Config::MOTOR_COUNT,
  "MOTOR_IN_B_PINS length must match MOTOR_COUNT"
);
static_assert(
  sizeof(Config::CARD_SENSOR_PINS) / sizeof(Config::CARD_SENSOR_PINS[0]) == Config::CARD_SENSOR_COUNT,
  "CARD_SENSOR_PINS length must match CARD_SENSOR_COUNT"
);
static_assert(
  sizeof(Config::DEAL_MOTORS) / sizeof(Config::DEAL_MOTORS[0]) == Config::DEAL_CHANNEL_COUNT,
  "DEAL_MOTORS length must match DEAL_CHANNEL_COUNT"
);
static_assert(
  sizeof(Config::DEAL_CARD_SENSORS) / sizeof(Config::DEAL_CARD_SENSORS[0]) == Config::DEAL_CHANNEL_COUNT,
  "DEAL_CARD_SENSORS length must match DEAL_CHANNEL_COUNT"
);

static_assert(
  ConfigChecks::UniquePins<
    Config::LCD_D4,
    Config::LCD_D5,
    Config::LCD_D6,
    Config::LCD_D7,
    Config::LCD_RS,
    Config::LCD_EN,
    Config::LCD_BACKLIGHT,
    Config::LCD_KEYPAD
  >::value,
  "Duplicate pin in LCD/keypad pin block"
);

static_assert(
  ConfigChecks::UniquePins<
    Config::L298_1_ENA,
    Config::L298_1_ENB,
    Config::L298_1_IN1,
    Config::L298_1_IN2,
    Config::L298_1_IN3,
    Config::L298_1_IN4
  >::value,
  "Duplicate pin in L298N #1 pin block"
);

static_assert(
  ConfigChecks::UniquePins<
    Config::L298_2_ENA,
    Config::L298_2_ENB,
    Config::L298_2_IN1,
    Config::L298_2_IN2,
    Config::L298_2_IN3,
    Config::L298_2_IN4
  >::value,
  "Duplicate pin in L298N #2 pin block"
);

static_assert(
  ConfigChecks::UniquePins<
    Config::CARD_SENSOR_1,
    Config::CARD_SENSOR_2,
    Config::CARD_SENSOR_3,
    Config::HOME_SENSOR
  >::value,
  "Duplicate pin in sensor pin block"
);

static_assert(
  ConfigChecks::UniquePins<
    Config::LCD_D4,
    Config::LCD_D5,
    Config::LCD_D6,
    Config::LCD_D7,
    Config::LCD_RS,
    Config::LCD_EN,
    Config::LCD_BACKLIGHT,
    Config::LCD_KEYPAD,
    Config::L298_1_ENA,
    Config::L298_1_ENB,
    Config::L298_1_IN1,
    Config::L298_1_IN2,
    Config::L298_1_IN3,
    Config::L298_1_IN4,
    Config::L298_2_ENA,
    Config::L298_2_ENB,
    Config::L298_2_IN1,
    Config::L298_2_IN2,
    Config::L298_2_IN3,
    Config::L298_2_IN4,
    Config::CARD_SENSOR_1,
    Config::CARD_SENSOR_2,
    Config::CARD_SENSOR_3,
    Config::HOME_SENSOR
  >::value,
  "Duplicate pin across hardware pin map"
);

#endif

#include "hardware.h"

namespace Hardware {

struct MotorChannel {
  uint8_t pwm_pin;
  uint8_t in_a_pin;
  uint8_t in_b_pin;
  uint8_t speed;
  MotorDirection direction;
};

struct DigitalSensorState {
  uint8_t pin;
  uint8_t input_mode;
  uint8_t active_level;
  unsigned long debounce_ms;
  unsigned long dead_time_ms;
  bool stable_active;
  bool last_raw_active;
  unsigned long last_raw_change_ms;
  unsigned long last_event_ms;
  bool rising_event;
  bool falling_event;
};

static MotorChannel motors[Config::MOTOR_COUNT] = {
  {Config::MOTOR_PWM_PINS[0], Config::MOTOR_IN_A_PINS[0], Config::MOTOR_IN_B_PINS[0], 0, MotorDirection::STOPPED},
  {Config::MOTOR_PWM_PINS[1], Config::MOTOR_IN_A_PINS[1], Config::MOTOR_IN_B_PINS[1], 0, MotorDirection::STOPPED},
  {Config::MOTOR_PWM_PINS[2], Config::MOTOR_IN_A_PINS[2], Config::MOTOR_IN_B_PINS[2], 0, MotorDirection::STOPPED},
  {Config::MOTOR_PWM_PINS[3], Config::MOTOR_IN_A_PINS[3], Config::MOTOR_IN_B_PINS[3], 0, MotorDirection::STOPPED}
};

static DigitalSensorState hall_sensor = {
  Config::HOME_SENSOR_PIN,
  Config::HOME_SENSOR_INPUT_MODE,
  Config::HOME_SENSOR_ACTIVE_LEVEL,
  Config::HALL_DEBOUNCE_MS,
  Config::HALL_DEAD_TIME_MS,
  false,
  false,
  0UL,
  0UL,
  false,
  false
};

static DigitalSensorState card_sensors[Config::CARD_SENSOR_COUNT] = {
  {Config::CARD_SENSOR_PINS[0], Config::CARD_SENSOR_INPUT_MODE, Config::CARD_SENSOR_ACTIVE_LEVEL,
   Config::CARD_SENSOR_DEBOUNCE_MS, Config::CARD_SENSOR_DEAD_TIME_MS, false, false, 0UL, 0UL, false, false},
  {Config::CARD_SENSOR_PINS[1], Config::CARD_SENSOR_INPUT_MODE, Config::CARD_SENSOR_ACTIVE_LEVEL,
   Config::CARD_SENSOR_DEBOUNCE_MS, Config::CARD_SENSOR_DEAD_TIME_MS, false, false, 0UL, 0UL, false, false},
  {Config::CARD_SENSOR_PINS[2], Config::CARD_SENSOR_INPUT_MODE, Config::CARD_SENSOR_ACTIVE_LEVEL,
   Config::CARD_SENSOR_DEBOUNCE_MS, Config::CARD_SENSOR_DEAD_TIME_MS, false, false, 0UL, 0UL, false, false}
};

static bool valid_motor_index(uint8_t index) {
  return index < Config::MOTOR_COUNT;
}

static bool valid_card_sensor_index(uint8_t index) {
  return index < Config::CARD_SENSOR_COUNT;
}

static uint8_t motor_index(MotorId motor) {
  return static_cast<uint8_t>(motor);
}

static bool motor_reverse_allowed(MotorId motor) {
  return motor != MotorId::ROTATION;
}

static bool read_sensor_raw(const DigitalSensorState &sensor) {
  return digitalRead(sensor.pin) == sensor.active_level;
}

static void init_sensor(DigitalSensorState &sensor, unsigned long now_ms) {
  pinMode(sensor.pin, sensor.input_mode);
  sensor.stable_active = read_sensor_raw(sensor);
  sensor.last_raw_active = sensor.stable_active;
  sensor.last_raw_change_ms = now_ms;
  sensor.last_event_ms = 0UL;
  sensor.rising_event = false;
  sensor.falling_event = false;
}

static bool event_allowed(const DigitalSensorState &sensor, unsigned long now_ms) {
  return sensor.last_event_ms == 0UL || now_ms - sensor.last_event_ms >= sensor.dead_time_ms;
}

static void update_sensor(DigitalSensorState &sensor, unsigned long now_ms) {
  const bool raw_active = read_sensor_raw(sensor);

  if (raw_active != sensor.last_raw_active) {
    sensor.last_raw_active = raw_active;
    sensor.last_raw_change_ms = now_ms;
  }

  if (raw_active == sensor.stable_active) {
    return;
  }

  if (now_ms - sensor.last_raw_change_ms < sensor.debounce_ms) {
    return;
  }

  sensor.stable_active = raw_active;

  if (!event_allowed(sensor, now_ms)) {
    return;
  }

  if (sensor.stable_active) {
    sensor.rising_event = true;
  } else {
    sensor.falling_event = true;
  }

  sensor.last_event_ms = now_ms;
}

static bool consume_event(bool &event_flag) {
  const bool was_pending = event_flag;
  event_flag = false;
  return was_pending;
}

static void apply_motor(MotorChannel &motor) {
  if (motor.speed == 0 || motor.direction == MotorDirection::STOPPED) {
    analogWrite(motor.pwm_pin, 0);
    digitalWrite(motor.in_a_pin, LOW);
    digitalWrite(motor.in_b_pin, LOW);
    motor.speed = 0;
    motor.direction = MotorDirection::STOPPED;
    return;
  }

  if (motor.direction == MotorDirection::FORWARD) {
    digitalWrite(motor.in_a_pin, HIGH);
    digitalWrite(motor.in_b_pin, LOW);
  } else {
    digitalWrite(motor.in_a_pin, LOW);
    digitalWrite(motor.in_b_pin, HIGH);
  }

  analogWrite(motor.pwm_pin, motor.speed);
}

void hardware_init() {
  for (uint8_t i = 0; i < Config::MOTOR_COUNT; ++i) {
    pinMode(motors[i].in_a_pin, OUTPUT);
    pinMode(motors[i].in_b_pin, OUTPUT);
    pinMode(motors[i].pwm_pin, OUTPUT);
    motor_stop(static_cast<MotorId>(i));
  }

  const unsigned long now_ms = millis();
  init_sensor(hall_sensor, now_ms);

  for (uint8_t i = 0; i < Config::CARD_SENSOR_COUNT; ++i) {
    init_sensor(card_sensors[i], now_ms);
  }
}

void hardware_update() {
  const unsigned long now_ms = millis();

  update_sensor(hall_sensor, now_ms);
  for (uint8_t i = 0; i < Config::CARD_SENSOR_COUNT; ++i) {
    update_sensor(card_sensors[i], now_ms);
  }
}

void motor_forward(MotorId motor, uint8_t pwm) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return;
  }

  if (pwm == 0) {
    motor_stop(motor);
    return;
  }

  motors[index].speed = pwm;
  motors[index].direction = MotorDirection::FORWARD;
  apply_motor(motors[index]);
}

void motor_reverse(MotorId motor, uint8_t pwm) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return;
  }

  if (!motor_reverse_allowed(motor)) {
    motor_stop(motor);
    return;
  }

  if (pwm == 0) {
    motor_stop(motor);
    return;
  }

  motors[index].speed = pwm;
  motors[index].direction = MotorDirection::REVERSE;
  apply_motor(motors[index]);
}

void motor_set_speed(MotorId motor, uint8_t pwm) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return;
  }

  if (pwm == 0) {
    motor_stop(motor);
    return;
  }

  motors[index].speed = pwm;
  if (motors[index].direction == MotorDirection::STOPPED) {
    motors[index].direction = MotorDirection::FORWARD;
  }

  apply_motor(motors[index]);
}

void motor_stop(MotorId motor) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return;
  }

  motors[index].speed = 0;
  motors[index].direction = MotorDirection::STOPPED;
  apply_motor(motors[index]);
}

void motors_stop_all() {
  for (uint8_t i = 0; i < Config::MOTOR_COUNT; ++i) {
    motor_stop(static_cast<MotorId>(i));
  }
}

uint8_t motor_speed(MotorId motor) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return 0;
  }

  return motors[index].speed;
}

MotorDirection motor_direction(MotorId motor) {
  const uint8_t index = motor_index(motor);
  if (!valid_motor_index(index)) {
    return MotorDirection::STOPPED;
  }

  return motors[index].direction;
}

bool hall_home_active() {
  return hall_sensor.stable_active;
}

bool hall_home_rising_edge() {
  return hall_sensor.rising_event;
}

bool hall_home_falling_edge() {
  return hall_sensor.falling_event;
}

bool hall_home_consume_rising_edge() {
  return consume_event(hall_sensor.rising_event);
}

bool hall_home_consume_falling_edge() {
  return consume_event(hall_sensor.falling_event);
}

void hall_home_clear_events() {
  hall_sensor.rising_event = false;
  hall_sensor.falling_event = false;
}

bool card_sensor_active(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return false;
  }

  return card_sensors[sensor_index].stable_active;
}

bool card_sensor_rising_edge(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return false;
  }

  return card_sensors[sensor_index].rising_event;
}

bool card_sensor_falling_edge(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return false;
  }

  return card_sensors[sensor_index].falling_event;
}

bool card_sensor_consume_rising_edge(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return false;
  }

  return consume_event(card_sensors[sensor_index].rising_event);
}

bool card_sensor_consume_falling_edge(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return false;
  }

  return consume_event(card_sensors[sensor_index].falling_event);
}

void card_sensor_clear_events(uint8_t sensor_index) {
  if (!valid_card_sensor_index(sensor_index)) {
    return;
  }

  card_sensors[sensor_index].rising_event = false;
  card_sensors[sensor_index].falling_event = false;
}

void sensors_clear_events() {
  hall_home_clear_events();
  for (uint8_t i = 0; i < Config::CARD_SENSOR_COUNT; ++i) {
    card_sensor_clear_events(i);
  }
}

}

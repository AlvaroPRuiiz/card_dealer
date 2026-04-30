#ifndef CARD_DEALER_HARDWARE_H
#define CARD_DEALER_HARDWARE_H

#include <Arduino.h>
#include "config.h"

namespace Hardware {

using MotorId = Config::MotorId;
using CardSensorId = Config::CardSensorId;
using MotorDirection = Config::MotorDirection;

void hardware_init();
void hardware_update();

// DC motor control for two L298N drivers and four DC motors.
// The FSM must control motors only through this logical API.
void motor_forward(MotorId motor, uint8_t pwm);
void motor_reverse(MotorId motor, uint8_t pwm);
void motor_set_speed(MotorId motor, uint8_t pwm);
void motor_stop(MotorId motor);
void motors_stop_all();
uint8_t motor_speed(MotorId motor);
MotorDirection motor_direction(MotorId motor);

// HOME Hall sensor state and edge API.
bool hall_home_active();
bool hall_home_rising_edge();
bool hall_home_falling_edge();
bool hall_home_consume_rising_edge();
bool hall_home_consume_falling_edge();
void hall_home_clear_events();

// Digital card sensor state and edge API.
// The uint8_t overloads are kept for the current implementation unit; callers
// should prefer CardSensorId to avoid magic numbers.
bool card_sensor_active(uint8_t sensor_index);
bool card_sensor_rising_edge(uint8_t sensor_index);
bool card_sensor_falling_edge(uint8_t sensor_index);
bool card_sensor_consume_rising_edge(uint8_t sensor_index);
bool card_sensor_consume_falling_edge(uint8_t sensor_index);
void card_sensor_clear_events(uint8_t sensor_index);

inline bool card_sensor_active(CardSensorId sensor) {
  return card_sensor_active(static_cast<uint8_t>(sensor));
}

inline bool card_sensor_rising_edge(CardSensorId sensor) {
  return card_sensor_rising_edge(static_cast<uint8_t>(sensor));
}

inline bool card_sensor_falling_edge(CardSensorId sensor) {
  return card_sensor_falling_edge(static_cast<uint8_t>(sensor));
}

inline bool card_sensor_consume_rising_edge(CardSensorId sensor) {
  return card_sensor_consume_rising_edge(static_cast<uint8_t>(sensor));
}

inline bool card_sensor_consume_falling_edge(CardSensorId sensor) {
  return card_sensor_consume_falling_edge(static_cast<uint8_t>(sensor));
}

inline void card_sensor_clear_events(CardSensorId sensor) {
  card_sensor_clear_events(static_cast<uint8_t>(sensor));
}

void sensors_clear_events();

}

#endif

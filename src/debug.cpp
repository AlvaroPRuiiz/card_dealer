#include "debug.h"

namespace Debug {

void debug_init(unsigned long baud) {
#if CARD_DEALER_DEBUG
  Serial.begin(baud);
#else
  (void)baud;
#endif
}

void debug_log(const char *message) {
#if CARD_DEALER_DEBUG
  Serial.println(message);
#else
  (void)message;
#endif
}

void debug_log_value(const char *label, long value) {
#if CARD_DEALER_DEBUG
  Serial.print(label);
  Serial.print(": ");
  Serial.println(value);
#else
  (void)label;
  (void)value;
#endif
}

void debug_log_state(const char *state_name) {
#if CARD_DEALER_DEBUG
  Serial.print("FSM: ");
  Serial.println(state_name);
#else
  (void)state_name;
#endif
}

void debug_log_transition(const char *from_state, const char *to_state) {
#if CARD_DEALER_DEBUG
  Serial.print("FSM transition: ");
  Serial.print(from_state);
  Serial.print(" -> ");
  Serial.println(to_state);
#else
  (void)from_state;
  (void)to_state;
#endif
}

void debug_log_event(const char *event_name) {
#if CARD_DEALER_DEBUG
  Serial.print("FSM event: ");
  Serial.println(event_name);
#else
  (void)event_name;
#endif
}

}

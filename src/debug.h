#ifndef CARD_DEALER_DEBUG_H
#define CARD_DEALER_DEBUG_H

#include <Arduino.h>

#ifndef CARD_DEALER_DEBUG
#define CARD_DEALER_DEBUG 1
#endif

namespace Debug {

void debug_init(unsigned long baud = 115200UL);
void debug_log(const char *message);
void debug_log_value(const char *label, long value);
void debug_log_state(const char *state_name);
void debug_log_transition(const char *from_state, const char *to_state);
void debug_log_event(const char *event_name);

}

#if CARD_DEALER_DEBUG
#define DEBUG_LOG(message) Debug::debug_log(message)
#else
#define DEBUG_LOG(message) do { } while (0)
#endif

#if CARD_DEALER_DEBUG
#define DEBUG_EVENT(event_name) Debug::debug_log_event(event_name)
#else
#define DEBUG_EVENT(event_name) do { } while (0)
#endif

#endif

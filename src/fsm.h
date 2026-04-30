#ifndef CARD_DEALER_FSM_H
#define CARD_DEALER_FSM_H

#include <Arduino.h>

enum class FsmState : uint8_t {
  OFF = 0,
  INIT,
  SET_PLAYERS,
  SET_CARDS,
  AUTO_INIT,
  ROTATE_AUTO,
  PUSH_AUTO,
  RETURN_HOME_AUTO,
  IDLE_HOME,
  ROTATE_ONE,
  PUSH_ONE,
  RETURN_HOME_MANUAL,
  ERROR
};

enum class FsmErrorCode : uint8_t {
  NONE = 0,
  ROTATE_TIMEOUT,
  CARD_TIMEOUT,
  RETURN_HOME_TIMEOUT
};

void fsm_init();
void fsm_update();

FsmState fsm_state();
const char *fsm_state_name(FsmState state);

uint8_t fsm_player_count();
uint8_t fsm_cards_per_player();
uint8_t fsm_current_player();
uint16_t fsm_dealt_count();
uint8_t fsm_slot_current();
uint8_t fsm_slot_target();
FsmErrorCode fsm_error_code();
const char *fsm_error_name(FsmErrorCode error_code);
bool fsm_is_busy();

#endif

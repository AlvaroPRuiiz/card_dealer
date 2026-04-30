# Bring-up checklist - Card Dealer

## Antes de alimentar

- Verificar masa comun entre Arduino Mega, L298N, sensores y fuente de motores.
- Verificar polaridad de alimentacion de motores y logica.
- Revisar que no hay cortos entre 5V, GND y VMOT.
- Confirmar pines segun `src/config.h`.
- Dejar motores mecanicamente libres durante la primera prueba.
- Empezar con `CARD_DEALER_DIAGNOSTIC_MODE true`.

## Activar modo diagnostico

En `src/config.h`:

```cpp
#define CARD_DEALER_DIAGNOSTIC_MODE true
```

O por CLI:

```powershell
arduino-cli compile --fqbn arduino:avr:mega --build-property compiler.cpp.extra_flags=-DCARD_DEALER_DIAGNOSTIC_MODE=true .
```

Controles:

- `PWR_SHORT`: siguiente pantalla.
- `ADD_SHORT`: activar/desactivar prueba de motor.
- `PWR_LONG`: parar motores y volver a `DIAG HOME`.

## Orden recomendado

1. LCD y keypad: confirmar que cambia de pantalla con `PWR_SHORT`.
2. HOME Hall: comprobar activo/inactivo y edge al pasar un iman.
3. Sensores de carta: probar `CARD_1`, `CARD_2` y `CARD_3` con una carta.
4. Motor de rotacion: activar brevemente y verificar sentido unico.
5. Motores de reparto: probar `DEAL_1`, `DEAL_2`, `DEAL_3` de uno en uno.
6. Volver a modo normal solo cuando sensores y motores respondan estable.

## Si HOME no detecta

- Medir salida del sensor con multimetro o Serial.
- Revisar alimentacion y masa del sensor.
- Confirmar distancia y polaridad del iman.
- Revisar si el sensor es activo LOW y ajustar `HOME_SENSOR_ACTIVE_LEVEL`.
- Revisar pin `HOME_SENSOR = 33`.

## Si un sensor de carta queda activo fijo

- Comprobar alineacion mecanica y obstrucciones.
- Revisar si el sensor es activo LOW y ajustar `CARD_SENSOR_ACTIVE_LEVEL`.
- Revisar cableado de senal, 5V y GND.
- Probar el sensor fuera del mecanismo.
- No pasar a FSM normal hasta que active y libere de forma repetible.

## Si un motor gira al reves

- Parar con `PWR_LONG`.
- Intercambiar los dos cables del motor en el canal L298N correspondiente.
- No cambiar la FSM: el sistema asume giro logico siempre en avance.
- Repetir prueba de diagnostico del motor.

## Si la LCD no muestra nada

- Revisar contraste del modulo LCD.
- Confirmar pines `LCD_RS`, `LCD_EN`, `LCD_D4..D7`.
- Confirmar `LCD_BACKLIGHT = 10`.
- Revisar alimentacion 5V/GND.
- Confirmar que el keypad responde por A0 si el LCD no imprime.

## Si la FSM entra en ERROR demasiado pronto

- Volver a modo diagnostico.
- Confirmar flancos Hall durante rotacion.
- Confirmar flanco del sensor de carta asociado al motor de reparto activo durante empuje.
- Aumentar temporalmente `ROTATE_TIMEOUT_MS`, `PUSH_TIMEOUT_MS` o `RETURN_HOME_TIMEOUT_MS`.
- Revisar `HALL_REARM_MS` y `CARD_SENSOR_REARM_MS` si hay edges perdidos.

## Criterio para pasar a FSM normal

- LCD/keypad responden.
- HOME detecta activo e edge de forma estable.
- Los tres sensores de carta liberan en reposo y cada uno genera un unico edge por carta.
- Los cuatro motores arrancan/paran desde diagnostico.
- El motor de rotacion gira en el sentido mecanico previsto.
- Ningun motor queda activo al cambiar de pantalla o usar `PWR_LONG`.
- Serial no muestra eventos inesperados en reposo.

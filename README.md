# Card Dealer

Proyecto Arduino Mega para un repartidor automatico de cartas. El sistema
controla una mecanica con cuatro motores DC, tres sensores digitales de paso de
carta, un sensor Hall para referencia HOME y una interfaz LCD Keypad Shield
cableada.

## Arquitectura

- `card_dealer.ino`: punto de entrada minimo de Arduino.
- `src/config.h`: mapa de pines, limites, parametros calibrables y checks.
- `src/hardware.*`: acceso a motores, sensores de carta y sensor Hall.
- `src/ui.*`: LCD 16x2 y keypad analogico por A0.
- `src/fsm.*`: maquina de estados del flujo de reparto.
- `src/diagnostics.*`: modo de diagnostico para bring-up fisico.
- `src/debug.*`: helpers minimos de depuracion serie.
- `docs/`: documentacion tecnica, manual de usuario, memoria y PDFs finales.
- `web/`: web oficial del proyecto, implementada con React, Vite y Tailwind.
- `web/public/assets/`: assets publicos de la web oficial.
- `archive/`: webs antiguas conservadas como legado, no son la web oficial.

## Web oficial

La carpeta `web/` es la web final del proyecto. Las carpetas archivadas en
`archive/` se mantienen solo como referencia historica.

Version desplegada:

https://elco-dealer-web.netlify.app 

Build de produccion:

```powershell
npm.cmd --prefix web run build
```

El resultado `web/dist/` es regenerable y queda excluido por `.gitignore`.

## Modos de trabajo

Modo normal:

- `CARD_DEALER_DIAGNOSTIC_MODE` en `false`.
- `fsm_init()` y `fsm_update()` ejecutan la FSM normal.
- La FSM usa 6 imanes como 6 slots discretos.

Modo diagnostico:

- `CARD_DEALER_DIAGNOSTIC_MODE` en `true`.
- `fsm_init()` y `fsm_update()` delegan en `diagnostics.*`.
- Permite probar HOME, sensores de carta y motores por separado antes de usar
  la FSM completa.

Activacion por macro:

```cpp
#define CARD_DEALER_DIAGNOSTIC_MODE true
```

Tambien puede activarse desde Arduino CLI:

```powershell
arduino-cli compile --fqbn arduino:avr:mega --build-property compiler.cpp.extra_flags=-DCARD_DEALER_DIAGNOSTIC_MODE=true .
```

## Hardware previsto

- Arduino Mega.
- 2 drivers L298N.
- 4 motores DC.
- 3 sensores digitales de carta.
- 1 sensor Hall para HOME.
- LCD Keypad Shield cableada: LCD por pines digitales y keypad por A0.

## Hardware pin map

| Elemento | Pin |
| --- | --- |
| LCD D4, D5, D6, D7 | 4, 5, 6, 7 |
| LCD RS, EN, backlight | 8, 9, 10 |
| LCD keypad | A0 |
| L298N #1 ENA, ENB | 11, 12 |
| L298N #1 IN1, IN2, IN3, IN4 | 22, 23, 24, 25 |
| L298N #2 ENA, ENB | 2, 3 |
| L298N #2 IN1, IN2, IN3, IN4 | 26, 27, 28, 29 |
| Card sensors 1, 2, 3 | 30, 31, 32 |
| HOME Hall sensor | 33 |

Motor roles:

- L298N #1 channel A: rotation motor.
- L298N #1 channel B: deal motor 1.
- L298N #2 channel A: deal motor 2.
- L298N #2 channel B: deal motor 3.

Deal channels:

- DEAL_1 uses CARD_1.
- DEAL_2 uses CARD_2.
- DEAL_3 uses CARD_3.

## Pendiente de calibracion

- Umbrales finales del keypad por A0.
- Polaridad real y filtrado de sensores Hall/carta.
- PWM real de rotacion y reparto.
- Timeouts reales de giro, empuje y retorno a HOME.

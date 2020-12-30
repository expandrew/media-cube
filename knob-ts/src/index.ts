/**
 * knob-ts
 *
 * Adapter to map device inputs to media outputs on Media Cube
 *
 * Supports:
 * - Griffin PowerMate (input)
 * - Senic Nuimo (input)
 * - Sonos (output)
 */

import { Sonos, EVENTS as SonosEvents } from './outputs/sonos';
import { PowerMate, EVENTS as PowerMateEvents } from './inputs/powermate';
import { Nuimo, EVENTS as NuimoEvents } from './inputs/nuimo';

const nuimo = new Nuimo();
const powermate = new PowerMate();
const sonos = new Sonos();

// Map Nuimo inputs to Sonos functions
nuimo.on(NuimoEvents.SINGLE_PRESS, () => sonos.togglePlay());
nuimo.on(NuimoEvents.CLOCKWISE, () => sonos.volumeUp());
nuimo.on(NuimoEvents.COUNTERCLOCKWISE, () => sonos.volumeDown());

// Map PowerMate inputs to Sonos functions
powermate.on(PowerMateEvents.CLOCKWISE, () => sonos.volumeUp());
powermate.on(PowerMateEvents.PRESS_CLOCKWISE, () => sonos.next());
powermate.on(PowerMateEvents.COUNTERCLOCKWISE, () => sonos.volumeDown());
powermate.on(PowerMateEvents.PRESS_COUNTERCLOCKWISE, () => sonos.previous());
powermate.on(PowerMateEvents.SINGLE_PRESS, () => sonos.togglePlay());
powermate.on(PowerMateEvents.LONG_PRESS, () => sonos.toggleGroup());
powermate.on(PowerMateEvents.DOUBLE_PRESS, () => {});

// Map Sonos state updates to PowerMate LED
sonos.on(SonosEvents.PLAYING, () => powermate.setLed({ isOn: true }));
sonos.on(SonosEvents.PAUSED, () => powermate.setLed({ isOn: false }));
sonos.on(SonosEvents.GROUP_CHANGED, ({ isGrouped }) =>
  powermate.setLed({ isOn: true, isPulsing: isGrouped })
);

// For development, uncomment
// import repl from 'repl';
// console.info('Starting repl...');
// const startedRepl = repl.start('>>> ');
// startedRepl.context['sonos'] = sonos;
// startedRepl.context['powermate'] = powermate;

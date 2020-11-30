/**
 * sonos-powermate
 *
 * Control Sonos speakers with a Griffin PowerMate
 *
 * Features:
 * - PowerMate inputs control play/pause/next/previous on Sonos
 * - PowerMate LED state matches Sonos play/pause state
 * - Double-click PowerMate button toggles two preset Sonos groups (use case is "play in just this room, or play in both rooms")
 */

import { Sonos, EVENTS as SonosEvents } from './sonos';
import { PowerMate, LED_STATES, EVENTS as PowerMateEvents } from './powermate';

const powermate = new PowerMate();
const sonos = new Sonos();

// Map inputs to Sonos functions
powermate.on(PowerMateEvents.CLOCKWISE, () => {
  // Prevent changing playback volume when not playing
  if (sonos.isPlaying) {
    sonos.volumeUp();
  }
});
powermate.on(PowerMateEvents.PRESS_CLOCKWISE, () => sonos.next());
powermate.on(PowerMateEvents.COUNTERCLOCKWISE, () => sonos.volumeDown());
powermate.on(PowerMateEvents.PRESS_COUNTERCLOCKWISE, () => sonos.previous());
powermate.on(PowerMateEvents.SINGLE_PRESS, () => sonos.togglePlay());
powermate.on(PowerMateEvents.LONG_PRESS, () => sonos.toggleGroup());
powermate.on(PowerMateEvents.DOUBLE_PRESS, () => {});

// Map Sonos state updates to PowerMate LED
sonos.on(SonosEvents.PLAYING, () => powermate.setLed(LED_STATES.ON));
sonos.on(SonosEvents.PAUSED, () => powermate.setLed(LED_STATES.OFF));

// For development, uncomment
// import repl from 'repl';
// console.info('Starting repl...');
// const startedRepl = repl.start('>>> ');
// startedRepl.context['sonos'] = sonos;
// startedRepl.context['powermate'] = powermate;

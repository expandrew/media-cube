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
import {
  Nuimo,
  EVENTS as NuimoEvents,
  GLYPHS as NuimoGlyphs,
} from './inputs/nuimo';

const nuimo = new Nuimo();
const powermate = new PowerMate();
const sonos = new Sonos();

// Map Nuimo inputs to Sonos functions
nuimo.on(NuimoEvents.SINGLE_PRESS, () => {
  if (sonos.isPlaying) {
    sonos.pause()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PAUSE));
  } else {
    sonos.play()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PLAY));
  }
});
nuimo.on(NuimoEvents.CLOCKWISE, () => sonos.volumeUp());
nuimo.on(NuimoEvents.PRESS_CLOCKWISE, () => sonos.groupVolumeUp());
nuimo.on(NuimoEvents.COUNTERCLOCKWISE, () => sonos.volumeDown());
nuimo.on(NuimoEvents.PRESS_COUNTERCLOCKWISE, () => sonos.groupVolumeDown());
nuimo.on(NuimoEvents.SWIPE_RIGHT, () =>
  sonos.next()?.then(() => nuimo.displayGlyph(NuimoGlyphs.NEXT))
);
nuimo.on(NuimoEvents.SWIPE_LEFT, () =>
  sonos.previous()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PREVIOUS))
);

// Map PowerMate Long Press to reconnect Nuimo if it disconnects (and pulse LED while connecting)
powermate.on(PowerMateEvents.LONG_PRESS, () => nuimo.connect());
nuimo.on(NuimoEvents.DISCOVERY_STARTED, () =>
  powermate.setLed({ isPulsing: true })
);
nuimo.on(NuimoEvents.DISCOVERY_FINISHED, () =>
  powermate.setLed({ isPulsing: false })
);

// Map PowerMate inputs to Sonos functions
powermate.on(PowerMateEvents.CLOCKWISE, () => sonos.volumeUp());
powermate.on(PowerMateEvents.PRESS_CLOCKWISE, () => sonos.groupVolumeUp());
powermate.on(PowerMateEvents.COUNTERCLOCKWISE, () => sonos.volumeDown());
powermate.on(PowerMateEvents.PRESS_COUNTERCLOCKWISE, () =>
  sonos.groupVolumeDown()
);
powermate.on(PowerMateEvents.SINGLE_PRESS, () => sonos.togglePlay());
powermate.on(PowerMateEvents.DOUBLE_PRESS, () => {});

// Map Sonos state updates to PowerMate LED and Nuimo screen
sonos.on(SonosEvents.PLAYING, () => powermate.setLed({ isOn: true }));
sonos.on(SonosEvents.PAUSED, () => powermate.setLed({ isOn: false }));

// For development, uncomment
// import repl from 'repl';
// console.info('Starting repl...');
// const startedRepl = repl.start('>>> ');
// startedRepl.context['sonos'] = sonos;
// startedRepl.context['powermate'] = powermate;

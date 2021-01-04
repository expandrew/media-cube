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

const powermate = new PowerMate();
const sonos = new Sonos();
const nuimo = new Nuimo();

const NuimoInputs: { [eventName: string]: () => void } = {
  CLOCKWISE: () => sonos.volumeUp(),
  PRESS_CLOCKWISE: () => sonos.groupVolumeUp(),
  COUNTERCLOCKWISE: () => sonos.volumeDown(),
  PRESS_COUNTERCLOCKWISE: () => sonos.groupVolumeDown(),
  SINGLE_PRESS: () => {
    if (sonos.isPlaying) {
      sonos.pause()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PAUSE));
    } else {
      sonos.play()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PLAY));
    }
  },
  SWIPE_RIGHT: () =>
    sonos.next()?.then(() => nuimo.displayGlyph(NuimoGlyphs.NEXT)),
  SWIPE_LEFT: () =>
    sonos.previous()?.then(() => nuimo.displayGlyph(NuimoGlyphs.PREVIOUS)),
};

// Map Nuimo inputs to Sonos functions
for (const i in NuimoInputs) {
  nuimo.on(NuimoEvents[i], NuimoInputs[i]);
}

const PowerMateInputs: { [eventName: string]: () => void } = {
  CLOCKWISE: () => sonos.volumeUp(),
  PRESS_CLOCKWISE: () => sonos.groupVolumeUp(),
  COUNTERCLOCKWISE: () => sonos.volumeDown(),
  PRESS_COUNTERCLOCKWISE: () => sonos.groupVolumeDown(),
  SINGLE_PRESS: () => sonos.togglePlay(),
  DOUBLE_PRESS: () => sonos.next(),
  TRIPLE_PRESS: () => sonos.previous(),
  LONG_PRESS: () => nuimo.connect(), // Long Press reconnects Nuimo if it gets disconnected
};

// Map PowerMate inputs to Sonos functions
for (const i in PowerMateInputs) {
  powermate.on(PowerMateEvents[i], PowerMateInputs[i]);
}

// Pulse PowerMate LED when reconnecting Nuimo
nuimo.on(NuimoEvents.DISCOVERY_STARTED, () =>
  powermate.setLed({ isPulsing: true })
);
nuimo.on(NuimoEvents.DISCOVERY_FINISHED, () =>
  powermate.setLed({ isPulsing: false })
);

// Turn on PowerMate LED when Sonos is playing
sonos.on(SonosEvents.PLAYING, () => powermate.setLed({ isOn: true }));
sonos.on(SonosEvents.PAUSED, () => powermate.setLed({ isOn: false }));

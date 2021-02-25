import { Nuimo, NuimoEvents, NuimoGlyphs } from './devices/nuimo';
import { PowerMate, PowerMateEvents } from './devices/powermate';
import { Sonos, SonosEvents } from './devices/sonos';

/** Make devices */
const powermate = new PowerMate();
const nuimo = new Nuimo();
const sonos = new Sonos();

/**
 * PowerMate Inputs
 *
 * Maps each PowerMate input event to methods on other devices
 */
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

for (const i in PowerMateInputs) {
  powermate.on(PowerMateEvents[i], PowerMateInputs[i]);
}

/**
 * PowerMate LED Events
 *
 * List of events on other devices that affect the PowerMate LED
 *
 * - While the Nuimo is connecting, pulse the PowerMate LED
 * - When Sonos is playing/paused, turn on/off the PowerMate LED
 *
 * This is implemented kind of backwards from the other listeners, in that
 * the other device is the source of the event, instead of the PowerMate.
 * I did it this way just for the code organization/folding.
 */
const PowerMateLedEvents = [
  // Start pulsing PowerMate LED when reconnecting Nuimo
  () =>
    nuimo.on(NuimoEvents.DISCOVERY_STARTED, () =>
      powermate.setLed({ isPulsing: true })
    ),
  // Stop pulsing PowerMate LED when Nuimo is reconnected
  () =>
    nuimo.on(NuimoEvents.DISCOVERY_FINISHED, () =>
      powermate.setLed({ isPulsing: false })
    ),
  // Turn on PowerMate LED when Sonos is playing
  () => sonos.on(SonosEvents.PLAYING, () => powermate.setLed({ isOn: true })),
  // Turn off PowerMate LED when Sonos is paused
  () => sonos.on(SonosEvents.PAUSED, () => powermate.setLed({ isOn: false })),
];

for (const e in PowerMateLedEvents) {
  PowerMateLedEvents[e]();
}

/**
 * Nuimo Inputs
 *
 * - Maps each Nuimo event to methods on other devices
 * - Displays a glyph after the method is complete
 */
const NuimoInputs: { [eventName: string]: () => void } = {
  CLOCKWISE: () => {
    sonos.volumeUp()?.then(() =>
      nuimo.displayGlyph(NuimoGlyphs.VOLUME_UP, {
        timeoutMs: 100,
      })
    );
  },
  PRESS_CLOCKWISE: () => {
    sonos
      .groupVolumeUp()
      ?.then(() =>
        nuimo.displayGlyph(NuimoGlyphs.GROUP_VOLUME_UP, {
          timeoutMs: 100,
        })
      )
      .catch(() => nuimo.displayGlyph(NuimoGlyphs.ERROR));
  },
  COUNTERCLOCKWISE: () => {
    sonos.volumeDown()?.then(() =>
      nuimo.displayGlyph(NuimoGlyphs.VOLUME_DOWN, {
        timeoutMs: 100,
      })
    );
  },
  PRESS_COUNTERCLOCKWISE: () => {
    sonos
      .groupVolumeDown()
      ?.then(() =>
        nuimo.displayGlyph(NuimoGlyphs.GROUP_VOLUME_DOWN, {
          timeoutMs: 100,
        })
      )
      .catch(() => nuimo.displayGlyph(NuimoGlyphs.ERROR));
  },
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
  LONG_TOUCH: () => nuimo.displayGlyph(NuimoGlyphs.WAKE_UP),
};

for (const i in NuimoInputs) {
  nuimo.on(NuimoEvents[i], NuimoInputs[i]);
}

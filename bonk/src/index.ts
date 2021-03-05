import { Nuimo, NuimoGlyphs } from './devices/nuimo';
import { PowerMate } from './devices/powermate';
import { Sonos } from './devices/sonos';

const powermate = new PowerMate();
const nuimo = new Nuimo();
const sonos = new Sonos();

/** PowerMate Inputs */
powermate.on('clockwise', () => sonos.volumeUp());
powermate.on('pressClockwise', () => sonos.groupVolumeUp());
powermate.on('counterclockwise', () => sonos.volumeDown());
powermate.on('pressCounterclockwise', () => sonos.groupVolumeDown());
powermate.on('singlePress', () => sonos.togglePlay());
powermate.on('doublePress', () => sonos.next());
powermate.on('triplePress', () => sonos.previous());
powermate.on('longPress', () => nuimo.connect()); // Long Press reconnects Nuimo if it gets disconnected

/** PowerMate LED */
nuimo.on('discoveryStarted', () => powermate.setLed({ isPulsing: true })); // Start pulsing PowerMate LED when reconnecting Nuimo
nuimo.on('discoveryFinished', () => powermate.setLed({ isPulsing: false })); // Stop pulsing PowerMate LED when Nuimo is reconnected
sonos.on('isPlaying', () => powermate.setLed({ isOn: true })); // Turn on PowerMate LED when Sonos is playing
sonos.on('isPaused', () => powermate.setLed({ isOn: false })); // Turn off PowerMate LED when Sonos is paused

/** Nuimo Inputs */
nuimo.on('clockwise', () => callAndShowGlyph(sonos.volumeUp, 'VOLUME_UP'));
nuimo.on('counterclockwise', () =>
  callAndShowGlyph(sonos.volumeDown, 'VOLUME_DOWN')
);
nuimo.on('pressClockwise', () =>
  callAndShowGlyph(sonos.groupVolumeUp, 'GROUP_VOLUME_UP')
);
nuimo.on('pressCounterclockwise', () =>
  callAndShowGlyph(sonos.groupVolumeDown, 'GROUP_VOLUME_DOWN')
);
nuimo.on('singlePress', () =>
  sonos.isPlaying
    ? callAndShowGlyph(sonos.pause, 'PAUSE')
    : callAndShowGlyph(sonos.play, 'PLAY')
);
nuimo.on('swipeRight', () => callAndShowGlyph(sonos.next, 'NEXT'));
nuimo.on('swipeLeft', () => callAndShowGlyph(sonos.previous, 'PREVIOUS'));
nuimo.on('longTouch', () => nuimo.displayGlyph(NuimoGlyphs['WAKE_UP']));

/** Helper for Nuimo to call a function then show a glyph from NuimoGlyphs */
const callAndShowGlyph = (
  fn: () => Promise<any> | undefined,
  glyph: keyof NuimoGlyphs
) => {
  fn()
    ?.then(() => nuimo.displayGlyph(NuimoGlyphs[glyph], { timeoutMs: 100 }))
    .catch(() => nuimo.displayGlyph(NuimoGlyphs.ERROR));
};

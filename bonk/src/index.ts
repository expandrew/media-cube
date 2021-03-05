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
nuimo.on('clockwise', () =>
  sonos.volumeUp()?.then(() => nuimo.displayGlyph(NuimoGlyphs['VOLUME_UP']))
);
nuimo.on('counterclockwise', () =>
  sonos.volumeDown()?.then(() => nuimo.displayGlyph(NuimoGlyphs['VOLUME_DOWN']))
);
nuimo.on('pressClockwise', () =>
  sonos
    .groupVolumeUp()
    ?.then(() => nuimo.displayGlyph(NuimoGlyphs['GROUP_VOLUME_UP']))
);
nuimo.on('pressCounterclockwise', () =>
  sonos
    .groupVolumeDown()
    ?.then(() => nuimo.displayGlyph(NuimoGlyphs['GROUP_VOLUME_DOWN']))
);
nuimo.on('singlePress', () =>
  sonos.isPlaying
    ? sonos.pause()?.then(() => nuimo.displayGlyph(NuimoGlyphs['PAUSE']))
    : sonos.play()?.then(() => nuimo.displayGlyph(NuimoGlyphs['PLAY']))
);
nuimo.on('swipeRight', () =>
  sonos.next()?.then(() => nuimo.displayGlyph(NuimoGlyphs['NEXT']))
);
nuimo.on('swipeLeft', () =>
  sonos.previous()?.then(() => nuimo.displayGlyph(NuimoGlyphs['PREVIOUS']))
);
nuimo.on('longTouch', () => nuimo.displayGlyph(NuimoGlyphs['WAKE_UP']));

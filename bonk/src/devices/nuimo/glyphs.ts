import {
  errorGlyph,
  Glyph,
  leftGlyph,
  pauseGlyph,
  playGlyph,
  rightGlyph,
} from 'rocket-nuimo';

const heartGlyph = Glyph.fromString([
  '         ',
  '  xx xx  ',
  ' xxxxxxx ',
  ' xxxxxxx ',
  '  xxxxx  ',
  '   xxx   ',
  '    x    ',
  '         ',
  '         ',
]);

const minusGlyph = Glyph.fromString([
  '         ',
  '         ',
  '         ',
  '         ',
  '  xxxxx  ',
  '         ',
  '         ',
  '         ',
  '         ',
]);

const plusGlyph = Glyph.fromString([
  '         ',
  '         ',
  '    x    ',
  '    x    ',
  '  xxxxx  ',
  '    x    ',
  '    x    ',
  '         ',
  '         ',
]);

const groupPlusGlyph = Glyph.fromString([
  ' x     x ',
  '         ',
  '    x    ',
  '    x    ',
  '  xxxxx  ',
  '    x    ',
  '    x    ',
  '         ',
  '         ',
]);

const groupMinusGlyph = Glyph.fromString([
  ' x     x ',
  '         ',
  '         ',
  '         ',
  '  xxxxx  ',
  '         ',
  '         ',
  '         ',
  '         ',
]);

/** All possible glyph names */
export type NuimoGlyphs = {
  PLAY: Glyph;
  PAUSE: Glyph;
  NEXT: Glyph;
  PREVIOUS: Glyph;
  WAKE_UP: Glyph;
  VOLUME_DOWN: Glyph;
  VOLUME_UP: Glyph;
  GROUP_VOLUME_DOWN: Glyph;
  GROUP_VOLUME_UP: Glyph;
  ERROR: Glyph;
};

/**
 * Importable object of glyphs that can be displayed on the Nuimo screen
 *
 * Expected to be passed into the `Nuimo.displayGlyph()` function
 */
export const NuimoGlyphs: NuimoGlyphs = {
  PLAY: playGlyph,
  PAUSE: pauseGlyph,
  NEXT: rightGlyph,
  PREVIOUS: leftGlyph,
  WAKE_UP: heartGlyph,
  VOLUME_DOWN: minusGlyph,
  VOLUME_UP: plusGlyph,
  GROUP_VOLUME_DOWN: groupMinusGlyph,
  GROUP_VOLUME_UP: groupPlusGlyph,
  ERROR: errorGlyph,
};

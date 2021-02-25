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

export const NuimoGlyphs: { [glyphName: string]: Glyph } = {
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

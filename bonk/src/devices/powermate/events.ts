/** Events for PowerMate button and rotation */
export const PowerMateEvents = [
  'singlePress',
  'doublePress',
  'triplePress',
  'longPress',
  'clockwise',
  'counterclockwise',
  'pressClockwise',
  'pressCounterclockwise',
];

/** Data to send with events for rotation (clockwise, counterclockwise, pressClockwise, or pressCounterclockwise) */
export type RotationData = { delta: number };

/** Each possible event name, and the data that should be emitted with the event */
export interface PowerMateEvents {
  singlePress: () => void;
  doublePress: () => void;
  triplePress: () => void;
  longPress: () => void;
  clockwise: (data: RotationData) => void;
  counterclockwise: (data: RotationData) => void;
  pressClockwise: (data: RotationData) => void;
  pressCounterclockwise: (data: RotationData) => void;
}

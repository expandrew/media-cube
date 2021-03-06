import { TouchGestureArea } from 'rocket-nuimo';

/** Events for Nuimo discovery, connect, select/tap and rotation */
export const NuimoEvents = [
  'discoveryStarted',
  'discoveryFinished',
  'deviceConnected',
  'deviceDisconnected',
  'singlePress',
  'longPress',
  'clockwise',
  'counterclockwise',
  'pressClockwise',
  'pressCounterclockwise',
  'swipeLeft',
  'swipeRight',
  'swipeUp',
  'swipeDown',
  'touch',
  'longTouch',
];

/** Data to send with events for rotation (clockwise, counterclockwise, pressClockwise, or pressCounterclockwise) */
export type RotationData = { delta: number };

/** Data to send with events for device connection/disconnection */
export type ConnectionData = {
  id: string | undefined;
  batteryLevel?: number | undefined;
};

/** Data to send with stopDiscovery event */
export type DiscoveryFinished = {
  success: boolean;
};

/** Data to send with touch and longTouch events */
export type TouchData = {
  area: TouchGestureArea;
};

/** Each possible event name, and the data that should be emitted with the event */
export interface NuimoEvents {
  discoveryStarted: () => void;
  discoveryFinished: (data: DiscoveryFinished) => void;
  deviceConnected: (data: ConnectionData) => void;
  deviceDisconnected: (data: ConnectionData) => void;
  singlePress: () => void;
  longPress: () => void;
  clockwise: (data: RotationData) => void;
  counterclockwise: (data: RotationData) => void;
  pressClockwise: (data: RotationData) => void;
  pressCounterclockwise: (data: RotationData) => void;
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
  swipeDown: () => void;
  touch: (data: TouchData) => void;
  longTouch: (data: TouchData) => void;
}

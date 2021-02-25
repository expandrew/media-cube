/** Events for Nuimo discovery, connect, select/tap and rotation */
export const NuimoEvents: { [eventName: string]: string } = {
  DISCOVERY_STARTED: 'startDiscovery',
  DISCOVERY_FINISHED: 'stopDiscovery',
  DEVICE_CONNECTED: 'deviceConnected',
  DEVICE_DISCONNECTED: 'deviceDisconnected',
  SINGLE_PRESS: 'singlePress',
  LONG_PRESS: 'longPress',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise',
  PRESS_CLOCKWISE: 'pressClockwise',
  PRESS_COUNTERCLOCKWISE: 'pressCounterclockwise',
  SWIPE_LEFT: 'swipeLeft',
  SWIPE_RIGHT: 'swipeRight',
  SWIPE_UP: 'swipeUp',
  SWIPE_DOWN: 'swipeDown',
  TOUCH: 'touch',
  LONG_TOUCH: 'longTouch',
};

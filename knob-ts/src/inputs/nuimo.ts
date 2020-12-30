import Debug from 'debug';
import { EventEmitter } from 'events';
import { DeviceDiscoveryManager, NuimoControlDevice } from 'rocket-nuimo';

/** Events for Nuimo select/tap and rotation */
export const EVENTS: { [eventName: string]: string } = {
  SINGLE_PRESS: 'singlePress',
  DOUBLE_PRESS: 'doublePress',
  LONG_PRESS: 'longPress',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise',
  PRESS_CLOCKWISE: 'pressClockwise',
  PRESS_COUNTERCLOCKWISE: 'pressCounterclockwise',
};

/** Shortcut to Debug('knob-ts:nuimo')() */
const debug = Debug('knob-ts:nuimo');

/** Debugger for events */
const setupDebug = (nuimo: Nuimo) => {
  for (const event in EVENTS) {
    nuimo.on(EVENTS[event], data => debug({ event, data }));
  }
};

/** Configuration for Nuimo Sensitivity */
const SENSITIVITY = {
  /** Number of milliseconds for button to be held to trigger a "long press" */
  LONG_PRESS_MS: 1000,
  /** Number of milliseconds between presses to trigger a "double press" */
  DOUBLE_PRESS_MS: 300,
};

/** Timers for long/double press events */
type PressTimer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isRunning: boolean;
  PRESS_MS: number;
};

const manager = DeviceDiscoveryManager.defaultManager;

export const startDiscovery = async (): Promise<
  NuimoControlDevice | undefined
> => {
  debug('startDiscovery: Starting Nuimo device discovery');
  const session = manager.startDiscoverySession();
  debug('startDiscovery: Waiting for device...');
  const device = await session.waitForFirstDevice();
  debug(`startDiscovery: Found device: ${device.id}`);
  debug('startDiscovery: Connecting...');
  if (await device.connect()) {
    debug('startDiscovery: Connected to device: %o', {
      batteryLevel: device.batteryLevel,
    });
    device.on('disconnect', () =>
      debug('startDiscovery: Disconnected from device')
    );
    return device;
  } else {
    debug('startDiscovery: Something went wrong');
    return;
  }
};

export class Nuimo extends EventEmitter {
  device: NuimoControlDevice | undefined;
  isPressed: boolean;
  longPress: PressTimer;
  doublePress: PressTimer;

  constructor() {
    super();
    setupDebug(this);

    this.isPressed = false;
    this.longPress = {
      timer: undefined,
      isRunning: false,
      PRESS_MS: SENSITIVITY.LONG_PRESS_MS,
    };
    this.doublePress = {
      timer: undefined,
      isRunning: false,
      PRESS_MS: SENSITIVITY.DOUBLE_PRESS_MS,
    };

    // Find and connect to the Nuimo
    startDiscovery().then(device => {
      this.device = device;

      // Set up presses
      this.device?.on('selectDown', () => this.computePress(1));
      this.device?.on('selectUp', () => this.computePress(0));
    });
  }

  /**
   * Compute press inputs and emit events
   *
   * @param pressInput - boolean 0 or 1 for "up" or "down"
   */
  computePress(pressInput: 0 | 1) {
    const isPressed = Boolean(pressInput);
    const buttonDown = isPressed; // for readability down below
    const buttonUp = !isPressed; // for readability down below

    // If there is a change from what is currently stored:
    if (isPressed != this.isPressed) {
      this.isPressed = isPressed;

      if (buttonDown) {
        // Start LONG_PRESS timer
        this.longPress.isRunning = true;
        this.longPress.timer = setTimeout(() => {
          this.longPress.isRunning = false;
          this.emit(EVENTS.LONG_PRESS);
        }, this.longPress.PRESS_MS);
      }

      if (buttonUp) {
        if (this.longPress.isRunning) {
          // Check if we're within a DOUBLE_PRESS timeout
          if (this.doublePress.isRunning) {
            // If we had a second press within a DOUBLE_PRESS timeout, it's a DOUBLE_PRESS
            this.doublePress.isRunning = false;
            clearTimeout(this.doublePress.timer as NodeJS.Timeout);
            this.emit(EVENTS.DOUBLE_PRESS);
          } else {
            // If we aren't already in a DOUBLE_PRESS timeout, set one
            this.doublePress.isRunning = true;
            this.doublePress.timer = setTimeout(() => {
              // If nothing else happens before the DOUBLE_PRESS timeout finishes, it's a SINGLE_PRESS
              this.doublePress.isRunning = false;
              this.emit(EVENTS.SINGLE_PRESS);
            }, this.doublePress.PRESS_MS);
          }
        }

        // Clear LONG_PRESS timer when released
        clearTimeout(this.longPress.timer as NodeJS.Timeout);
      }
    }
  }
}

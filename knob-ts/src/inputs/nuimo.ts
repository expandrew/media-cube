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
  SWIPE_LEFT: 'swipeLeft',
  SWIPE_RIGHT: 'swipeRight',
  SWIPE_UP: 'swipeUp',
  SWIPE_DOWN: 'swipeDown',
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
  /** Debounce "wait" milliseconds for rotation inputs to alter the "sensitivity" of the knob rotation inputs. A higher value here means it takes more turning to trigger the inputs */
  ROTATION_WAIT_MS: 200,
  /** Debounce "wait" milliseconds for press rotation inputs. Press rotation should be even less sensitive than regular rotation inputs. */
  PRESS_ROTATION_WAIT_MS: 1000,
  /** Minimum delta to register as a rotation event. The Nuimo is very sensitive and sends pretty precise rotation signals, so this filters out anything outside of a threshold */
  ROTATION_MINIMUM_DELTA: 0.0075,
};

/** Debouncers in rotation events */
type Debouncer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isReady: boolean;
  WAIT_MS: number;
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
  rotationDebouncer: Debouncer;
  pressRotationDebouncer: Debouncer;

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
    this.rotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: SENSITIVITY.ROTATION_WAIT_MS,
    };
    this.pressRotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: SENSITIVITY.PRESS_ROTATION_WAIT_MS,
    };

    // Find and connect to the Nuimo
    startDiscovery().then(device => {
      this.device = device;

      // Set up presses
      this.device?.on('selectDown', () => this.computePress(1));
      this.device?.on('selectUp', () => this.computePress(0));

      // Set up rotation
      this.device?.setRotationRange(-1, 1, 0);
      this.device?.on('rotate', (delta: number) => {
        // Check if the delta is above our minimum
        if (Math.abs(delta) > SENSITIVITY.ROTATION_MINIMUM_DELTA) {
          this.computeRotation(delta);
        }
      });

      // Set up swipes
      this.device?.on('swipe', direction =>
        this.emit(EVENTS[`SWIPE_${direction.toUpperCase()}`])
      );
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

  /**
   * Compute rotation inputs and emit events
   *
   * @param delta - the amount that the Nuimo was rotated. Negative is counter-clockwise, positive is clockwise.
   */
  computeRotation(delta: number) {
    if (this.rotationDebouncer.isReady) {
      // Clear LONG_PRESS timer when released
      clearTimeout(this.longPress.timer as NodeJS.Timeout);
      this.longPress.isRunning = false;

      // Use debouncer
      this.rotationDebouncer.isReady = false;
      this.rotationDebouncer.timer = setTimeout(() => {
        if (delta < 0) {
          this.isPressed
            ? this.emitWithDebouncer(
                EVENTS.PRESS_COUNTERCLOCKWISE,
                { delta },
                this.pressRotationDebouncer
              )
            : this.emit(EVENTS.COUNTERCLOCKWISE, {
                delta,
              });
          // Reset device.rotation each time because the library has a "clamp" built into the rotation (min/max) and I don't care about it
          if (this.device) this.device.rotation = 0;
        } else {
          this.isPressed
            ? this.emitWithDebouncer(
                EVENTS.PRESS_CLOCKWISE,
                { delta },
                this.pressRotationDebouncer
              )
            : this.emit(EVENTS.CLOCKWISE, { delta });
          // Reset device.rotation each time because the library has a "clamp" built into the rotation (min/max) and I don't care about it
          if (this.device) this.device.rotation = 0;
        }
        // Reset debouncer "isReady" flag for next input
        this.rotationDebouncer.isReady = true;
      }, this.rotationDebouncer.WAIT_MS);
    }
  }

  /**
   * emitWithDebouncer
   *
   * @param event The event to emit when the debounce is ready
   * @param data The data to send along with the event emitter
   * @param debouncer The debouncer object with `timer`, `isReady`, and `WAIT_MS`
   */
  private emitWithDebouncer(event: string, data: {}, debouncer: Debouncer) {
    if (debouncer.isReady) {
      this.emit(event, { data });
    }
    // Set up debouncer for future events
    debouncer.isReady = false;
    debouncer.timer = setTimeout(() => {
      debouncer.isReady = true;
    }, debouncer.WAIT_MS);
  }
}

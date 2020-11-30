import HID from 'node-hid';
import { EventEmitter } from 'events';
import { setTimeout, clearTimeout } from 'timers';

/**
 * Stores found devices from a `getAllDevices()` call
 */
let allDevices: HID.Device[] | undefined = [];

/**
 * Get all PowerMate devices
 *
 * @remarks `HID.devices()` takes a vendorId and a productId - these are hard-coded to Griffin PowerMate's values
 */
const getAllDevices = () => {
  if (!allDevices?.length) {
    allDevices = HID.devices(1917, 1040);
  }
  return allDevices;
};

/**
 * Events for PowerMate button and rotation
 */
export const EVENTS = {
  SINGLE_PRESS: 'singlePress',
  DOUBLE_PRESS: 'doublePress',
  LONG_PRESS: 'longPress',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise',
  PRESS_CLOCKWISE: 'pressClockwise',
  PRESS_COUNTERCLOCKWISE: 'pressCounterclockwise',
};

/**
 * Number of milliseconds that counts as a "long press"
 */
const LONG_PRESS_MS = 1000;

/**
 * Number of milliseconds between presses to trigger a "double press"
 */
const DOUBLE_PRESS_MS = 300;

/**
 * Debounce milliseconds for rotation inputs
 *
 * This alters the "sensitivity" of the knob rotation inputs
 *
 * A higher value here means it takes more turning to trigger the inputs
 */
const ROTATION_DEBOUNCE_MS = 100;

/**
 * Debounce "wait" milliseconds for press rotation inputs
 *
 * Press rotation should be even less sensitive than regular rotation inputs.
 */
const PRESS_ROTATION_WAIT_MS = 1000;

/**
 * For debouncers in rotation events
 */
type Debouncer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isReady: boolean;
  WAIT_MS: number;
};

/**
 * LED states and their values
 */
export const LED_STATES = {
  ON: 100,
  OFF: 0,
};

/**
 * Number of found PowerMate devices
 */
export const deviceCount = () => getAllDevices().length;

/**
 * The class representing a PowerMate device
 *
 * @param index - which index in the list of PowerMates found (will default to the first if unspecified)
 */
export class PowerMate extends EventEmitter {
  hid: HID.HID;
  isPressed: boolean;
  longPress: {
    timer: ReturnType<typeof setTimeout> | undefined;
    isRunning: boolean;
  };
  doublePress: {
    timer: ReturnType<typeof setTimeout> | undefined;
    isRunning: boolean;
  };
  rotationDebouncer: Debouncer;
  pressRotationDebouncer: Debouncer;
  ledState: number;

  constructor(index: number = 0) {
    super();
    let devices = getAllDevices();
    if (!devices.length) {
      throw new Error('No PowerMates could be found.');
    }
    if (index > devices.length || index < 0) {
      throw new Error(
        `Index ${index} out of range, only ${devices.length} PowerMate(s) found.`
      );
    }

    const path = devices[index].path;
    if (!path) {
      throw new Error(`Path couldn't be found for PowerMate index ${index}.`);
    }

    this.hid = new HID.HID(path);
    this.hid.read(this.interpretData.bind(this));
    this.isPressed = false;
    this.longPress = { timer: undefined, isRunning: false };
    this.doublePress = { timer: undefined, isRunning: false };
    this.rotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: ROTATION_DEBOUNCE_MS,
    };
    this.pressRotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: PRESS_ROTATION_WAIT_MS,
    };
    this.ledState = LED_STATES.ON;
    this.setLed(this.ledState);
  }

  /**
   * Set LED brightness on PowerMate
   * @param brightness - a number between 0-255. Be careful though, the PowerMate's LED can be burned out by prolonged periods of full brightness
   */
  setLed(brightness: number) {
    this.hid.write([0, brightness]);
  }

  /**
   * Callback for interpreting read data from PowerMate
   *
   * Includes:
   * - logic for long/double/single presses and events
   * - logic for clockwise/counterclockwise rotation and events, with debounce
   *
   * @param error - Errors from the PowerMate on input
   * @param data - This comes in as a buffer but HID expects it as `number[]`.
   */
  interpretData(error: any, data: number[]) {
    if (error) {
      throw new Error(error);
    }
    const pressInput = data[0] as 0 | 1;
    const rotationInput = data[1] as number;

    /**
     * Compute press inputs and emit events
     *
     * @param pressInput - the raw input from the read data for the byte representing button presses
     *
     * 💡 Note: DOUBLE_PRESS and LONG_PRESS work in opposite ways!
     *
     * LONG_PRESS means no other button release happens within a long timeout
     * DOUBLE_PRESS means two button releases happen within the short timeout
     * SINGLE_PRESS means only one button release happened within the short timeout
     *
     * @fixme Press event logic would be easier to understand if each timeout emitted its respective event, but this might not actually be possible since LONG_PRESS relies on _nothing_ happening during a timeout and the DOUBLE_PRESS relies on _two things_ happening during a timeout
     */
    const computePress = (pressInput: 0 | 1) => {
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
          }, LONG_PRESS_MS);
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
              }, DOUBLE_PRESS_MS);
            }
          }

          // Clear LONG_PRESS timer when released
          clearTimeout(this.longPress.timer as NodeJS.Timeout);
        }
      }
    };

    /**
     * Compute rotation inputs and emit events
     *
     * @param rotationInput - the raw input from the read data for the byte representing rotation changes
     *
     * Clockwise rotation starts at 1, and increases with faster input
     * Counterclockwise rotation starts at 255, and decreases with faster input
     * rotationInput === 0  means no rotation occurred on this read - this can happen if the user just presses button without rotating, for example
     *
     * rotationInput value increases (or decreases) proportional to how fast you turn the knob
     * ex. a fast clockwise turn can come in as 2, 3, etc.; a fast counterclockwise turn can come as 254, 253, and so on.
     *
     * 128 is the middle of the spectrum: if above this, then it is representing counterclockwise rotation (starting at 255)
     *
     * So, 0-127 is clockwise and 128-255 is counterclockwise
     */
    const computeRotation = (rotationInput: number) => {
      let delta = 0;
      if (rotationInput && this.rotationDebouncer.isReady) {
        // Clear LONG_PRESS timer when released
        clearTimeout(this.longPress.timer as NodeJS.Timeout);
        this.longPress.isRunning = false;

        // Use debouncer
        this.rotationDebouncer.isReady = false;
        this.rotationDebouncer.timer = setTimeout(() => {
          if (rotationInput > 128) {
            delta = -256 + rotationInput; // Counterclockwise rotation is sent starting at 255 so this converts it to a meaningful negative number
            this.isPressed
              ? this.emitWithDebouncer(
                  EVENTS.PRESS_COUNTERCLOCKWISE,
                  { delta },
                  this.pressRotationDebouncer
                )
              : this.emit(EVENTS.COUNTERCLOCKWISE, { delta });
          } else {
            delta = rotationInput; // Clockwise rotation is sent starting at 1, so it will already be a meaningful positive number
            this.isPressed
              ? this.emitWithDebouncer(
                  EVENTS.PRESS_CLOCKWISE,
                  { delta },
                  this.pressRotationDebouncer
                )
              : this.emit(EVENTS.CLOCKWISE, { delta });
          }
          // Reset debouncer "isReady" flag for next input
          this.rotationDebouncer.isReady = true;
        }, ROTATION_DEBOUNCE_MS);
      }
    };

    // Compute inputs and emit events
    computePress(pressInput);
    computeRotation(rotationInput);

    // Restart the read loop
    this.hid.read(this.interpretData.bind(this));
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

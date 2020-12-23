import Debug from 'debug';
import HID from 'node-hid';
import { EventEmitter } from 'events';
import { setTimeout, clearTimeout } from 'timers';

/** For Raspbian, I have to use `libusb` for the HID driver via node-hid because PowerMate doesn't seem to actually register itself as a HID (it has its own driver, not usbhid or hid-generic, and it doesn't get a path like /dev/hidraw... so libusb seems to be my only option*/
HID.setDriverType('libusb');

/** Events for PowerMate button and rotation */
export const EVENTS: { [eventName: string]: string } = {
  SINGLE_PRESS: 'singlePress',
  DOUBLE_PRESS: 'doublePress',
  LONG_PRESS: 'longPress',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise',
  PRESS_CLOCKWISE: 'pressClockwise',
  PRESS_COUNTERCLOCKWISE: 'pressCounterclockwise',
};

/** Debugger for events */
const setupDebug = (powermate: PowerMate) => {
  for (const event in EVENTS) {
    powermate.on(EVENTS[event], data =>
      Debug('knob-ts:powermate')({ event, data })
    );
  }
};

/** For storing and passing around LED-related values in a structured way */
export type LedState = {
  isOn?: boolean;
  isPulsing?: boolean;
  // pulseSpeed?: 'slow' | 'normal' | 'fast'; // TODO: Add pulseSpeed
};

/** Configuration for PowerMate Sensitivity */
const SENSITIVITY = {
  /** Number of milliseconds for button to be held to trigger a "long press" */
  LONG_PRESS_MS: 1000,
  /** Number of milliseconds between presses to trigger a "double press" */
  DOUBLE_PRESS_MS: 300,
  /** Debounce "wait" milliseconds for rotation inputs to alter the "sensitivity" of the knob rotation inputs. A higher value here means it takes more turning to trigger the inputs */
  ROTATION_WAIT_MS: 100,
  /** Debounce "wait" milliseconds for press rotation inputs. Press rotation should be even less sensitive than regular rotation inputs. */
  PRESS_ROTATION_WAIT_MS: 1000,
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

/** Vendor ID for Griffin PowerMate */
const VENDOR_ID = 1917;
/** Product ID for Griffin PowerMate */
const PRODUCT_ID = 1040;

/**
 * The class representing a PowerMate device
 *
 * @param index - which index in the list of PowerMates found (will default to the first if unspecified)
 */
export class PowerMate extends EventEmitter {
  hid: HID.HID;
  isPressed: boolean;
  longPress: PressTimer;
  doublePress: PressTimer;
  rotationDebouncer: Debouncer;
  pressRotationDebouncer: Debouncer;
  ledState: LedState;

  constructor(index: number = 0) {
    super();
    let devices = HID.devices(VENDOR_ID, PRODUCT_ID);
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

    setupDebug(this);

    this.hid = new HID.HID(path);
    this.hid.read(this.interpretData.bind(this));
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
    this.ledState = { isOn: true, isPulsing: false };
    this.setLed(this.ledState);
  }

  /**
   * Set LED information on PowerMate and update internal ledState
   *
   * @param ledState - the `LedState` information with which to update the device
   */
  setLed(ledState: LedState) {
    // NB: I found these definitions in sandeepmistry/node-powermate
    const commands = {
      setBrightness: 0x01,
      setPulseAsleep: 0x02,
      setPulseAwake: 0x03,
      setPulseMode: 0x04,
    };

    // Use brightness command with a fixed brightness for isOn
    const isOnFeatureReport = [
      0,
      0x41,
      1,
      commands.setBrightness,
      0,
      ledState.isOn ? 100 : 0,
      0,
      0,
      0,
    ];

    // Use setPulseAwake command (presumably because the host device is awake? not sleeping?) for isPulsing
    const isPulsingFeatureReport = [
      0,
      0x41,
      1,
      commands.setPulseAwake,
      0,
      ledState.isPulsing ? 1 : 0,
      0,
      0,
      0,
    ];

    // Send to device
    this.hid.sendFeatureReport(isOnFeatureReport);
    this.hid.sendFeatureReport(isPulsingFeatureReport);
    // this.hid.sendFeatureReport(pulseSpeedFeatureReport); // TODO: Add pulseSpeed

    // Update internal ledState
    this.ledState = ledState;
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

    /**
     * Deconstruct the buffer that comes back
     *
     * Byte 0: Button state
     * Byte 1: Rotation delta
     * Byte 2: ? (Always zero)
     * Byte 3: LED brightness
     * Byte 4: LED status
     * Byte 5: LED multiplier (for pulsing LED)
     */
    const pressInput = data[0] as 0 | 1;
    const rotationInput = data[1] as number;
    const ledInput: LedState = {
      isOn: Boolean(data[3]),
      isPulsing: data[4] & 0x4 ? true : false, // ? Sure
      // pulseSpeed: figureOut(data[5]) // TODO: Add pulseSpeed
    };

    /**
     * Compute press inputs and emit events
     *
     * @param pressInput - the raw input from the read data for the byte representing button presses
     *
     * Note: DOUBLE_PRESS and LONG_PRESS are effectively opposites:
     *
     * LONG_PRESS means no other button release happens within a long timeout
     * DOUBLE_PRESS means two button releases happen within a short timeout
     * SINGLE_PRESS means only one button release happened within a short timeout
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
        }, this.rotationDebouncer.WAIT_MS);
      }
    };

    /** Compute LED status and update internal ledState */
    const computeLed = (ledState: LedState) => (this.ledState = ledState);

    // Compute inputs and emit events
    computePress(pressInput);
    computeRotation(rotationInput);
    computeLed(ledInput);

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

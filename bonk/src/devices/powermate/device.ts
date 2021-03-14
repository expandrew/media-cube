import Debug from 'debug';
import { EventEmitter } from 'events';
import HID from 'node-hid';
import { clearTimeout, setTimeout } from 'timers';
import TypedEmitter from 'typed-emitter';
import usbDetect from 'usb-detection';
import { Debouncer, PressTimer, withDebouncer } from '../utils';
import { PowerMateEvents } from './events';

/** For Raspbian, I have to use `libusb` for the HID driver via node-hid because PowerMate doesn't seem to actually register itself as a HID (it has its own driver, not usbhid or hid-generic, and it doesn't get a path like /dev/hidraw... so libusb seems to be my only option*/
HID.setDriverType('libusb');

/** Shortcut to Debug('bonk:powermate')() */
const debug = Debug('bonk:powermate');

/** Debugger for events */
const setupDebug = (powermate: PowerMate) => {
  for (const i in PowerMateEvents) {
    powermate.on(PowerMateEvents[i] as keyof PowerMateEvents, data =>
      debug({ event: PowerMateEvents[i], data })
    );
  }
};

/** Configuration for PowerMate Sensitivity */
const sensitivity = {
  /** Number of milliseconds for button to be held to trigger a "long press" */
  LONG_PRESS_MS: 1000,
  /** Number of milliseconds between presses to trigger a "double(/triple) press" */
  MULTI_PRESS_MS: 500,
  /** Debounce "wait" milliseconds for rotation inputs to alter the "sensitivity" of the knob rotation inputs. A higher value here means it takes more turning to trigger the inputs */
  ROTATION_WAIT_MS: 100,
  /** How long the LED is on for a "flash" */
  FLASH_TIME_MS: 100,
  /** How long the LED is off between "flashes" */
  FLASH_WAIT_MS: 50,
};

/** For storing and passing around LED-related values in a structured way */
export type LedState = {
  isOn?: boolean;
  isPulsing?: boolean;
  // pulseSpeed?: 'slow' | 'normal' | 'fast'; // TODO: Add pulseSpeed
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
export class PowerMate extends (EventEmitter as new () => TypedEmitter<
  PowerMateEvents
>) {
  isPressed: boolean;
  private hid: HID.HID | undefined;
  private longPress: PressTimer;
  private multiPress: PressTimer;
  private rotationDebouncer: Debouncer;
  private ledState: LedState;

  constructor() {
    super();

    setupDebug(this);

    // Set up usb-detection
    debug('usb-detection: Starting...');
    usbDetect.startMonitoring();

    let settingUpHid: ReturnType<typeof setTimeout> | undefined = undefined;
    /** If device is already connected, setupHid() right away */
    usbDetect.find(VENDOR_ID, PRODUCT_ID).then(devices => {
      debug('usb-detection: find(), %O', devices);
      if (devices.length) {
        debug('usb-detection: Already plugged in');
        settingUpHid = this.setupHid();
      }
    });

    /** Detect when device is added and call setupHid() */
    usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, device => {
      debug('usb-detection: Plugged in: %O', device);
      settingUpHid = this.setupHid();
    });

    /** Remove listeners when device is removed */
    usbDetect.on(`remove:${VENDOR_ID}:${PRODUCT_ID}`, () => {
      settingUpHid && clearTimeout(settingUpHid); // This is to prevent error when unplugged while timeout is still running
      debug('HID: Disconnected; Removing...');
      this.hid?.removeAllListeners();
      debug('HID: Disconnected; Removed');
    });

    // Set initial values for everything
    this.isPressed = false;
    this.longPress = {
      count: 0,
      timer: undefined,
      isRunning: false,
      PRESS_MS: sensitivity.LONG_PRESS_MS,
    };
    this.multiPress = {
      count: 0,
      timer: undefined,
      isRunning: false,
      PRESS_MS: sensitivity.MULTI_PRESS_MS,
    };
    this.rotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: sensitivity.ROTATION_WAIT_MS,
    };
    this.ledState = {
      isOn: true,
      isPulsing: false,
    };
  }

  /**
   * Set LED information on PowerMate and update internal ledState
   *
   * @param ledState - the `LedState` information with which to update the device (can accept partial updates)
   */
  setLed(ledState: LedState) {
    // Merge with existing ledState so we can send partial updates (like only isPulsing or only isOn)
    ledState = Object.assign(
      {},
      { isOn: this.ledState.isOn, isPulsing: this.ledState.isPulsing },
      ledState
    );

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
    this.hid?.sendFeatureReport(isOnFeatureReport);
    this.hid?.sendFeatureReport(isPulsingFeatureReport);
    // this.hid.sendFeatureReport(pulseSpeedFeatureReport); // TODO: Add pulseSpeed

    // Update internal ledState
    this.ledState = ledState;
  }

  /**
   * flashLed
   *
   * Flash the PowerMate LED a specified number of times
   *
   * @param count number of times to flash the LED
   */
  flashLed(count: number = 1) {
    // Save current LED state
    const before = this.ledState;

    // Flash the LED
    let flashing = setInterval(() => {
      this.setLed({ isOn: true });
      setTimeout(() => {
        this.setLed({ isOn: false });
      }, sensitivity.FLASH_WAIT_MS);
    }, sensitivity.FLASH_TIME_MS);

    // How long to flash for (count*(roundtrip flash/wait))
    const totalTime =
      count * (sensitivity.FLASH_TIME_MS + sensitivity.FLASH_WAIT_MS);

    // Stop flashing after the correct amount of time
    setTimeout(() => clearInterval(flashing), totalTime);

    debug('flashLed', { count, before, totalTime });
    // Set back to previous state
    this.setLed(before);
  }

  /**
   * Set up HID
   *
   * There's a timeout around this because `HID.devices()` and `new HID.HID()` calls are costly, and HID doesn't find the device immediately if I try assigning things instantly after the device is connected via the event from node-usb-detection, so a timeout will have to do
   */
  private setupHid(timeout: number = 1000) {
    return setTimeout(() => {
      debug(`HID: Starting HID assignment...`);
      this.hid = new HID.HID(VENDOR_ID, PRODUCT_ID);
      this.hid.read(this.interpretData.bind(this));
      this.setLed(this.ledState);
      debug('HID: HID assigned');
    }, timeout);
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
  private interpretData(error: any, data: number[]) {
    if (error) {
      debug('interpretData:', { error });
      return;
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
      // 🧪 Experiment: turning this off so the internal PowerMate ledState.isPulsing doesn't get overwritten on reads (isPulsing uses bad logic to set itself)
      // isPulsing: data[4] & 0x4 ? true : false, // This logic is wrong; this gets set to true sometimes even when the device isn't pulsing
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
      if (isPressed !== this.isPressed) {
        this.isPressed = isPressed;

        if (buttonDown) {
          // Start LONG_PRESS timer
          this.longPress.isRunning = true;
          this.longPress.timer = setTimeout(() => {
            this.longPress.isRunning = false;
            this.emit('longPress');
          }, this.longPress.PRESS_MS);
        }

        if (buttonUp) {
          if (this.longPress.isRunning) {
            // Check if we're within a MULTI_PRESS timeout
            if (this.multiPress.isRunning) {
              // Increment press counter so we can tell how many presses at the end of the counter
              this.multiPress.count++;
            } else {
              // If we aren't already in a MULTI_PRESS timeout, set one
              this.multiPress.isRunning = true;
              this.multiPress.count++;
              this.multiPress.timer = setTimeout(() => {
                // Stop running
                this.multiPress.isRunning = false;

                // See how many presses happened during the timeout and emit the right event
                switch (this.multiPress.count) {
                  case 1:
                    this.emit('singlePress');
                    break;
                  case 2:
                    this.emit('doublePress');
                    break;
                  case 3:
                    this.emit('triplePress');
                    break;
                }
                // Reset count
                this.multiPress.count = 0;
              }, this.multiPress.PRESS_MS);
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
        withDebouncer(this.rotationDebouncer, () => {
          if (rotationInput > 128) {
            delta = -256 + rotationInput; // Counterclockwise rotation is sent starting at 255 so this converts it to a meaningful negative number
            this.isPressed
              ? this.emit('pressCounterclockwise', { delta })
              : this.emit('counterclockwise', { delta });
          } else {
            delta = rotationInput; // Clockwise rotation is sent starting at 1, so it will already be a meaningful positive number
            this.isPressed
              ? this.emit('pressClockwise', { delta })
              : this.emit('clockwise', { delta });
          }
        });
      }
    };

    /** Compute LED status and update internal ledState */
    const computeLed = (ledState: LedState) => (this.ledState = ledState);

    // Compute inputs and emit events
    computePress(pressInput);
    computeRotation(rotationInput);
    computeLed(ledInput);

    // Restart the read loop
    this.hid?.read(this.interpretData.bind(this));
  }
}

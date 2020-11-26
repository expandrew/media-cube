import HID from 'node-hid';
import { EventEmitter } from 'events';

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
  }

  /**
   * Set LED brightness on PowerMate
   * @param brightness - a number between 0-255. Be careful though, the PowerMate's LED can be burned out by prolonged periods of full brightness
   */
  setLed(brightness: number) {
    this.hid.write([0, brightness]);
  }

  /**
   * Callback for interpreting read data on PowerMate
   * @param error - Errors from the PowerMate on input
   * @param data - This comes in as a buffer but HID expects it as `number[]`. `data[0]` is the button's "pressed" state (`00` for unpressed, `01` for pressed), and data[1] is the rotation direction (`01` for clockwise, `ff` for counterclockwise).
   */
  interpretData(error: any, data: number[]) {
    if (error) {
      throw new Error(error);
    }

    // Compute isPressed
    const isPressed = Boolean(data[0]); // data[0] comes in as 1 (pressed) or 0 (unpressed);
    if (isPressed != this.isPressed) {
      this.isPressed = isPressed;
    }

    // Compute rotation
    let delta = 0;
    const rotationInput = data[1];
    /**
     * rotationInput
     *
     * Clockwise rotation starts at 1, and increases with faster input
     * Counterclockwise rotation starts at 255, and decreases with faster input
     *
     * The value increases (or decreases) proportional to how fast you turn the knob
     * ex. a fast clockwise turn can come in as 2, 3, etc.; a fast counterclockwise turn can come as 254, 253, and so on.
     *
     * 128 is the middle of the spectrum: if above this, then it is representing counterclockwise rotation (starting at 255)
     * So, 0-127 is clockwise and 128-255 is counterclockwise
     */
    if (rotationInput) {
      if (rotationInput > 128) {
        delta = -256 + rotationInput; // Counterclockwise rotation is sent starting at 255 so this converts it to a meaningful negative number
        this.emit(EVENTS.COUNTERCLOCKWISE, { delta });
      } else {
        delta = rotationInput; // Clockwise rotation is sent starting at 1, so it will already be a meaningful positive number
        this.emit(EVENTS.CLOCKWISE, { delta });
      }
    }

    // Restart the read loop
    this.hid.read(this.interpretData.bind(this));
  }
}

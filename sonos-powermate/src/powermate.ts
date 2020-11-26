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
  button: 0 | 1; // 0: unpressed; 1: pressed
  position: number;

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
    this.button = 0;
    this.position = 0; // increments up for clockwise rotation, or down for counter clockwise rotation
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

    // Compute button pressed state and store it on this.button
    const button = data[0];
    if (button ^ this.button) {
      this.emit(button ? 'buttonDown' : 'buttonUp', { button });
      this.button = button as 0 | 1;
    }

    // Compute delta for rotation and store it on this.position
    let delta = data[1];
    if (delta) {
      if (delta & 0x80) {
        delta = -256 + delta; // counter clockwise rotation is sent as 255 (ff), so this converts it to -1
      }
      this.position += delta;
      this.emit('turn', { delta, position: this.position });
    }

    // Restart the read loop
    this.hid.read(this.interpretData.bind(this));
  }
}

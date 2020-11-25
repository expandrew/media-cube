import HID from 'node-hid';

let allDevices: HID.Device[] | undefined = [];
const getAllDevices = () => {
  if (!allDevices?.length) {
    allDevices = HID.devices(1917, 1040);
  }
  return allDevices;
};

export const deviceCount = () => getAllDevices().length;

export class PowerMate {
  hid: HID.HID;
  button: number;
  position: number;

  constructor(index: number = 0) {
    let powerMates = getAllDevices();
    if (!powerMates.length) {
      throw new Error('No PowerMates could be found.');
    }
    if (index > powerMates.length || index < 0) {
      throw new Error(
        `Index ${index} out of range, only ${powerMates.length} PowerMate(s) found.`
      );
    }

    const path = powerMates[index].path;
    if (!path) {
      throw new Error(`Path couldn't be found for PowerMate index ${index}.`);
    }

    this.hid = new HID.HID(path);
    this.hid.read(this.interpretData.bind(this));
    this.button = 0;
    this.position = 0;
  }

  setLed(brightness: number) {
    this.hid.write([0, brightness]);
  }

  interpretData(error: any, data: number[]) {
    if (error) {
      throw new Error(error);
    }

    const button = data[0];
    if (button ^ this.button) {
      console.log('button:', button ? 'buttonDown' : 'buttonUp');
      // this.emit(button ? 'buttonDown' : 'buttonUp');
      this.button = button;
    }

    let delta = data[1];
    if (delta) {
      if (delta & 0x80) {
        delta = -256 + delta;
      }
      this.position += delta;
      console.log('position:', { delta, position: this.position });
      // this.emit('turn', delta, this.position);
    }
    this.hid.read(this.interpretData.bind(this));
  }
}

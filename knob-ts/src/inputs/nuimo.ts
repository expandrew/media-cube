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

  constructor() {
    super();
    setupDebug(this);

    // Find and connect to the Nuimo
    startDiscovery().then(device => {
      this.device = device;
    });
  }
}

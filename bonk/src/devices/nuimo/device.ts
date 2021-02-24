import Debug from 'debug';
import { EventEmitter } from 'events';
import {
  DeviceDiscoveryManager,
  DisplayGlyphOptions,
  Glyph,
  NuimoControlDevice,
} from 'rocket-nuimo';
import { NuimoEvents } from './events';

/** Shortcut to Debug('bonk:nuimo')() */
const debug = Debug('bonk:nuimo');

/** Debugger for events */
const setupDebug = (nuimo: Nuimo) => {
  for (const event in NuimoEvents) {
    nuimo.on(NuimoEvents[event], data => debug({ event, data }));
  }
};

/** Configuration for Nuimo Sensitivity */
const sensitivity = {
  /** Number of milliseconds for button to be held to trigger a "long press" */
  LONG_PRESS_MS: 1000,
  /** Debounce "wait" milliseconds for rotation inputs to alter the "sensitivity" of the knob rotation inputs. A higher value here means it takes more turning to trigger the inputs */
  ROTATION_WAIT_MS: 100,
  /** Debounce "wait" milliseconds for press rotation inputs. Press rotation should be even less sensitive than regular rotation inputs. */
  PRESS_ROTATION_WAIT_MS: 100,
  /** Minimum delta to register as a rotation event. The Nuimo is very sensitive and sends pretty precise rotation signals, so this filters out anything outside of a threshold */
  ROTATION_MINIMUM_DELTA: 0.005,
};

/** Debouncers in rotation events */
type Debouncer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isReady: boolean;
  WAIT_MS: number;
};

/** Timers for long press events */
type PressTimer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isRunning: boolean;
  PRESS_MS: number;
};

const manager = DeviceDiscoveryManager.defaultManager;

const startDiscovery = async (): Promise<NuimoControlDevice | undefined> => {
  debug('startDiscovery: Starting Nuimo device discovery');
  const session = manager.startDiscoverySession({ timeoutMs: 60 * 1000 });
  debug('startDiscovery: Waiting for device...');
  const device = await session.waitForFirstDevice();
  debug('startDiscovery: Found device: %o', { id: device.id });
  debug('startDiscovery: Connecting...');
  if (await device.connect()) {
    debug('startDiscovery: Connected to device: %o', {
      id: device.id,
      batteryLevel: device.batteryLevel,
    });
    return device;
  } else {
    debug('startDiscovery: Something went wrong');
    return;
  }
};

export class Nuimo extends EventEmitter {
  device: NuimoControlDevice | undefined;
  isPressed: boolean;
  private longPress: PressTimer;
  private rotationDebouncer: Debouncer;
  private pressRotationDebouncer: Debouncer;

  constructor() {
    super();
    setupDebug(this);

    // Set initial values for everything
    this.isPressed = false;
    this.longPress = {
      timer: undefined,
      isRunning: false,
      PRESS_MS: sensitivity.LONG_PRESS_MS,
    };
    this.rotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: sensitivity.ROTATION_WAIT_MS,
    };
    this.pressRotationDebouncer = {
      timer: undefined,
      isReady: true,
      WAIT_MS: sensitivity.PRESS_ROTATION_WAIT_MS,
    };

    // Find and connect to the Nuimo
    this.connect();
  }

  /**
   * Connect to the Nuimo
   *
   * This will disconnect and remove listeners if a Nuimo is already connected
   */
  connect() {
    // Clear out any devices we may have
    this.device?.disconnect();
    this.device?.removeAllListeners();
    this.device = undefined;

    this.emit(NuimoEvents.DISCOVERY_STARTED);
    startDiscovery()
      .then(device => {
        this.device = device;

        // Set up presses
        this.device?.on('selectDown', () => this.computePress(1));
        this.device?.on('selectUp', () => this.computePress(0));

        // Set up rotation
        this.device?.setRotationRange(-1, 1, 0);
        this.device?.on('rotate', (delta: number) => {
          // Check if the delta is above our minimum
          if (Math.abs(delta) > sensitivity.ROTATION_MINIMUM_DELTA) {
            this.computeRotation(delta);
          }
        });

        // Set up swipes
        this.device?.on('swipe', direction =>
          this.emit(NuimoEvents[`SWIPE_${direction.toUpperCase()}`])
        );

        // Set up touches
        this.device?.on('touch', area =>
          this.emit(NuimoEvents.TOUCH, { area })
        );
        this.device?.on('longTouch', area =>
          this.emit(NuimoEvents.LONG_TOUCH, { area })
        );

        // Set up disconnect behavior
        this.device?.on('disconnect', () => {
          this.device?.removeAllListeners();
          this.emit(NuimoEvents.DEVICE_DISCONNECTED, { id: this.device?.id });
        });

        // Emit success
        this.emit(NuimoEvents.DEVICE_CONNECTED, {
          id: this.device?.id,
          batteryLevel: this.device?.batteryLevel,
        });
        this.emit(NuimoEvents.DISCOVERY_FINISHED, { success: true });
      })
      .catch(() => {
        // Emit failure
        this.emit(NuimoEvents.DISCOVERY_FINISHED, { success: false });
      });
  }

  displayGlyph(
    glyph: Glyph,
    options: DisplayGlyphOptions = { timeoutMs: 1000 }
  ) {
    this.device?.displayGlyph(glyph, options);
  }

  /**
   * Compute press inputs and emit events
   *
   * @param pressInput - boolean 0 or 1 for "up" or "down"
   */
  private computePress(pressInput: 0 | 1) {
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
          this.emit(NuimoEvents.LONG_PRESS);
        }, this.longPress.PRESS_MS);
      }

      if (buttonUp) {
        if (this.longPress.isRunning) {
          this.emit(NuimoEvents.SINGLE_PRESS);
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
  private computeRotation(delta: number) {
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
                NuimoEvents.PRESS_COUNTERCLOCKWISE,
                { delta },
                this.pressRotationDebouncer
              )
            : this.emit(NuimoEvents.COUNTERCLOCKWISE, {
                delta,
              });
          // Reset device.rotation each time because the library has a "clamp" built into the rotation (min/max) and I don't care about it
          if (this.device) this.device.rotation = 0;
        } else {
          this.isPressed
            ? this.emitWithDebouncer(
                NuimoEvents.PRESS_CLOCKWISE,
                { delta },
                this.pressRotationDebouncer
              )
            : this.emit(NuimoEvents.CLOCKWISE, { delta });
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

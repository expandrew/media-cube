import Debug from 'debug';
import { SonosDevice, SonosManager } from '@svrooij/sonos';
import { EventEmitter } from 'events';

/**
 * My Sonos devices and their IPs
 *
 * `PRIMARY` is the main speaker (and acts as the group coordinator when grouped)
 * `SECONDARY` is the speaker that joins/leaves the group when `Sonos.toggleGroup()` is called
 *
 * @todo: Possibly add default volume levels for each device and use when initializing?
 */
const DEVICES = {
  PRIMARY: { name: 'Media Cube', ip: '10.0.1.16' },
  SECONDARY: { name: 'Bedroom', ip: '10.0.1.17' },
};

/** Events for Sonos play state updates */
export const EVENTS: { [eventName: string]: string } = {
  PLAYING: 'isPlaying',
  PAUSED: 'isPaused',
  GROUP_CHANGED: 'groupChanged',
};

/** Debugger for events */
const setupDebug = (sonos: Sonos) => {
  for (const event in EVENTS) {
    sonos.on(EVENTS[event], data => Debug('knob-ts:sonos')({ event, data }));
  }
};

/** The class representing a Sonos setup */
export class Sonos extends EventEmitter {
  manager: SonosManager;
  PRIMARY_DEVICE: SonosDevice | undefined;
  SECONDARY_DEVICE: SonosDevice | undefined;
  isGrouped: boolean;
  isPlaying: boolean;

  constructor() {
    super();
    this.isGrouped = false;
    this.isPlaying = false;

    setupDebug(this);

    // Get device topology from SonosManager
    this.manager = new SonosManager();
    this.manager.InitializeWithDiscovery().then(() => {
      this.manager.Devices.forEach(d => d.LoadDeviceData());

      // Set up shortcut for primary device
      this.PRIMARY_DEVICE = this.manager.Devices.find(
        d => d.Host === DEVICES['PRIMARY'].ip
      );
      // Set up shortcut for secondary device
      this.SECONDARY_DEVICE = this.manager.Devices.find(
        d => d.Host === DEVICES['SECONDARY'].ip
      );

      // Get current play state and update isPlaying
      this.PRIMARY_DEVICE?.AVTransportService.Events.on(
        'serviceEvent',
        data => {
          const isPlaying = data.TransportState === 'PLAYING';

          if (this.isPlaying !== isPlaying) {
            this.isPlaying = isPlaying;
          }

          isPlaying ? this.emit(EVENTS.PLAYING) : this.emit(EVENTS.PAUSED);
        }
      );

      // Get current grouped state and update isGrouped
      [this.PRIMARY_DEVICE, this.SECONDARY_DEVICE].forEach(device => {
        // Check initial group name - if it includes '+ 1' ("Media Cube + 1") then devices are grouped
        this.isGrouped = device?.GroupName?.includes('+ 1') ? true : false;
        this.emit(EVENTS.GROUP_CHANGED, { isGrouped: this.isGrouped });

        // Subscribe to groupname events and update on changes
        device?.Events.on('groupname', groupName => {
          this.isGrouped = groupName.includes('+ 1') ? true : false;
          this.emit(EVENTS.GROUP_CHANGED, { isGrouped: this.isGrouped });
        });
      });
    });
  }

  /**
   * Toggle grouping of devices
   *
   * This adds or removes the SECONDARY_DEVICE from the PRIMARY_DEVICE's group
   *
   * Also sets `isGrouped` if both devices are in the same group
   */
  toggleGroup() {
    if (this.isGrouped) {
      this.SECONDARY_DEVICE?.AVTransportService.BecomeCoordinatorOfStandaloneGroup()
        .then(() => (this.isGrouped = false))
        .catch(error => {
          throw new Error(error);
        });
    } else {
      this.SECONDARY_DEVICE?.JoinGroup(this.PRIMARY_DEVICE?.Name as string)
        .then(() => (this.isGrouped = true))
        .catch(error => {
          throw new Error(error);
        });
    }
  }

  /** Toggle play/pause */
  togglePlay() {
    this.PRIMARY_DEVICE?.TogglePlayback();
  }

  /** Next track */
  next() {
    this.PRIMARY_DEVICE?.Next();
  }

  /** Previous track */
  previous() {
    this.PRIMARY_DEVICE?.Previous();
  }

  /** Volume down for current group */
  volumeDown() {
    if (this.isGrouped) {
      this.SetRelativeVolumeForGroup(-2);
    } else {
      this.PRIMARY_DEVICE?.SetRelativeVolume(-2);
    }
  }

  /** Volume up for current group */
  volumeUp() {
    if (this.isGrouped) {
      this.SetRelativeVolumeForGroup(2);
    } else {
      this.PRIMARY_DEVICE?.SetRelativeVolume(2);
    }
  }

  /**
   * Set relative volume for each device in the group
   * @param volume Relative volume for each speaker
   */
  private SetRelativeVolumeForGroup(volume: number) {
    [this.PRIMARY_DEVICE, this.SECONDARY_DEVICE].forEach(d =>
      d?.SetRelativeVolume(volume)
    );
  }
}

import { SonosDevice, SonosManager } from '@svrooij/sonos';
import Debug from 'debug';
import TypedEmitter from 'typed-emitter';
import { EventEmitter } from 'events';
import { SonosEvents } from './events';

/**
 * My Sonos devices and their IPs
 *
 * `PRIMARY` is the main speaker (and acts as the group coordinator when grouped)
 * `SECONDARY` is the speaker that joins/leaves the group when `Sonos.toggleGroup()` is called
 *
 * Note: to get UUIDs, go to http://10.0.1.16:1400/support/review on the network (pick any Sonos IP) and they will show
 *
 * @todo: Possibly add default volume levels for each device and use when initializing?
 * @todo: Handle more than 2 speakers (and stereo pairs) gracefully 🥴
 */
const devices = {
  ONE_SL: {
    // Bedroom
    ip: '10.0.1.16',
    uuid: 'RINCON_48A6B8126D8001400',
  },
  ROAM: {
    ip: '10.0.1.19',
    uuid: 'RINCON_542A1B4AAAD801400',
  },
  SYMFONISK_BOOKSHELF_2: {
    // Media Cube (L) - stereo pair
    ip: '10.0.1.17',
    uuid: 'RINCON_347E5C3D432001400',
  },
  SYMFONISK_BOOKSHELF: {
    // Media Cube (R) - stereo pair
    ip: '10.0.1.18',
    uuid: 'RINCON_542A1B61CD9201400',
  },
};

/** Debugger for events */
const setupDebug = (sonos: Sonos) => {
  for (const i in SonosEvents) {
    sonos.on(SonosEvents[i] as keyof SonosEvents, data =>
      Debug('bonk:sonos')({ event: SonosEvents[i], data })
    );
  }
};

/** The class representing a Sonos setup */
export class Sonos extends (EventEmitter as new () => TypedEmitter<
  SonosEvents
>) {
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
        d => d.Uuid === devices['SYMFONISK_BOOKSHELF'].uuid
      );
      // Set up shortcut for secondary device
      this.SECONDARY_DEVICE = this.manager.Devices.find(
        d => d.Uuid === devices['ONE_SL'].uuid
      );

      // Get current play state and update isPlaying
      this.PRIMARY_DEVICE?.AVTransportService.Events.on(
        'serviceEvent',
        data => {
          const isPlaying = data.TransportState === 'PLAYING';

          if (this.isPlaying !== isPlaying) {
            this.isPlaying = isPlaying;
          }

          isPlaying ? this.emit('isPlaying') : this.emit('isPaused');
        }
      );

      // Get current grouped state and update isGrouped
      [this.PRIMARY_DEVICE, this.SECONDARY_DEVICE].forEach(device => {
        // Check initial group name - if it includes '+ 1' ("Media Cube + 1") then devices are grouped
        this.isGrouped = device?.GroupName?.includes('+ 1') ? true : false;
        this.emit('groupChanged', { isGrouped: this.isGrouped });

        // Subscribe to groupname events and update on changes
        device?.Events.on('groupname', groupName => {
          this.isGrouped = groupName.includes('+ 1') ? true : false;
          this.emit('groupChanged', { isGrouped: this.isGrouped });
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

  /** Play */
  play() {
    return this.PRIMARY_DEVICE?.Play();
  }

  /** Pause */
  pause() {
    return this.PRIMARY_DEVICE?.Pause();
  }

  /** Next track */
  next() {
    return this.PRIMARY_DEVICE?.Next();
  }

  /** Previous track */
  previous() {
    return this.PRIMARY_DEVICE?.Previous();
  }

  /** Volume down for primary device only */
  volumeDown() {
    return this.PRIMARY_DEVICE?.SetRelativeVolume(-2);
  }

  /** Volume up for primary device only */
  volumeUp() {
    return this.PRIMARY_DEVICE?.SetRelativeVolume(2);
  }

  /** Volume down for group */
  groupVolumeDown() {
    return this.SetRelativeVolumeForGroup(-2);
  }

  /** Volume up for group */
  groupVolumeUp() {
    return this.SetRelativeVolumeForGroup(2);
  }

  /**
   * Set relative volume for each device in the group
   * @param volume Relative volume for each speaker
   */
  private SetRelativeVolumeForGroup(volume: number) {
    return new Promise((resolve, reject) =>
      this.isGrouped
        ? resolve(
            [this.PRIMARY_DEVICE, this.SECONDARY_DEVICE].forEach(d =>
              d?.SetRelativeVolume(volume)
            )
          )
        : reject(false)
    );
  }
}

import { SonosDevice, SonosManager } from '@svrooij/sonos';
import { EventEmitter } from 'events';

/**
 * My Sonos devices and their IPs
 */
const DEVICES = {
  MEDIA_CUBE: { name: 'Media Cube', ip: '10.0.1.16' },
  BEDROOM: { name: 'Bedroom', ip: '10.0.1.17' },
};

/**
 * Events for Sonos play state updates
 */
export const EVENTS = {
  PLAYING: 'isPlaying',
  PAUSED: 'isPaused',
};

/**
 * The class representing my Sonos setup
 */
export class Sonos extends EventEmitter {
  manager: SonosManager;
  MEDIA_CUBE: SonosDevice | undefined;
  BEDROOM: SonosDevice | undefined;
  isGrouped: boolean;
  isPlaying: boolean;

  constructor() {
    super();
    this.isGrouped = false;
    this.isPlaying = false;

    // Get device topology from SonosManager
    this.manager = new SonosManager();
    this.manager.InitializeWithDiscovery().then(() => {
      this.manager.Devices.forEach(d => d.LoadDeviceData());

      // Set up shortcut for Media Cube
      this.MEDIA_CUBE = this.manager.Devices.find(
        d => d.Host === DEVICES['MEDIA_CUBE'].ip
      );
      // Set up shortcut for Bedroom
      this.BEDROOM = this.manager.Devices.find(
        d => d.Host === DEVICES['BEDROOM'].ip
      );

      // Get current play state and update isPlaying
      this.MEDIA_CUBE?.AVTransportService.Events.on('serviceEvent', data => {
        const isPlaying = data.TransportState === 'PLAYING';

        if (this.isPlaying !== isPlaying) {
          this.isPlaying = isPlaying;
        }

        isPlaying ? this.emit(EVENTS.PLAYING) : this.emit(EVENTS.PAUSED);
      });

      // Get current grouped state and update isGrouped
      [this.MEDIA_CUBE, this.BEDROOM].forEach(d => {
        // Check initial group name - if it includes '+ 1' ("Media Cube + 1") then devices are grouped
        this.isGrouped = d?.GroupName?.includes('+ 1') ? true : false;

        // Subscribe to groupname events and update on changes
        d?.Events.on('groupname', groupName => {
          this.isGrouped = groupName.includes('+ 1') ? true : false;
        });
      });
    });
  }

  /**
   * Toggle grouping of speakers between both Media Cube and Bedroom, and just Media Cube
   */
  toggleGroup() {
    if (this.isGrouped) {
      this.BEDROOM?.AVTransportService.BecomeCoordinatorOfStandaloneGroup()
        .then(() => (this.isGrouped = false))
        .catch(error => {
          throw new Error(error);
        });
    } else {
      this.BEDROOM?.JoinGroup(DEVICES['MEDIA_CUBE'].name)
        .then(() => (this.isGrouped = true))
        .catch(error => {
          throw new Error(error);
        });
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlay() {
    this.MEDIA_CUBE?.TogglePlayback();
  }

  /**
   * Next track
   */
  next() {
    this.MEDIA_CUBE?.Next();
  }

  /**
   * Previous track
   */
  previous() {
    this.MEDIA_CUBE?.Previous();
  }

  /**
   * Volume down for current group
   */
  volumeDown() {
    // WIP: This is inelegant; volume within groups gets out of sync - refactor
    if (this.isGrouped) {
      this.MEDIA_CUBE?.SetRelativeVolume(-2);
      this.BEDROOM?.SetRelativeVolume(-2);
    } else {
      this.MEDIA_CUBE?.SetRelativeVolume(-2);
    }
  }

  /**
   * Volume up for current group
   */
  volumeUp() {
    // WIP: This is inelegant; volume within groups gets out of sync - refactor
    if (this.isGrouped) {
      this.MEDIA_CUBE?.SetRelativeVolume(2);
      this.BEDROOM?.SetRelativeVolume(2);
    } else {
      this.MEDIA_CUBE?.SetRelativeVolume(2);
    }
  }
}

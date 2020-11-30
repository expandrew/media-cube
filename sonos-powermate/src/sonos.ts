import { SonosDevice } from '@svrooij/sonos';
import { EventEmitter } from 'events';
// import { SonosManager } from '@svrooij/sonos';

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
  MEDIA_CUBE: SonosDevice;
  BEDROOM: SonosDevice;
  isGrouped: boolean;
  isPlaying: boolean;
  // manager: SonosManager;

  constructor() {
    super();
    this.MEDIA_CUBE = new SonosDevice(DEVICES['MEDIA_CUBE'].ip);
    this.BEDROOM = new SonosDevice(DEVICES['BEDROOM'].ip);
    this.isGrouped = false;
    this.isPlaying = false;

    // Get current play state and update isPlaying
    this.MEDIA_CUBE.AVTransportService.Events.on('serviceEvent', data => {
      const isPlaying = data.TransportState === 'PLAYING';

      if (this.isPlaying !== isPlaying) {
        this.isPlaying = isPlaying;
      }

      isPlaying ? this.emit(EVENTS.PLAYING) : this.emit(EVENTS.PAUSED);
    });

    // WIP: Figure out grouped state on initialize via SonosManager:
    // this.manager = new SonosManager();
    // this.manager.InitializeWithDiscovery(60).then(() => {
    //   // FIXME: Add a listener for when the grouping changes outside of this app
    //   this.manager.Devices.forEach(d => {
    //     console.log('Start listening for event from %s', d.Name);
    //     d.Events.on('groupname', name => {
    //       console.log('Device %s has a new group name %s', d.Name, name);
    //     });
    //   });
    // });
  }

  /**
   * Toggle grouping of speakers between both Media Cube and Bedroom, and just Media Cube
   */
  toggleGroup() {
    if (this.isGrouped) {
      this.BEDROOM.AVTransportService.BecomeCoordinatorOfStandaloneGroup()
        .then(() => (this.isGrouped = false))
        .catch(error => {
          throw new Error(error);
        });
    } else {
      this.BEDROOM.JoinGroup(DEVICES['MEDIA_CUBE'].name)
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
    this.MEDIA_CUBE.TogglePlayback();
  }

  /**
   * Next track
   */
  next() {
    this.MEDIA_CUBE.Next();
  }

  /**
   * Previous track
   */
  previous() {
    this.MEDIA_CUBE.Previous();
  }

  /**
   * Volume down for current group
   */
  volumeDown() {
    // WIP: This is inelegant; volume within groups gets out of sync - refactor
    if (this.isGrouped) {
      this.MEDIA_CUBE.SetRelativeVolume(-2);
      this.BEDROOM.SetRelativeVolume(-2);
    } else {
      this.MEDIA_CUBE.SetRelativeVolume(-2);
    }
  }

  /**
   * Volume up for current group
   */
  volumeUp() {
    // WIP: This is inelegant; volume within groups gets out of sync - refactor
    if (this.isGrouped) {
      this.MEDIA_CUBE.SetRelativeVolume(2);
      this.BEDROOM.SetRelativeVolume(2);
    } else {
      this.MEDIA_CUBE.SetRelativeVolume(2);
    }
  }
}

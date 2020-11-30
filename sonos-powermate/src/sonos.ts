import { SonosDevice } from '@svrooij/sonos';

/**
 * My Sonos devices and their IPs
 */
const DEVICES = {
  MEDIA_CUBE: { name: 'Media Cube', ip: '10.0.1.16' },
  BEDROOM: { name: 'Bedroom', ip: '10.0.1.17' },
};

/**
 * The class representing my Sonos setup
 */
export class Sonos {
  MEDIA_CUBE: SonosDevice;
  BEDROOM: SonosDevice;
  isGrouped: boolean;

  constructor() {
    this.MEDIA_CUBE = new SonosDevice(DEVICES['MEDIA_CUBE'].ip);
    this.BEDROOM = new SonosDevice(DEVICES['BEDROOM'].ip);
    this.isGrouped = false;
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
    this.MEDIA_CUBE.SetRelativeVolume(-2);
  }

  /**
   * Volume up for current group
   */
  volumeUp() {
    this.MEDIA_CUBE.SetRelativeVolume(2);
  }
}

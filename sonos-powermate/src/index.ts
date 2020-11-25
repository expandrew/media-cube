/**
 * sonos-powermate
 *
 * Control Sonos speakers with a Griffin PowerMate
 *
 * Features:
 * - PowerMate inputs control play/pause/next/previous on Sonos
 * - PowerMate LED state matches Sonos play/pause state
 * - Double-click PowerMate button toggles two preset Sonos groups (use case is "play in just this room, or play in both rooms")
 */
import { SonosManager, SonosDevice } from '@svrooij/sonos';

const manager = new SonosManager();

manager.InitializeWithDiscovery(60).then(() => {
  const MEDIA_CUBE: SonosDevice | undefined = manager.Devices.find(
    d => d.Host === '10.0.1.16'
  );
  const BEDROOM: SonosDevice | undefined = manager.Devices.find(
    d => d.Host === '10.0.1.17'
  );

  MEDIA_CUBE?.LoadDeviceData();
  BEDROOM?.LoadDeviceData();
});

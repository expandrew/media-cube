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

// import repl from 'repl';
import { SonosManager, SonosDevice } from '@svrooij/sonos';
import { PowerMate } from './powermate';

// PowerMate things
const powermate = new PowerMate();

// Sonos things
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

  // console.info('Starting repl...');
  // const startedRepl = repl.start('>>> ');
  // startedRepl.context['manager'] = manager;
  // startedRepl.context['powermate'] = powermate;
  // startedRepl.context['MEDIA_CUBE'] = MEDIA_CUBE;
  // startedRepl.context['BEDROOM'] = BEDROOM;
});

/** Events for Sonos play state updates */
export const SonosEvents = ['isPlaying', 'isPaused', 'groupChanged'];

/** Data to send with events for changes to groups for Sonos speakers */
export type GroupChangedData = { isGrouped: boolean };

/** Each possible event name, and the data that should be emitted with the event */
export interface SonosEvents {
  isPlaying: () => void;
  isPaused: () => void;
  groupChanged: (data: GroupChangedData) => void;
}

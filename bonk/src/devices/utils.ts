import { setTimeout } from 'timers';

/** Debouncers in rotation events */
export type Debouncer = {
  /** The timeout object for this Debouncer */
  timer: ReturnType<typeof setTimeout> | undefined;
  /** Whether more events can be emitted or not (this should be reset to true after the `timer` runs out)*/
  isReady: boolean;
  /** Number of milliseconds to wait before another event can be emitted */
  WAIT_MS: number;
};

/** Timers for long/multi press events */
export type PressTimer = {
  /** The count for number of presses within a given timeout (for double- and triple-press) */
  count: number;
  /** The timeout object for this PressTimer */
  timer: ReturnType<typeof setTimeout> | undefined;
  /** Whether the timer is currently running or not (this was hard to tell from the `timer` so I made this shortcut) */
  isRunning: boolean;
  /** Number of milliseconds to wait before the timer runs out */
  PRESS_MS: number;
};

import { setTimeout } from 'timers';

/** Debouncers in rotation events */
export type Debouncer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  isReady: boolean;
  WAIT_MS: number;
};

/** Timers for long/multi press events */
export type PressTimer = {
  count: number;
  timer: ReturnType<typeof setTimeout> | undefined;
  isRunning: boolean;
  PRESS_MS: number;
};

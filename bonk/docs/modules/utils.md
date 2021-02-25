[bonk](../README.md) / utils

# Module: utils

## Table of contents

### Type aliases

- [Debouncer](utils.md#debouncer)
- [PressTimer](utils.md#presstimer)

## Type aliases

### Debouncer

Ƭ **Debouncer**: *object*

Debouncers in rotation events

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`WAIT_MS` | *number* | Number of milliseconds to wait before another event can be emitted   |
`isReady` | *boolean* | Whether more events can be emitted or not (this should be reset to true after the `timer` runs out)   |
`timer` | *ReturnType*<*typeof* setTimeout\> \| *undefined* | The timeout object for this Debouncer   |

Defined in: [utils.ts:4](https://github.com/expandrew/media-cube/blob/a702056/bonk/src/devices/utils.ts#L4)

___

### PressTimer

Ƭ **PressTimer**: *object*

Timers for long/multi press events

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`PRESS_MS` | *number* | Number of milliseconds to wait before the timer runs out   |
`count` | *number* | The count for number of presses within a given timeout (for double- and triple-press)   |
`isRunning` | *boolean* | Whether the timer is currently running or not (this was hard to tell from the `timer` so I made this shortcut)   |
`timer` | *ReturnType*<*typeof* setTimeout\> \| *undefined* | The timeout object for this PressTimer   |

Defined in: [utils.ts:14](https://github.com/expandrew/media-cube/blob/a702056/bonk/src/devices/utils.ts#L14)

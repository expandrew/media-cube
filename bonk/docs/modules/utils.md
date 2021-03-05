[bonk](../README.md) / utils

# Module: utils

## Table of contents

### Type aliases

- [Debouncer](utils.md#debouncer)
- [PressTimer](utils.md#presstimer)

### Functions

- [withDebouncer](utils.md#withdebouncer)

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

Defined in: [utils.ts:4](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/utils.ts#L4)

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

Defined in: [utils.ts:31](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/utils.ts#L31)

## Functions

### withDebouncer

▸ `Const`**withDebouncer**(`debouncer`: [*Debouncer*](utils.md#debouncer), `fn`: () => *void*): *void*

withDebouncer

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`debouncer` | [*Debouncer*](utils.md#debouncer) | The `Debouncer` object with `timer`, `isReady`, and `WAIT_MS`   |
`fn` | () => *void* | The function to call when the debouncer is ready    |

**Returns:** *void*

Defined in: [utils.ts:19](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/utils.ts#L19)

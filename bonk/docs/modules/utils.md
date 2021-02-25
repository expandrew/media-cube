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

Name | Type |
:------ | :------ |
`WAIT_MS` | *number* |
`isReady` | *boolean* |
`timer` | *ReturnType*<*typeof* setTimeout\> \| *undefined* |

Defined in: utils.ts:4

___

### PressTimer

Ƭ **PressTimer**: *object*

Timers for long/multi press events

#### Type declaration:

Name | Type |
:------ | :------ |
`PRESS_MS` | *number* |
`count` | *number* |
`isRunning` | *boolean* |
`timer` | *ReturnType*<*typeof* setTimeout\> \| *undefined* |

Defined in: utils.ts:11

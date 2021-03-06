[bonk](../README.md) / nuimo/events

# Module: nuimo/events

## Table of contents

### Interfaces

- [NuimoEvents](../interfaces/nuimo_events.nuimoevents.md)

### Type aliases

- [ConnectionData](nuimo_events.md#connectiondata)
- [DiscoveryFinished](nuimo_events.md#discoveryfinished)
- [RotationData](nuimo_events.md#rotationdata)
- [TouchData](nuimo_events.md#touchdata)

### Variables

- [NuimoEvents](nuimo_events.md#nuimoevents)

## Type aliases

### ConnectionData

Ƭ **ConnectionData**: *object*

Data to send with events for device connection/disconnection

#### Type declaration:

Name | Type |
:------ | :------ |
`batteryLevel`? | *number* \| *undefined* |
`id` | *string* \| *undefined* |

Defined in: [nuimo/events.ts:27](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L27)

___

### DiscoveryFinished

Ƭ **DiscoveryFinished**: *object*

Data to send with stopDiscovery event

#### Type declaration:

Name | Type |
:------ | :------ |
`success` | *boolean* |

Defined in: [nuimo/events.ts:33](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L33)

___

### RotationData

Ƭ **RotationData**: *object*

Data to send with events for rotation (clockwise, counterclockwise, pressClockwise, or pressCounterclockwise)

#### Type declaration:

Name | Type |
:------ | :------ |
`delta` | *number* |

Defined in: [nuimo/events.ts:24](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L24)

___

### TouchData

Ƭ **TouchData**: *object*

Data to send with touch and longTouch events

#### Type declaration:

Name | Type |
:------ | :------ |
`area` | TouchGestureArea |

Defined in: [nuimo/events.ts:38](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L38)

## Variables

### NuimoEvents

• `Const` **NuimoEvents**: *string*[]

Events for Nuimo discovery, connect, select/tap and rotation

Defined in: [nuimo/events.ts:4](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L4)

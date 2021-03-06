[bonk](../README.md) / [nuimo/events](../modules/nuimo_events.md) / NuimoEvents

# Interface: NuimoEvents

[nuimo/events](../modules/nuimo_events.md).NuimoEvents

Each possible event name, and the data that should be emitted with the event

## Table of contents

### Properties

- [clockwise](nuimo_events.nuimoevents.md#clockwise)
- [counterclockwise](nuimo_events.nuimoevents.md#counterclockwise)
- [deviceConnected](nuimo_events.nuimoevents.md#deviceconnected)
- [deviceDisconnected](nuimo_events.nuimoevents.md#devicedisconnected)
- [discoveryFinished](nuimo_events.nuimoevents.md#discoveryfinished)
- [discoveryStarted](nuimo_events.nuimoevents.md#discoverystarted)
- [longPress](nuimo_events.nuimoevents.md#longpress)
- [longTouch](nuimo_events.nuimoevents.md#longtouch)
- [pressClockwise](nuimo_events.nuimoevents.md#pressclockwise)
- [pressCounterclockwise](nuimo_events.nuimoevents.md#presscounterclockwise)
- [singlePress](nuimo_events.nuimoevents.md#singlepress)
- [swipeDown](nuimo_events.nuimoevents.md#swipedown)
- [swipeLeft](nuimo_events.nuimoevents.md#swipeleft)
- [swipeRight](nuimo_events.nuimoevents.md#swiperight)
- [swipeUp](nuimo_events.nuimoevents.md#swipeup)
- [touch](nuimo_events.nuimoevents.md#touch)

## Properties

### clockwise

• **clockwise**: (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)) => *void*

#### Type declaration:

▸ (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*RotationData*](../modules/nuimo_events.md#rotationdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:50](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L50)

Defined in: [nuimo/events.ts:50](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L50)

___

### counterclockwise

• **counterclockwise**: (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)) => *void*

#### Type declaration:

▸ (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*RotationData*](../modules/nuimo_events.md#rotationdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:51](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L51)

Defined in: [nuimo/events.ts:51](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L51)

___

### deviceConnected

• **deviceConnected**: (`data`: [*ConnectionData*](../modules/nuimo_events.md#connectiondata)) => *void*

#### Type declaration:

▸ (`data`: [*ConnectionData*](../modules/nuimo_events.md#connectiondata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*ConnectionData*](../modules/nuimo_events.md#connectiondata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:46](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L46)

Defined in: [nuimo/events.ts:46](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L46)

___

### deviceDisconnected

• **deviceDisconnected**: (`data`: [*ConnectionData*](../modules/nuimo_events.md#connectiondata)) => *void*

#### Type declaration:

▸ (`data`: [*ConnectionData*](../modules/nuimo_events.md#connectiondata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*ConnectionData*](../modules/nuimo_events.md#connectiondata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:47](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L47)

Defined in: [nuimo/events.ts:47](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L47)

___

### discoveryFinished

• **discoveryFinished**: (`data`: [*DiscoveryFinished*](../modules/nuimo_events.md#discoveryfinished)) => *void*

#### Type declaration:

▸ (`data`: [*DiscoveryFinished*](../modules/nuimo_events.md#discoveryfinished)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*DiscoveryFinished*](../modules/nuimo_events.md#discoveryfinished) |

**Returns:** *void*

Defined in: [nuimo/events.ts:45](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L45)

Defined in: [nuimo/events.ts:45](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L45)

___

### discoveryStarted

• **discoveryStarted**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:44](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L44)

Defined in: [nuimo/events.ts:44](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L44)

___

### longPress

• **longPress**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:49](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L49)

Defined in: [nuimo/events.ts:49](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L49)

___

### longTouch

• **longTouch**: (`data`: [*TouchData*](../modules/nuimo_events.md#touchdata)) => *void*

#### Type declaration:

▸ (`data`: [*TouchData*](../modules/nuimo_events.md#touchdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*TouchData*](../modules/nuimo_events.md#touchdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:59](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L59)

Defined in: [nuimo/events.ts:59](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L59)

___

### pressClockwise

• **pressClockwise**: (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)) => *void*

#### Type declaration:

▸ (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*RotationData*](../modules/nuimo_events.md#rotationdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:52](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L52)

Defined in: [nuimo/events.ts:52](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L52)

___

### pressCounterclockwise

• **pressCounterclockwise**: (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)) => *void*

#### Type declaration:

▸ (`data`: [*RotationData*](../modules/nuimo_events.md#rotationdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*RotationData*](../modules/nuimo_events.md#rotationdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:53](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L53)

Defined in: [nuimo/events.ts:53](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L53)

___

### singlePress

• **singlePress**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:48](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L48)

Defined in: [nuimo/events.ts:48](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L48)

___

### swipeDown

• **swipeDown**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:57](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L57)

Defined in: [nuimo/events.ts:57](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L57)

___

### swipeLeft

• **swipeLeft**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:54](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L54)

Defined in: [nuimo/events.ts:54](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L54)

___

### swipeRight

• **swipeRight**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:55](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L55)

Defined in: [nuimo/events.ts:55](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L55)

___

### swipeUp

• **swipeUp**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Defined in: [nuimo/events.ts:56](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L56)

Defined in: [nuimo/events.ts:56](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L56)

___

### touch

• **touch**: (`data`: [*TouchData*](../modules/nuimo_events.md#touchdata)) => *void*

#### Type declaration:

▸ (`data`: [*TouchData*](../modules/nuimo_events.md#touchdata)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`data` | [*TouchData*](../modules/nuimo_events.md#touchdata) |

**Returns:** *void*

Defined in: [nuimo/events.ts:58](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L58)

Defined in: [nuimo/events.ts:58](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/nuimo/events.ts#L58)

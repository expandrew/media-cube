[bonk](../README.md) / [sonos/device](../modules/sonos_device.md) / Sonos

# Class: Sonos

[sonos/device](../modules/sonos_device.md).Sonos

The class representing a Sonos setup

## Hierarchy

* *TypedEventEmitter*<[*SonosEvents*](../modules/sonos_events.md#sonosevents), this\>

  ↳ **Sonos**

## Table of contents

### Constructors

- [constructor](sonos_device.sonos.md#constructor)

### Properties

- [PRIMARY\_DEVICE](sonos_device.sonos.md#primary_device)
- [SECONDARY\_DEVICE](sonos_device.sonos.md#secondary_device)
- [isGrouped](sonos_device.sonos.md#isgrouped)
- [isPlaying](sonos_device.sonos.md#isplaying)
- [manager](sonos_device.sonos.md#manager)

### Methods

- [SetRelativeVolumeForGroup](sonos_device.sonos.md#setrelativevolumeforgroup)
- [groupVolumeDown](sonos_device.sonos.md#groupvolumedown)
- [groupVolumeUp](sonos_device.sonos.md#groupvolumeup)
- [next](sonos_device.sonos.md#next)
- [pause](sonos_device.sonos.md#pause)
- [play](sonos_device.sonos.md#play)
- [previous](sonos_device.sonos.md#previous)
- [toggleGroup](sonos_device.sonos.md#togglegroup)
- [togglePlay](sonos_device.sonos.md#toggleplay)
- [volumeDown](sonos_device.sonos.md#volumedown)
- [volumeUp](sonos_device.sonos.md#volumeup)

## Constructors

### constructor

\+ **new Sonos**(): [*Sonos*](sonos_device.sonos.md)

**Returns:** [*Sonos*](sonos_device.sonos.md)

Defined in: [sonos/device.ts:45](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L45)

## Properties

### PRIMARY\_DEVICE

• **PRIMARY\_DEVICE**: *undefined* \| *default*

Defined in: [sonos/device.ts:42](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L42)

___

### SECONDARY\_DEVICE

• **SECONDARY\_DEVICE**: *undefined* \| *default*

Defined in: [sonos/device.ts:43](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L43)

___

### isGrouped

• **isGrouped**: *boolean*

Defined in: [sonos/device.ts:44](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L44)

___

### isPlaying

• **isPlaying**: *boolean*

Defined in: [sonos/device.ts:45](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L45)

___

### manager

• **manager**: *default*

Defined in: [sonos/device.ts:41](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L41)

## Methods

### SetRelativeVolumeForGroup

▸ `Private`**SetRelativeVolumeForGroup**(`volume`: *number*): *Promise*<unknown\>

Set relative volume for each device in the group

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`volume` | *number* | Relative volume for each speaker    |

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:169](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L169)

___

### groupVolumeDown

▸ **groupVolumeDown**(): *Promise*<unknown\>

Volume down for group

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:156](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L156)

___

### groupVolumeUp

▸ **groupVolumeUp**(): *Promise*<unknown\>

Volume up for group

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:161](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L161)

___

### next

▸ **next**(): *undefined* \| *Promise*<boolean\>

Next track

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:136](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L136)

___

### pause

▸ **pause**(): *undefined* \| *Promise*<boolean\>

Pause

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:131](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L131)

___

### play

▸ **play**(): *undefined* \| *Promise*<boolean\>

Play

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:126](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L126)

___

### previous

▸ **previous**(): *undefined* \| *Promise*<boolean\>

Previous track

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:141](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L141)

___

### toggleGroup

▸ **toggleGroup**(): *void*

Toggle grouping of devices

This adds or removes the SECONDARY_DEVICE from the PRIMARY_DEVICE's group

Also sets `isGrouped` if both devices are in the same group

**Returns:** *void*

Defined in: [sonos/device.ts:104](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L104)

___

### togglePlay

▸ **togglePlay**(): *void*

Toggle play/pause

**Returns:** *void*

Defined in: [sonos/device.ts:121](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L121)

___

### volumeDown

▸ **volumeDown**(): *undefined* \| *Promise*<number\>

Volume down for primary device only

**Returns:** *undefined* \| *Promise*<number\>

Defined in: [sonos/device.ts:146](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L146)

___

### volumeUp

▸ **volumeUp**(): *undefined* \| *Promise*<number\>

Volume up for primary device only

**Returns:** *undefined* \| *Promise*<number\>

Defined in: [sonos/device.ts:151](https://github.com/expandrew/media-cube/blob/2b29081/bonk/src/devices/sonos/device.ts#L151)

[bonk](../README.md) / [sonos/device](../modules/sonos_device.md) / Sonos

# Class: Sonos

[sonos/device](../modules/sonos_device.md).Sonos

The class representing a Sonos setup

## Hierarchy

* *EventEmitter*

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

Defined in: [sonos/device.ts:40](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L40)

## Properties

### PRIMARY\_DEVICE

• **PRIMARY\_DEVICE**: *undefined* \| *default*

Defined in: [sonos/device.ts:37](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L37)

___

### SECONDARY\_DEVICE

• **SECONDARY\_DEVICE**: *undefined* \| *default*

Defined in: [sonos/device.ts:38](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L38)

___

### isGrouped

• **isGrouped**: *boolean*

Defined in: [sonos/device.ts:39](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L39)

___

### isPlaying

• **isPlaying**: *boolean*

Defined in: [sonos/device.ts:40](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L40)

___

### manager

• **manager**: *default*

Defined in: [sonos/device.ts:36](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L36)

## Methods

### SetRelativeVolumeForGroup

▸ `Private`**SetRelativeVolumeForGroup**(`volume`: *number*): *Promise*<unknown\>

Set relative volume for each device in the group

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`volume` | *number* | Relative volume for each speaker    |

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:166](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L166)

___

### groupVolumeDown

▸ **groupVolumeDown**(): *Promise*<unknown\>

Volume down for group

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:153](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L153)

___

### groupVolumeUp

▸ **groupVolumeUp**(): *Promise*<unknown\>

Volume up for group

**Returns:** *Promise*<unknown\>

Defined in: [sonos/device.ts:158](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L158)

___

### next

▸ **next**(): *undefined* \| *Promise*<boolean\>

Next track

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:133](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L133)

___

### pause

▸ **pause**(): *undefined* \| *Promise*<boolean\>

Pause

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:128](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L128)

___

### play

▸ **play**(): *undefined* \| *Promise*<boolean\>

Play

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:123](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L123)

___

### previous

▸ **previous**(): *undefined* \| *Promise*<boolean\>

Previous track

**Returns:** *undefined* \| *Promise*<boolean\>

Defined in: [sonos/device.ts:138](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L138)

___

### toggleGroup

▸ **toggleGroup**(): *void*

Toggle grouping of devices

This adds or removes the SECONDARY_DEVICE from the PRIMARY_DEVICE's group

Also sets `isGrouped` if both devices are in the same group

**Returns:** *void*

Defined in: [sonos/device.ts:101](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L101)

___

### togglePlay

▸ **togglePlay**(): *void*

Toggle play/pause

**Returns:** *void*

Defined in: [sonos/device.ts:118](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L118)

___

### volumeDown

▸ **volumeDown**(): *undefined* \| *Promise*<number\>

Volume down for primary device only

**Returns:** *undefined* \| *Promise*<number\>

Defined in: [sonos/device.ts:143](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L143)

___

### volumeUp

▸ **volumeUp**(): *undefined* \| *Promise*<number\>

Volume up for primary device only

**Returns:** *undefined* \| *Promise*<number\>

Defined in: [sonos/device.ts:148](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/sonos/device.ts#L148)

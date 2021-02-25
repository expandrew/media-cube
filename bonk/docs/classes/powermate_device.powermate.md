[bonk](../README.md) / [powermate/device](../modules/powermate_device.md) / PowerMate

# Class: PowerMate

[powermate/device](../modules/powermate_device.md).PowerMate

The class representing a PowerMate device

**`param`** which index in the list of PowerMates found (will default to the first if unspecified)

## Hierarchy

* *EventEmitter*

  ↳ **PowerMate**

## Table of contents

### Constructors

- [constructor](powermate_device.powermate.md#constructor)

### Properties

- [hid](powermate_device.powermate.md#hid)
- [isPressed](powermate_device.powermate.md#ispressed)
- [ledState](powermate_device.powermate.md#ledstate)
- [longPress](powermate_device.powermate.md#longpress)
- [multiPress](powermate_device.powermate.md#multipress)
- [pressRotationDebouncer](powermate_device.powermate.md#pressrotationdebouncer)
- [rotationDebouncer](powermate_device.powermate.md#rotationdebouncer)

### Methods

- [emitWithDebouncer](powermate_device.powermate.md#emitwithdebouncer)
- [interpretData](powermate_device.powermate.md#interpretdata)
- [setLed](powermate_device.powermate.md#setled)
- [setupHid](powermate_device.powermate.md#setuphid)

## Constructors

### constructor

\+ **new PowerMate**(): [*PowerMate*](powermate_device.powermate.md)

**Returns:** [*PowerMate*](powermate_device.powermate.md)

Defined in: [powermate/device.ts:58](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L58)

## Properties

### hid

• `Private` **hid**: *undefined* \| *HID*

Defined in: [powermate/device.ts:53](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L53)

___

### isPressed

• **isPressed**: *boolean*

Defined in: [powermate/device.ts:52](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L52)

___

### ledState

• `Private` **ledState**: [*LedState*](../modules/powermate_device.md#ledstate)

Defined in: [powermate/device.ts:58](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L58)

___

### longPress

• `Private` **longPress**: [*PressTimer*](../modules/utils.md#presstimer)

Defined in: [powermate/device.ts:54](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L54)

___

### multiPress

• `Private` **multiPress**: [*PressTimer*](../modules/utils.md#presstimer)

Defined in: [powermate/device.ts:55](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L55)

___

### pressRotationDebouncer

• `Private` **pressRotationDebouncer**: [*Debouncer*](../modules/utils.md#debouncer)

Defined in: [powermate/device.ts:57](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L57)

___

### rotationDebouncer

• `Private` **rotationDebouncer**: [*Debouncer*](../modules/utils.md#debouncer)

Defined in: [powermate/device.ts:56](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L56)

## Methods

### emitWithDebouncer

▸ `Private`**emitWithDebouncer**(`event`: *string*, `data`: {}, `debouncer`: [*Debouncer*](../modules/utils.md#debouncer)): *void*

emitWithDebouncer

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`event` | *string* | The event to emit when the debounce is ready   |
`data` | *object* | The data to send along with the event emitter   |
`debouncer` | [*Debouncer*](../modules/utils.md#debouncer) | The debouncer object with `timer`, `isReady`, and `WAIT_MS`    |

**Returns:** *void*

Defined in: [powermate/device.ts:365](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L365)

___

### interpretData

▸ `Private`**interpretData**(`error`: *any*, `data`: *number*[]): *void*

Callback for interpreting read data from PowerMate

Includes:
- logic for long/double/single presses and events
- logic for clockwise/counterclockwise rotation and events, with debounce

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`error` | *any* | Errors from the PowerMate on input   |
`data` | *number*[] | This comes in as a buffer but HID expects it as `number[]`.    |

**Returns:** *void*

Defined in: [powermate/device.ts:204](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L204)

___

### setLed

▸ **setLed**(`ledState`: [*LedState*](../modules/powermate_device.md#ledstate)): *void*

Set LED information on PowerMate and update internal ledState

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`ledState` | [*LedState*](../modules/powermate_device.md#ledstate) | the `LedState` information with which to update the device (can accept partial updates)    |

**Returns:** *void*

Defined in: [powermate/device.ts:128](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L128)

___

### setupHid

▸ `Private`**setupHid**(`timeout?`: *number*): *Timeout*

Set up HID

There's a timeout around this because `HID.devices()` and `new HID.HID()` calls are costly, and HID doesn't find the device immediately if I try assigning things instantly after the device is connected via the event from node-usb-detection, so a timeout will have to do

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`timeout` | *number* | 1000 |

**Returns:** *Timeout*

Defined in: [powermate/device.ts:184](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/powermate/device.ts#L184)

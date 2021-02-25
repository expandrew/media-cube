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

Defined in: [powermate/device.ts:72](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L72)

## Properties

### hid

• `Private` **hid**: *undefined* \| *HID*

Defined in: [powermate/device.ts:67](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L67)

___

### isPressed

• **isPressed**: *boolean*

Defined in: [powermate/device.ts:66](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L66)

___

### ledState

• `Private` **ledState**: LedState

Defined in: [powermate/device.ts:72](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L72)

___

### longPress

• `Private` **longPress**: PressTimer

Defined in: [powermate/device.ts:68](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L68)

___

### multiPress

• `Private` **multiPress**: PressTimer

Defined in: [powermate/device.ts:69](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L69)

___

### pressRotationDebouncer

• `Private` **pressRotationDebouncer**: Debouncer

Defined in: [powermate/device.ts:71](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L71)

___

### rotationDebouncer

• `Private` **rotationDebouncer**: Debouncer

Defined in: [powermate/device.ts:70](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L70)

## Methods

### emitWithDebouncer

▸ `Private`**emitWithDebouncer**(`event`: *string*, `data`: {}, `debouncer`: Debouncer): *void*

emitWithDebouncer

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`event` | *string* | The event to emit when the debounce is ready   |
`data` | *object* | The data to send along with the event emitter   |
`debouncer` | Debouncer | The debouncer object with `timer`, `isReady`, and `WAIT_MS`    |

**Returns:** *void*

Defined in: [powermate/device.ts:379](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L379)

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

Defined in: [powermate/device.ts:218](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L218)

___

### setLed

▸ **setLed**(`ledState`: LedState): *void*

Set LED information on PowerMate and update internal ledState

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`ledState` | LedState | the `LedState` information with which to update the device (can accept partial updates)    |

**Returns:** *void*

Defined in: [powermate/device.ts:142](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L142)

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

Defined in: [powermate/device.ts:198](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/powermate/device.ts#L198)

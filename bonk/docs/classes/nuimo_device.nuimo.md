[bonk](../README.md) / [nuimo/device](../modules/nuimo_device.md) / Nuimo

# Class: Nuimo

[nuimo/device](../modules/nuimo_device.md).Nuimo

## Hierarchy

* *EventEmitter*

  ↳ **Nuimo**

## Table of contents

### Constructors

- [constructor](nuimo_device.nuimo.md#constructor)

### Properties

- [device](nuimo_device.nuimo.md#device)
- [isPressed](nuimo_device.nuimo.md#ispressed)
- [longPress](nuimo_device.nuimo.md#longpress)
- [pressRotationDebouncer](nuimo_device.nuimo.md#pressrotationdebouncer)
- [rotationDebouncer](nuimo_device.nuimo.md#rotationdebouncer)

### Methods

- [computePress](nuimo_device.nuimo.md#computepress)
- [computeRotation](nuimo_device.nuimo.md#computerotation)
- [connect](nuimo_device.nuimo.md#connect)
- [displayGlyph](nuimo_device.nuimo.md#displayglyph)
- [emitWithDebouncer](nuimo_device.nuimo.md#emitwithdebouncer)

## Constructors

### constructor

\+ **new Nuimo**(): [*Nuimo*](nuimo_device.nuimo.md)

**Returns:** [*Nuimo*](nuimo_device.nuimo.md)

Defined in: [nuimo/device.ts:73](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L73)

## Properties

### device

• **device**: *undefined* \| *NuimoControlDevice*

Defined in: [nuimo/device.ts:69](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L69)

___

### isPressed

• **isPressed**: *boolean*

Defined in: [nuimo/device.ts:70](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L70)

___

### longPress

• `Private` **longPress**: PressTimer

Defined in: [nuimo/device.ts:71](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L71)

___

### pressRotationDebouncer

• `Private` **pressRotationDebouncer**: Debouncer

Defined in: [nuimo/device.ts:73](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L73)

___

### rotationDebouncer

• `Private` **rotationDebouncer**: Debouncer

Defined in: [nuimo/device.ts:72](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L72)

## Methods

### computePress

▸ `Private`**computePress**(`pressInput`: *0* \| *1*): *void*

Compute press inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pressInput` | *0* \| *1* | boolean 0 or 1 for "up" or "down"    |

**Returns:** *void*

Defined in: [nuimo/device.ts:174](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L174)

___

### computeRotation

▸ `Private`**computeRotation**(`delta`: *number*): *void*

Compute rotation inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`delta` | *number* | the amount that the Nuimo was rotated. Negative is counter-clockwise, positive is clockwise.    |

**Returns:** *void*

Defined in: [nuimo/device.ts:207](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L207)

___

### connect

▸ **connect**(): *void*

Connect to the Nuimo

This will disconnect and remove listeners if a Nuimo is already connected

**Returns:** *void*

Defined in: [nuimo/device.ts:106](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L106)

___

### displayGlyph

▸ **displayGlyph**(`glyph`: *Glyph*, `options?`: DisplayGlyphOptions): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`glyph` | *Glyph* |
`options` | DisplayGlyphOptions |

**Returns:** *void*

Defined in: [nuimo/device.ts:162](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L162)

___

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

Defined in: [nuimo/device.ts:252](https://github.com/expandrew/media-cube/blob/fd9cbc6/bonk/src/devices/nuimo/device.ts#L252)

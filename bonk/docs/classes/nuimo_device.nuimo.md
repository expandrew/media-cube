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

Defined in: [nuimo/device.ts:60](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L60)

## Properties

### device

• **device**: *undefined* \| *NuimoControlDevice*

Defined in: [nuimo/device.ts:56](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L56)

___

### isPressed

• **isPressed**: *boolean*

Defined in: [nuimo/device.ts:57](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L57)

___

### longPress

• `Private` **longPress**: [*PressTimer*](../modules/utils.md#presstimer)

Defined in: [nuimo/device.ts:58](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L58)

___

### pressRotationDebouncer

• `Private` **pressRotationDebouncer**: [*Debouncer*](../modules/utils.md#debouncer)

Defined in: [nuimo/device.ts:60](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L60)

___

### rotationDebouncer

• `Private` **rotationDebouncer**: [*Debouncer*](../modules/utils.md#debouncer)

Defined in: [nuimo/device.ts:59](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L59)

## Methods

### computePress

▸ `Private`**computePress**(`pressInput`: *0* \| *1*): *void*

Compute press inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pressInput` | *0* \| *1* | boolean 0 or 1 for "up" or "down"    |

**Returns:** *void*

Defined in: [nuimo/device.ts:162](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L162)

___

### computeRotation

▸ `Private`**computeRotation**(`delta`: *number*): *void*

Compute rotation inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`delta` | *number* | the amount that the Nuimo was rotated. Negative is counter-clockwise, positive is clockwise.    |

**Returns:** *void*

Defined in: [nuimo/device.ts:195](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L195)

___

### connect

▸ **connect**(): *void*

Connect to the Nuimo

This will disconnect and remove listeners if a Nuimo is already connected

**Returns:** *void*

Defined in: [nuimo/device.ts:94](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L94)

___

### displayGlyph

▸ **displayGlyph**(`glyph`: *Glyph*, `options?`: DisplayGlyphOptions): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`glyph` | *Glyph* |
`options` | DisplayGlyphOptions |

**Returns:** *void*

Defined in: [nuimo/device.ts:150](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L150)

___

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

Defined in: [nuimo/device.ts:240](https://github.com/expandrew/media-cube/blob/d151821/bonk/src/devices/nuimo/device.ts#L240)

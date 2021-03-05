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
- [rotationDebouncer](nuimo_device.nuimo.md#rotationdebouncer)

### Methods

- [computePress](nuimo_device.nuimo.md#computepress)
- [computeRotation](nuimo_device.nuimo.md#computerotation)
- [connect](nuimo_device.nuimo.md#connect)
- [displayGlyph](nuimo_device.nuimo.md#displayglyph)

## Constructors

### constructor

\+ **new Nuimo**(): [*Nuimo*](nuimo_device.nuimo.md)

**Returns:** [*Nuimo*](nuimo_device.nuimo.md)

Defined in: [nuimo/device.ts:57](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L57)

## Properties

### device

• **device**: *undefined* \| *NuimoControlDevice*

Defined in: [nuimo/device.ts:54](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L54)

___

### isPressed

• **isPressed**: *boolean*

Defined in: [nuimo/device.ts:55](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L55)

___

### longPress

• `Private` **longPress**: [*PressTimer*](../modules/utils.md#presstimer)

Defined in: [nuimo/device.ts:56](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L56)

___

### rotationDebouncer

• `Private` **rotationDebouncer**: [*Debouncer*](../modules/utils.md#debouncer)

Defined in: [nuimo/device.ts:57](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L57)

## Methods

### computePress

▸ `Private`**computePress**(`pressInput`: *0* \| *1*): *void*

Compute press inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`pressInput` | *0* \| *1* | boolean 0 or 1 for "up" or "down"    |

**Returns:** *void*

Defined in: [nuimo/device.ts:156](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L156)

___

### computeRotation

▸ `Private`**computeRotation**(`delta`: *number*): *void*

Compute rotation inputs and emit events

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`delta` | *number* | the amount that the Nuimo was rotated. Negative is counter-clockwise, positive is clockwise.    |

**Returns:** *void*

Defined in: [nuimo/device.ts:189](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L189)

___

### connect

▸ **connect**(): *void*

Connect to the Nuimo

This will disconnect and remove listeners if a Nuimo is already connected

**Returns:** *void*

Defined in: [nuimo/device.ts:86](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L86)

___

### displayGlyph

▸ **displayGlyph**(`glyph`: *Glyph*, `options?`: DisplayGlyphOptions): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`glyph` | *Glyph* |
`options` | DisplayGlyphOptions |

**Returns:** *void*

Defined in: [nuimo/device.ts:144](https://github.com/expandrew/media-cube/blob/1700072/bonk/src/devices/nuimo/device.ts#L144)

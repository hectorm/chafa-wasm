chafa-wasm

# chafa-wasm

## Table of contents

### Namespaces

- ["chafa-wasm"](modules/chafa_wasm_.md)

### Interfaces

- [ChafaFactory](interfaces/ChafaFactory.md)
- [ChafaModule](interfaces/ChafaModule.md)

### Type Aliases

- [ChafaConfig](README.md#chafaconfig)
- [ImageDataLike](README.md#imagedatalike)
- [PartialChafaConfig](README.md#partialchafaconfig)
- [ReadonlyChafaConfig](README.md#readonlychafaconfig)

## Type Aliases

### ChafaConfig

Ƭ **ChafaConfig**: `Object`

An object that holds the output configuration.
Supports most of the options of the Chafa command-line utility, see its documentation for details.

**`See`**

https://hpjansson.org/chafa/man/

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bg` | `number` |
| `colorExtractor` | `number` \| `string` |
| `colorSpace` | `number` \| `string` |
| `colors` | `number` \| `string` |
| `dither` | `number` \| `string` |
| `ditherGrainHeight` | `number` |
| `ditherGrainWidth` | `number` |
| `ditherIntensity` | `number` |
| `fg` | `number` |
| `fgOnly` | `boolean` |
| `fill` | `string` |
| `fontRatio` | `number` |
| `height` | `number` |
| `optimize` | `number` |
| `preprocess` | `boolean` |
| `symbols` | `string` |
| `threshold` | `number` |
| `width` | `number` |
| `work` | `number` |

___

### ImageDataLike

Ƭ **ImageDataLike**: `Object`

#### Index signature

▪ [x: `string` \| `number` \| `symbol`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Uint8ClampedArray` |
| `height` | `number` |
| `width` | `number` |

___

### PartialChafaConfig

Ƭ **PartialChafaConfig**: \{ [P in keyof ChafaConfig]?: ChafaConfig[P] \| string }

___

### ReadonlyChafaConfig

Ƭ **ReadonlyChafaConfig**: \{ readonly [P in keyof ChafaConfig]: ChafaConfig[P] }

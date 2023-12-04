[chafa-wasm](../README.md) / ChafaModule

# Interface: ChafaModule

An object that contains the Chafa WebAssembly module API.

## Indexable

▪ [x: `string` \| `number` \| `symbol`]: `any`

## Table of contents

### Properties

- [decodeImage](ChafaModule.md#decodeimage)
- [imageToAnsi](ChafaModule.md#imagetoansi)
- [imageToCanvas](ChafaModule.md#imagetocanvas)
- [imageToConsoleLogArgs](ChafaModule.md#imagetoconsolelogargs)
- [imageToHtml](ChafaModule.md#imagetohtml)
- [imageToMatrix](ChafaModule.md#imagetomatrix)

## Properties

### decodeImage

• **decodeImage**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `callback`: (`error`: ``null``, `image`: [`ImageDataLike`](../README.md#imagedatalike)) => `void`(`error`: `unknown`, `image`: ``null``) => `void`) => `void`

#### Type declaration

▸ (`image`, `callback`): `void`

Decodes a PNG, JPEG or WebP image into an ImageDataLike object.
If an already decoded image is specified, it will be left as is.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `callback` | (`error`: ``null``, `image`: [`ImageDataLike`](../README.md#imagedatalike)) => `void`(`error`: `unknown`, `image`: ``null``) => `void` |

##### Returns

`void`

___

### imageToAnsi

• **imageToAnsi**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `config`: [`PartialChafaConfig`](../README.md#partialchafaconfig), `callback`: (`error`: ``null``, `data`: \{ `ansi`: `string` ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `ansi`: ``null`` ; `config`: ``null``  }) => `void`) => `void`

#### Type declaration

▸ (`image`, `config`, `callback`): `void`

Converts an image into an ANSI string.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `config` | [`PartialChafaConfig`](../README.md#partialchafaconfig) |
| `callback` | (`error`: ``null``, `data`: \{ `ansi`: `string` ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `ansi`: ``null`` ; `config`: ``null``  }) => `void` |

##### Returns

`void`

___

### imageToCanvas

• **imageToCanvas**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `config`: [`PartialChafaConfig`](../README.md#partialchafaconfig), `callback`: (`error`: ``null``, `data`: \{ `canvas`: `number` ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `canvas`: ``null`` ; `config`: ``null``  }) => `void`) => `void`

#### Type declaration

▸ (`image`, `config`, `callback`): `void`

Converts an image into a Chafa canvas pointer.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `config` | [`PartialChafaConfig`](../README.md#partialchafaconfig) |
| `callback` | (`error`: ``null``, `data`: \{ `canvas`: `number` ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `canvas`: ``null`` ; `config`: ``null``  }) => `void` |

##### Returns

`void`

___

### imageToConsoleLogArgs

• **imageToConsoleLogArgs**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `config`: [`PartialChafaConfig`](../README.md#partialchafaconfig), `callback`: (`error`: ``null``, `data`: \{ `args`: `string`[] ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `args`: ``null`` ; `config`: ``null``  }) => `void`) => `void`

#### Type declaration

▸ (`image`, `config`, `callback`): `void`

Converts an image into an array of `console.log` arguments.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `config` | [`PartialChafaConfig`](../README.md#partialchafaconfig) |
| `callback` | (`error`: ``null``, `data`: \{ `args`: `string`[] ; `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig)  }) => `void`(`error`: `unknown`, `data`: \{ `args`: ``null`` ; `config`: ``null``  }) => `void` |

##### Returns

`void`

___

### imageToHtml

• **imageToHtml**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `config`: [`PartialChafaConfig`](../README.md#partialchafaconfig), `callback`: (`error`: ``null``, `data`: \{ `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig) ; `html`: `string`  }) => `void`(`error`: `unknown`, `data`: \{ `config`: ``null`` ; `html`: ``null``  }) => `void`) => `void`

#### Type declaration

▸ (`image`, `config`, `callback`): `void`

Converts an image into an HTML string.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `config` | [`PartialChafaConfig`](../README.md#partialchafaconfig) |
| `callback` | (`error`: ``null``, `data`: \{ `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig) ; `html`: `string`  }) => `void`(`error`: `unknown`, `data`: \{ `config`: ``null`` ; `html`: ``null``  }) => `void` |

##### Returns

`void`

___

### imageToMatrix

• **imageToMatrix**: (`image`: `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike), `config`: [`PartialChafaConfig`](../README.md#partialchafaconfig), `callback`: (`error`: ``null``, `data`: \{ `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig) ; `matrix`: `number`[][][]  }) => `void`(`error`: `unknown`, `data`: \{ `config`: ``null`` ; `matrix`: ``null``  }) => `void`) => `void`

#### Type declaration

▸ (`image`, `config`, `callback`): `void`

Converts an image into a matrix of characters.

##### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `ArrayBuffer` \| `ImageData` \| [`ImageDataLike`](../README.md#imagedatalike) |
| `config` | [`PartialChafaConfig`](../README.md#partialchafaconfig) |
| `callback` | (`error`: ``null``, `data`: \{ `config`: [`ReadonlyChafaConfig`](../README.md#readonlychafaconfig) ; `matrix`: `number`[][][]  }) => `void`(`error`: `unknown`, `data`: \{ `config`: ``null`` ; `matrix`: ``null``  }) => `void` |

##### Returns

`void`

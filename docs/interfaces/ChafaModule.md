[**chafa-wasm**](../README.md) • **Docs**

***

[chafa-wasm](../README.md) / ChafaModule

# Interface: ChafaModule

An object that contains the Chafa WebAssembly module API.

## Indexable

 \[`x`: `string` \| `number` \| `symbol`\]: `any`

## Properties

### decodeImage()

> **decodeImage**: (`image`, `callback`) => `void`

Decodes a PNG, JPEG or WebP image into an ImageDataLike object.
If an already decoded image is specified, it will be left as is.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **callback**: [`Callback`](Callback.md)\<[`ImageDataLike`](../type-aliases/ImageDataLike.md), `null`\>

#### Returns

`void`

***

### imageToAnsi()

> **imageToAnsi**: (`image`, `config`, `callback`) => `void`

Converts an image into an ANSI string.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **config**: [`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

• **callback**: [`Callback`](Callback.md)\<`object`, `object`\>

#### Returns

`void`

***

### imageToCanvas()

> **imageToCanvas**: (`image`, `config`, `callback`) => `void`

Converts an image into a Chafa canvas pointer.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **config**: [`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

• **callback**: [`Callback`](Callback.md)\<`object`, `object`\>

#### Returns

`void`

***

### imageToConsoleLogArgs()

> **imageToConsoleLogArgs**: (`image`, `config`, `callback`) => `void`

Converts an image into an array of `console.log` arguments.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **config**: [`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

• **callback**: [`Callback`](Callback.md)\<`object`, `object`\>

#### Returns

`void`

***

### imageToHtml()

> **imageToHtml**: (`image`, `config`, `callback`) => `void`

Converts an image into an HTML string.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **config**: [`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

• **callback**: [`Callback`](Callback.md)\<`object`, `object`\>

#### Returns

`void`

***

### imageToMatrix()

> **imageToMatrix**: (`image`, `config`, `callback`) => `void`

Converts an image into a matrix of characters.

#### Parameters

• **image**: `ArrayBuffer` \| [`ImageDataLike`](../type-aliases/ImageDataLike.md)

• **config**: [`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

• **callback**: [`Callback`](Callback.md)\<`object`, `object`\>

#### Returns

`void`

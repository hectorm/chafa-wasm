[**chafa-wasm**](../README.md)

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

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<[`ImageDataLike`](../type-aliases/ImageDataLike.md)\>

#### Returns

`void`

***

### imageToAnsi()

> **imageToAnsi**: (`image`, `config`, `callback`) => `void`

Converts an image into an ANSI string.

#### Parameters

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### config

[`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<\{ `ansi`: `string`; `config`: `null` \| [`ReadonlyChafaConfig`](../type-aliases/ReadonlyChafaConfig.md); \}\>

#### Returns

`void`

***

### imageToCanvas()

> **imageToCanvas**: (`image`, `config`, `callback`) => `void`

Converts an image into a Chafa canvas pointer.

#### Parameters

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### config

[`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<\{ `canvas`: `number`; `config`: `null` \| [`ReadonlyChafaConfig`](../type-aliases/ReadonlyChafaConfig.md); \}\>

#### Returns

`void`

***

### imageToConsoleLogArgs()

> **imageToConsoleLogArgs**: (`image`, `config`, `callback`) => `void`

Converts an image into an array of `console.log` arguments.

#### Parameters

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### config

[`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<\{ `args`: `string`[]; `config`: `null` \| [`ReadonlyChafaConfig`](../type-aliases/ReadonlyChafaConfig.md); \}\>

#### Returns

`void`

***

### imageToHtml()

> **imageToHtml**: (`image`, `config`, `callback`) => `void`

Converts an image into an HTML string.

#### Parameters

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### config

[`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<\{ `config`: `null` \| [`ReadonlyChafaConfig`](../type-aliases/ReadonlyChafaConfig.md); `html`: `string`; \}\>

#### Returns

`void`

***

### imageToMatrix()

> **imageToMatrix**: (`image`, `config`, `callback`) => `void`

Converts an image into a matrix of characters.

#### Parameters

##### image

`ArrayBufferLike` | [`ImageDataLike`](../type-aliases/ImageDataLike.md)

##### config

[`PartialChafaConfig`](../type-aliases/PartialChafaConfig.md)

##### callback

[`Callback`](../type-aliases/Callback.md)\<\{ `config`: `null` \| [`ReadonlyChafaConfig`](../type-aliases/ReadonlyChafaConfig.md); `matrix`: `number`[][][]; \}\>

#### Returns

`void`

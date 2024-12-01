import { test, describe, it } from "node:test";
import assert from "node:assert/strict";

globalThis.test = test;
globalThis.describe = describe;
globalThis.it = it;
globalThis.assert = assert;
globalThis.assertEquals = assert.deepStrictEqual;
globalThis.assertMatch = assert.match;
globalThis.assertThrows = assert.throws;
globalThis.assertRejects = assert.rejects;

// @ts-expect-error
import Chafa from "../dist/chafa.js";

globalThis.Chafa = Chafa;

await import("./test.js");

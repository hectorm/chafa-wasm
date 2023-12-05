import { test, describe, it, expect } from "bun:test";

globalThis.test = test;
globalThis.describe = describe;
globalThis.it = it;
globalThis.assert = (a) => expect(a).toBeTruthy();
globalThis.assertEquals = (a, b) => expect(a).toStrictEqual(b);
globalThis.assertMatch = (a, b) => expect(b.test(a)).toBe(true);
globalThis.assertThrows = (a) => expect(a).toThrow();
globalThis.assertRejects = (a) => expect(a).toThrow();

import Chafa from "../dist/chafa.js";

globalThis.Chafa = Chafa;

await import("./test.js");

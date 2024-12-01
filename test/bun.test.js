import { test, describe, it, expect } from "bun:test";

globalThis.test = test;
globalThis.describe = describe;
globalThis.it = it;
/** @type {(a: unknown) => void} */
globalThis.assert = (a) => expect(a).toBeTruthy();
/** @type {(a: unknown, b: unknown) => void} */
globalThis.assertEquals = (a, b) => expect(a).toStrictEqual(b);
/** @type {(a: string, b: RegExp) => void} */
globalThis.assertMatch = (a, b) => expect(b.test(a)).toBe(true);
/** @type {(a: () => unknown) => void} */
globalThis.assertThrows = (a) => expect(a).toThrow();
/** @type {(a: () => Promise<unknown>) => void} */
globalThis.assertRejects = (a) => expect(a).toThrow();

// @ts-expect-error
import Chafa from "../dist/chafa.js";

globalThis.Chafa = Chafa;

await import("./test.js");

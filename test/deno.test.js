/* global Deno */
// @ts-expect-error
import { describe, it } from "jsr:@std/testing@1/bdd";
// @ts-expect-error
import { assert, assertEquals, assertMatch, assertThrows, assertRejects } from "jsr:@std/assert@1";

// @ts-expect-error
globalThis.test = Deno.test;
globalThis.describe = describe;
globalThis.it = it;
globalThis.assert = assert;
globalThis.assertEquals = assertEquals;
globalThis.assertMatch = assertMatch;
globalThis.assertThrows = assertThrows;
globalThis.assertRejects = assertRejects;

// @ts-expect-error
import Chafa from "../dist/chafa.js";

globalThis.Chafa = Chafa;

await import("./test.js");

/* global Deno */
// @ts-ignore
import { describe, it } from "jsr:@std/testing@1/bdd";
// @ts-ignore
import { assert, assertEquals, assertMatch, assertThrows, assertRejects } from "jsr:@std/assert@1";

// @ts-ignore
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

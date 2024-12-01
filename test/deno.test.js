/* global Deno */
// @ts-nocheck
import { describe, it } from "jsr:@std/testing@1/bdd";
import { assert, assertEquals, assertMatch, assertThrows, assertRejects } from "jsr:@std/assert@1";

globalThis.test = Deno.test;
globalThis.describe = describe;
globalThis.it = it;
globalThis.assert = assert;
globalThis.assertEquals = assertEquals;
globalThis.assertMatch = assertMatch;
globalThis.assertThrows = assertThrows;
globalThis.assertRejects = assertRejects;

import Chafa from "../dist/chafa.js";

globalThis.Chafa = Chafa;

await import("./test.js");

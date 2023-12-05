import { describe, it } from "https://deno.land/std/testing/bdd.ts";
import { assert, assertEquals, assertMatch, assertThrows, assertRejects } from "https://deno.land/std/testing/asserts.ts";

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

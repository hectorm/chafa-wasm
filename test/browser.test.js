import fs from "node:fs";
import module from "node:module";
import process from "node:process";
import playwright from "playwright";

const require = module.createRequire(import.meta.url);

/*
 * It is possible to run the tests on a remote server by setting the environment variable "PW_TEST_CONNECT_WS_ENDPOINT".
 * E.g.:
 *   The following command will start a server on port 3000:
 *     $ docker run --rm -it -p 127.0.0.1:3000:3000/tcp --entrypoint /bin/sh mcr.microsoft.com/playwright:latest -euc 'npx -y playwright run-server --port 3000'
 *   Then, the tests can be run with:
 *     $ PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:3000/ npm run test:browser
 */

const browserName = process.argv[2];
/** @type {playwright.BrowserType} */
let browserType;
switch (browserName) {
  case "chromium":
    browserType = playwright.chromium;
    break;
  case "firefox":
    browserType = playwright.firefox;
    break;
  case "webkit":
    browserType = playwright.webkit;
    break;
  default:
    console.error(`Invalid browser: ${browserName}`);
    process.exit(1);
}
const browserWsEndpoint = process.env.PW_TEST_CONNECT_WS_ENDPOINT;
const browser = await (browserWsEndpoint ? browserType.connect(browserWsEndpoint) : browserType.launch());

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => process.stdout.write(msg.text()));

  await page.exposeFunction("exit", async (/** @type {number} */ code) => {
    await browser.close();
    process.exit(code);
  });

  await page.addScriptTag({
    path: require.resolve("mocha/mocha.js"),
  });

  const chaiJsData = fs.readFileSync(require.resolve("chai/chai.js"));
  const chaiJsUri = `data:application/javascript;base64,${chaiJsData.toString("base64")}`;

  const chafaWasmData = fs.readFileSync(require.resolve("../dist/chafa.wasm"));
  const chafaWasmUri = `data:application/octet-stream;base64,${chafaWasmData.toString("base64")}`;

  const chafaJsData = fs.readFileSync(require.resolve("../dist/chafa.js"));
  const chafaJsPatchedData = Buffer.from(chafaJsData.toString("utf-8").replaceAll("chafa.wasm", chafaWasmUri));
  const chafaJsUri = `data:application/javascript;base64,${chafaJsPatchedData.toString("base64")}`;

  const testJsData = fs.readFileSync(require.resolve("./test.js"));
  const testJsUri = `data:application/javascript;base64,${testJsData.toString("base64")}`;

  await page.addScriptTag({
    type: "importmap",
    content: JSON.stringify({
      imports: {
        chai: chaiJsUri,
        chafa: chafaJsUri,
        test: testJsUri,
      },
    }),
  });

  await page.addScriptTag({
    type: "module",
    content: `
      import { assert } from "chai";

      globalThis.assert = assert;
      globalThis.assertEquals = assert.deepEqual;
      globalThis.assertMatch = assert.match;
      globalThis.assertThrows = assert.throws;
      globalThis.assertRejects = (a) => a().then(
        () => assert.fail("expected function to throw an error"),
        (e) => assert.throws(() => { throw e; })
      );

      import Chafa from "chafa";

      globalThis.Chafa = Chafa;

      mocha.setup({ ui: "bdd", reporter: "tap" });
      await import("test");
      mocha.run((code) => setTimeout(() => exit(code), 10));
    `,
  });

  page
    .waitForTimeout(60000)
    .then(async () => {
      console.error("Timeout");
      await browser.close();
      process.exit(1);
    })
    .catch(() => {});
} catch (error) {
  console.error(error);
  await browser.close();
  process.exit(1);
}

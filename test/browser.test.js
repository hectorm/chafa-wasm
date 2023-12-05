import fs from "node:fs";
import module from "node:module";
import playwright from "playwright";

const require = module.createRequire(import.meta.url);

/*
 * It is possible to run the tests on a remote server by setting the environment variable "TEST_BROWSER_WS_ENDPOINT".
 * E.g.:
 *   The following command will start a server on port 3000:
 *     $ docker run --rm -it -p 127.0.0.1:3000:3000/tcp --entrypoint /bin/sh mcr.microsoft.com/playwright:latest -euc 'npx -y playwright run-server --port 3000'
 *   Then, the tests can be run with:
 *     $ TEST_BROWSER_WS_ENDPOINT=ws://127.0.0.1:3000/ npm run test:browser
 */

const browserName = process.env.TEST_BROWSER;
const browserWsEndpoint = process.env.TEST_BROWSER_WS_ENDPOINT;
const browser = browserWsEndpoint
  ? await playwright[browserName].connect(browserWsEndpoint)
  : await playwright[browserName].launch();

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => process.stdout.write(msg.text()));

  await page.exposeFunction("exit", async (code) => {
    await browser.close();
    process.exit(code);
  });

  await page.addScriptTag({
    path: require.resolve("mocha/mocha.js"),
  });
  await page.addScriptTag({
    path: require.resolve("chai/chai.js"),
  });

  const chafaJs = fs.readFileSync(require.resolve("../dist/chafa.js"));
  const chafaWasm = fs.readFileSync(require.resolve("../dist/chafa.wasm"));
  const testJs = fs.readFileSync(require.resolve("./test.js"));

  await page.addScriptTag({
    type: "module",
    content: `
      mocha.setup({ ui: "bdd", reporter: "tap" });

      globalThis.assert = chai.assert;
      globalThis.assertEquals = chai.assert.deepEqual;
      globalThis.assertMatch = chai.assert.match;
      globalThis.assertThrows = chai.assert.throws;
      globalThis.assertRejects = (a) => a().then(
        () => chai.assert.fail("expected function to throw an error"),
        (e) => chai.assert.throws(() => { throw e; })
      );

      ${chafaJs.toString("utf-8").replaceAll(
        "chafa.wasm",
        `data:application/octet-stream;base64,${chafaWasm.toString("base64")}`
      )};

      globalThis.Chafa = Chafa;

      ${testJs.toString("utf-8")};

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

import { test, expect } from "@playwright/test";
import { once } from "node:events";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "../../server.mjs";

test("development refreshes saved HTML, CSS, JavaScript and assets; plain preview waits", async ({
  browser,
}) => {
  const directory = await mkdtemp(path.join(tmpdir(), "brand-studio-reload-"));
  const publicRoot = path.join(directory, "public");
  await cp(new URL("../../public/", import.meta.url), publicRoot, {
    recursive: true,
  });
  const development = createApp({ publicRoot, development: true });
  const preview = createApp({ publicRoot });
  development.listen(0, "127.0.0.1");
  preview.listen(0, "127.0.0.1");
  await Promise.all([
    once(development, "listening"),
    once(preview, "listening"),
  ]);
  const page = await browser.newPage();
  const plain = await browser.newPage();
  const connected = (target) =>
    target.waitForResponse(
      (response) => new URL(response.url()).pathname === "/__dev/events",
    );
  const save = async (filename, transform) => {
    const nextConnection = connected(page);
    const loaded = page.waitForEvent("load");
    const file = path.join(publicRoot, filename);
    await writeFile(file, transform(await readFile(file, "utf8")));
    await loaded;
    await nextConnection;
  };
  try {
    const initialConnection = connected(page);
    await page.goto(`http://127.0.0.1:${development.address().port}`);
    await initialConnection;
    await plain.goto(`http://127.0.0.1:${preview.address().port}`);
    const originalTitle = await plain.title();
    await page.locator('input[name="size"][value="M"]').check();
    await page
      .getByRole("button", { name: "Add to demo bag", exact: true })
      .click();
    await expect(page.locator("#bag-count")).toHaveText("1");

    await save("index.html", (html) =>
      html.replace("</title>", " — saved HTML</title>"),
    );
    await expect(page).toHaveTitle(`${originalTitle} — saved HTML`);
    await expect(page.locator("#bag-count")).toHaveText("0");

    await save(
      "styles.css",
      (css) => `${css}\n:root { --reload-proof: saved-css; }\n`,
    );
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--reload-proof")
          .trim(),
      ),
    ).toBe("saved-css");

    await save(
      "shop.js",
      (script) =>
        `${script}\ndocument.documentElement.dataset.reloadProof = "saved-js";\n`,
    );
    await expect(page.locator("html")).toHaveAttribute(
      "data-reload-proof",
      "saved-js",
    );

    await save("assets/resilience-fly-shirt.svg", (svg) =>
      svg.replace("<svg ", '<svg width="123" height="123" '),
    );
    await expect(
      page.locator('img[src="assets/resilience-fly-shirt.svg"]'),
    ).toHaveJSProperty("naturalWidth", 123);

    await expect(plain).toHaveTitle(originalTitle);
    await expect(plain.locator('script[src="/__dev/reload.js"]')).toHaveCount(
      0,
    );
    await plain.reload();
    await expect(plain).toHaveTitle(`${originalTitle} — saved HTML`);
  } finally {
    await Promise.all([page.close(), plain.close()]);
    await Promise.all([
      new Promise((resolve) => development.close(resolve)),
      new Promise((resolve) => preview.close(resolve)),
    ]);
    await rm(directory, { recursive: true, force: true });
  }
});

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("negative: choosing no size explains the problem and keeps the bag empty", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#size-error")).toBeVisible();
  await expect(page.locator("#size-error")).not.toBeEmpty();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("positive: a shopper can choose sizes, add items, and empty the demo bag", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('input[name="size"][value="M"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("1");
  await expect(page.locator("#bag-status")).toContainText("M");
  await expect(page.locator("#bag-items")).toContainText("FLY · 飛");
  await page.locator('input[name="size"][value="L"]').check();
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("2");
  await expect(page.locator("#bag-items")).toContainText("FIGHT · 闘");
  await page
    .getByRole("button", { name: "Empty demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await page.reload();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("kanji color updates both previews and remains attached to each bag item", async ({
  page,
}) => {
  await page.goto("/");
  const shirtImages = page.locator(".design-option-content img");
  await expect(
    page.locator('input[name="kanji-color"][value="white"]'),
  ).toBeChecked();

  await page.locator('input[name="kanji-color"][value="gold"]').check();
  await expect(shirtImages.nth(0)).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt-gold.svg",
  );
  await expect(shirtImages.nth(1)).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt-gold.svg",
  );
  for (const color of ["gold", "crimson", "skyblue"]) {
    for (const design of ["fly", "fight"]) {
      for (const finish of ["", "-matte"]) {
        const response = await page.request.get(
          new URL(
            `assets/resilience-${design}-shirt-${color}${finish}.svg`,
            page.url(),
          ).href,
        );
        const svg = await response.text();
        expect(svg).toContain('<circle cx="180" cy="210" r="46" fill="#111"');
        if (finish) {
          expect(svg).not.toContain(`fill="url(#kanji-${color})"`);
        } else {
          expect(svg).toContain(`<linearGradient id="kanji-${color}"`);
          expect(svg).toContain(`fill="url(#kanji-${color})"`);
        }
      }
    }
  }

  await page.locator('input[name="size"][value="M"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-items")).toContainText("Gold kanji");
  await expect(page.locator("#bag-items")).toContainText("Shine");

  await page.locator('input[name="kanji-color"][value="crimson"]').check();
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await page.locator('input[name="size"][value="L"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-items")).toContainText("Crimson kanji");
  await page.locator('input[name="kanji-color"][value="skyblue"]').check();
  await expect(shirtImages.nth(0)).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt-skyblue.svg",
  );
  await page.locator('input[name="kanji-shine"]').uncheck();
  await expect(shirtImages.nth(0)).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt-skyblue-matte.svg",
  );
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-items")).toContainText("Sky blue kanji");
  await expect(page.locator("#bag-items")).toContainText("Matte");
  await page.locator('input[name="kanji-color"][value="white"]').check();
  await expect(page.locator('input[name="kanji-shine"]')).toBeDisabled();
  await expect(shirtImages.nth(0)).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt.svg",
  );
  await expect(page.locator("#bag-items")).toContainText("FIGHT · 闘");
});

test("keyboard: the skip link reaches main and the size controls work without a mouse", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  // Focus a native radio, then use its real keyboard behavior and the next control.
  await page.locator('input[name="size"][value="S"]').focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name="size"][value="M"]')).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Add to demo bag", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#bag-count")).toHaveText("1");
});

for (const route of ["/", "/styleguide.html", "/studio.html"]) {
  test(`page integrity and automated accessibility: ${route}`, async ({
    page,
  }) => {
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (
        response.url().startsWith("http://127.0.0.1:5174") &&
        response.status() >= 400
      ) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(brokenImages).toEqual([]);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href")),
      );
    for (const href of links) {
      if (href.startsWith("#")) {
        expect(
          await page.locator(`[id="${href.slice(1)}"]`).count(),
          href,
        ).toBeGreaterThan(0);
      } else if (!/^(https?:|mailto:)/.test(href)) {
        const response = await page.request.get(new URL(href, page.url()).href);
        expect(response.ok(), href).toBeTruthy();
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`narrow screen: readable page without horizontal overflow ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
  });
}

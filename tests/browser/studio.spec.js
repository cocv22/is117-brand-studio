import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("negative: choosing no size explains the problem and keeps the cart empty", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#size-error")).toBeVisible();
  await expect(page.locator("#size-error")).not.toBeEmpty();
  await expect(page.locator("#cart-count")).toHaveText("0");
  await expect(page.locator("#cart-empty")).toBeVisible();
});

test("product price and selected shirt design are shown with two decimals", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".price")).toContainText("$28.00");
  await expect(page.locator(".product-visual img")).toHaveCount(1);
  const shirtPreview = page.locator("#shirt-preview");
  await expect(shirtPreview).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt.svg",
  );
  await expect(page.getByRole("radio", { name: /FLY/ })).toBeChecked();
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await expect(shirtPreview).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt.svg",
  );
  await expect(page.locator("#shirt-meaning")).toHaveText("FIGHT");
  await expect(page.getByRole("radio", { name: /FIGHT/ })).toBeChecked();
  await page.getByRole("radio", { name: /DREAM/ }).check();
  await expect(shirtPreview).toHaveAttribute(
    "src",
    "assets/resilience-dream-shirt.svg",
  );
  await expect(page.locator("#shirt-meaning")).toHaveText("DREAM");
});

test("DREAM · 夢 shows its context and is carried into the cart", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".symbol-options")).toContainText(
    "To the dreams you have dreamed.",
  );
  await page.getByRole("radio", { name: /DREAM/ }).check();
  await expect(page.locator("#shirt-preview")).toHaveAttribute(
    "alt",
    /DREAM T-shirt with 夢/,
  );
  await page.locator('input[name="size"][value="M"]').check();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-items")).toContainText("DREAM · 夢");
});

test("positive: a shopper can add shirts, see the total, remove one, and clear the cart", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#cart-empty")).toContainText(
    "Your cart is empty.",
  );
  await expect(
    page.getByRole("button", { name: "Clear cart", exact: true }),
  ).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Add items to your cart" }),
  ).toHaveAttribute("href", "#product-form");
  await page.locator('input[name="size"][value="M"]').check();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-count")).toHaveText("1");
  await expect(page.locator("#cart-status")).toContainText("M");
  await expect(page.locator("#cart-items")).toContainText("FLY · 飛");
  await expect(page.locator("#cart-items")).toContainText("$28.00");
  await expect(page.locator("#cart-total")).toHaveText("$28.00");
  await page.locator('input[name="size"][value="L"]').check();
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-count")).toHaveText("2");
  await expect(page.locator("#cart-items")).toContainText("FIGHT · 闘");
  await expect(page.locator("#cart-items .cart-item-price")).toHaveCount(2);
  await expect(page.locator("#cart-total")).toHaveText("$56.00");
  await page
    .getByRole("button", {
      name: /Remove White T-shirt.*FLY.*Size M from cart/,
    })
    .click();
  await expect(page.locator("#cart-count")).toHaveText("1");
  await expect(page.locator("#cart-items")).not.toContainText("FLY · 飛");
  await expect(page.locator("#cart-items")).toContainText("FIGHT · 闘");
  await expect(page.locator("#cart-total")).toHaveText("$28.00");
  await page
    .getByRole("button", {
      name: /Remove White T-shirt.*FIGHT.*Size L from cart/,
    })
    .click();
  await expect(page.locator("#cart-count")).toHaveText("0");
  await expect(page.locator("#cart-empty")).toBeVisible();
  await expect(page.locator("#cart-total-row")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Add items to your cart" }),
  ).toBeFocused();
  await page.locator('input[name="size"][value="S"]').check();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.getByRole("button", { name: "Clear cart", exact: true }).click();
  await expect(page.locator("#cart-count")).toHaveText("0");
  await expect(page.locator("#cart-empty")).toBeVisible();
  await expect(page.locator("#cart-total-row")).toBeHidden();
  await page.reload();
  await expect(page.locator("#cart-count")).toHaveText("0");
});

test("kanji color and symbol update the single preview and cart items", async ({
  page,
}) => {
  await page.goto("/");
  const shirtImage = page.locator("#shirt-preview");
  await expect(page.locator(".product-visual img")).toHaveCount(1);
  await expect(
    page.locator('input[name="kanji-color"][value="white"]'),
  ).toBeChecked();

  await page.locator('input[name="kanji-color"][value="gold"]').check();
  await expect(shirtImage).toHaveAttribute(
    "src",
    "assets/resilience-fly-shirt-gold.svg",
  );
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await expect(shirtImage).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt-gold.svg",
  );
  for (const color of ["gold", "crimson", "skyblue"]) {
    for (const design of ["fly", "fight", "dream"]) {
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
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-items")).toContainText("Gold kanji");
  await expect(page.locator("#cart-items")).toContainText("Shine");

  await page.locator('input[name="kanji-color"][value="crimson"]').check();
  await page.getByRole("radio", { name: /FIGHT/ }).check();
  await page.locator('input[name="size"][value="L"]').check();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-items")).toContainText("Crimson kanji");
  await page.locator('input[name="kanji-color"][value="skyblue"]').check();
  await expect(shirtImage).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt-skyblue.svg",
  );
  await page.locator('input[name="kanji-shine"]').uncheck();
  await expect(shirtImage).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt-skyblue-matte.svg",
  );
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(page.locator("#cart-items")).toContainText("Sky blue kanji");
  await expect(page.locator("#cart-items")).toContainText("Matte");
  await page.locator('input[name="kanji-color"][value="white"]').check();
  await expect(page.locator('input[name="kanji-shine"]')).toBeDisabled();
  await expect(shirtImage).toHaveAttribute(
    "src",
    "assets/resilience-fight-shirt.svg",
  );
  await expect(page.locator("#cart-items")).toContainText("FIGHT · 闘");
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
    page.getByRole("button", { name: "Add to cart", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#cart-count")).toHaveText("1");
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

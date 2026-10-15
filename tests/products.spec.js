import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

test("the sourced product content has a local image and source description for every record", async () => {
  const catalogue = JSON.parse(
    readFileSync(resolve("public/data/product-content.json"), "utf8"),
  );
  expect(catalogue).toHaveLength(96);
  expect(new Set(catalogue.map((product) => product.sourcePath)).size).toBe(96);
  expect(
    catalogue.reduce(
      (total, product) => total + product.relatedDocuments.length,
      0,
    ),
  ).toBe(203);
  for (const product of catalogue) {
    expect(product.descriptions.length, product.title).toBeGreaterThan(0);
    expect(
      existsSync(resolve("public/images/dovac-originals", product.localImage)),
      product.title,
    ).toBe(true);
  }
});

test("products page contains the sourced DOVAC catalogue without duplicate overview cards", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  await expect(page.locator(".product-card")).toHaveCount(0);
  await expect(page.locator(".catalogue-category")).toHaveCount(8);
  await expect(page.locator(".catalogue-product")).toHaveCount(96);
  await page
    .getByRole("searchbox", { name: "Zoek in producten" })
    .fill("DVP CPA Triplex H");
  await expect(page.locator(".catalogue-product")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "DVP CPA Triplex H" }),
  ).toBeVisible();
});

test("catalogue search narrows results and reports no matches", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  const search = page.getByRole("searchbox", { name: "Zoek in producten" });
  await expect(page.locator(".catalogue-category[open]")).toHaveCount(0);
  await search.fill("DVP CPA Triplex H");
  await expect(page.locator(".catalogue-product")).toHaveCount(1);
  await expect(page.locator(".catalogue-category[open]")).toHaveCount(1);
  await search.fill("no-such-product");
  await expect(page.locator(".catalogue-product")).toHaveCount(0);
  await expect(page.getByText("Geen producten gevonden.")).toBeVisible();
  await search.fill("");
  await expect(page.locator(".catalogue-product")).toHaveCount(96);
  await expect(page.locator(".catalogue-category[open]")).toHaveCount(0);
});

test("a product opens a centered dialog with its image and complete source information", async ({
  page,
}) => {
  const catalogue = JSON.parse(
    readFileSync(resolve("public/data/product-content.json"), "utf8"),
  );
  const product = catalogue.find((item) => item.title === "DVP CPA Triplex H");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./nl/producten/");
    await page
      .getByRole("searchbox", { name: "Zoek in producten" })
      .fill(product.title);
    const trigger = page.getByRole("button", { name: product.title });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: product.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toHaveAttribute(
      "src",
      expect.stringContaining(product.localImage),
    );
    const previews = await dialog
      .locator(".catalogue-description-preview")
      .allTextContents();
    expect(previews).toHaveLength(product.descriptions.length);
    expect(previews.every((preview) => preview.length <= 141)).toBe(true);
    await expect(dialog.locator(".source-description")).toHaveCount(0);
    await expect(dialog.locator(".specification-table-scroll")).toHaveCount(
      product.specificationTables.length,
    );
    await expect(dialog.locator(".catalogue-documentation li")).toHaveCount(
      product.relatedDocuments.length,
    );
    await expect(dialog).toContainText("Productbeschrijving");
    await expect(dialog).toContainText("Technische specificaties");
    await expect(dialog).toContainText("Documentatie");
    const moreButton = dialog.getByRole("button", { name: "Bekijk meer" });
    await expect(moreButton).toHaveCount(product.descriptions.length);
    await expect(dialog).toContainText(
      "Onze CPA Triplex H medische vacuümpompen zijn geavanceerde systemen",
    );
    await expect(dialog).not.toContainText(
      "Kwalificatie voor Industrie 4.0-financiering",
    );
    await moreButton.click();
    await expect(dialog.locator(".source-description")).toHaveCount(
      product.descriptions.length,
    );
    const lessButton = dialog.getByRole("button", { name: "Bekijk minder" });
    await expect(lessButton).toHaveAttribute("aria-expanded", "true");
    await expect(dialog).toContainText(
      "Kwalificatie voor Industrie 4.0-financiering",
    );
    await lessButton.click();
    await expect(moreButton).toHaveAttribute("aria-expanded", "false");
    await expect(dialog).not.toContainText(
      "Kwalificatie voor Industrie 4.0-financiering",
    );
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(900);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

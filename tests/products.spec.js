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

test("a catalogue product shows its source description, specs and documents", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  await page
    .getByRole("searchbox", { name: "Zoek in producten" })
    .fill("DVP CPA Triplex H");
  await page.getByRole("button", { name: "DVP CPA Triplex H" }).click();
  await expect(
    page.getByText("Productbeschrijving", { exact: true }),
  ).toBeVisible();
  await page.getByText("Productbeschrijving", { exact: true }).click();
  await expect(
    page.getByText("Onze CPA Triplex H medische vacuümpompen"),
  ).toBeVisible();
  await expect(
    page.getByText("Technische specificaties", { exact: true }),
  ).toBeVisible();
  await page.getByText("Technische specificaties", { exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "DVP CPA 3Hx 305/1000V" }),
  ).toBeVisible();
  await page.getByText("Documentatie", { exact: true }).click();
  await expect(
    page.getByText("Datasheet DVP CPA Triplex H", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Document aanvragen" }),
  ).toHaveAttribute("href", /^mailto:info@dovac.nl\?subject=/);
  await page.getByRole("button", { name: "Sluit productinformatie" }).click();
  await expect(
    page.getByText("Productbeschrijving", { exact: true }),
  ).not.toBeVisible();
});

import { test, expect } from "@playwright/test";

test("products page contains the sourced DOVAC catalogue without duplicate overview cards", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  await expect(page.locator(".product-card")).toHaveCount(0);
  await expect(page.locator(".catalogue-category")).toHaveCount(8);
  await expect(page.locator(".catalogue-product")).toHaveCount(39);
  await expect(
    page.getByRole("button", { name: "DVP CPA Triplex H" }),
  ).toBeVisible();
});

test("a catalogue product opens its related documentation panel", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  await page.getByRole("button", { name: "DVP CPA Triplex H" }).click();
  await expect(
    page.getByText("Gerelateerde documentatie", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Datasheet aanvragen" }),
  ).toHaveAttribute("href", /^mailto:info@dovac.nl/);
  await page.getByRole("button", { name: "Sluit documentatie" }).click();
  await expect(
    page.getByText("Gerelateerde documentatie", { exact: true }),
  ).not.toBeVisible();
});

import { test, expect } from "@playwright/test";

test("products can be filtered, searched and opened", async ({ page }) => {
  await page.goto("./nl/producten/");
  await page.getByRole("button", { name: "Lucht", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByLabel("Zoek een productgroep").fill("luchtmes");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.locator(".product-card a").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Luchtmessen",
  );
  await expect(
    page.getByRole("heading", {
      name: "Gerichte lucht. Precies waar het nodig is.",
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Luchtmessen",
  );
  await page.goto("./nl/producten/");
  await page.getByLabel("Zoek een productgroep").fill("bestaat-niet");
  await expect(page.getByText("Geen productgroepen gevonden.")).toBeVisible();
  await page.getByRole("button", { name: "Wis filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(9);
});

test("product catalogue exposes every visible type and documentation request", async ({
  page,
}) => {
  await page.goto("./nl/producten/");
  await page.locator(".catalogue").scrollIntoViewIfNeeded();
  await expect(page.locator(".catalogue-category")).toHaveCount(8);
  await expect(page.locator(".catalogue-category li")).toHaveCount(39);
  await expect(
    page.getByText("DVP CPA Triplex H", { exact: true }),
  ).toBeVisible();
  const documentLink = page.getByRole("link", {
    name: "Datasheet aanvragen: DVP CPA Triplex H",
  });
  await expect(documentLink).toHaveAttribute("href", /^mailto:info@dovac.nl/);
  await expect(
    page.getByRole("link", { name: "Gerelateerde documentatie" }).first(),
  ).toHaveAttribute("href", /\/nl\/datasheets\/$/);
});

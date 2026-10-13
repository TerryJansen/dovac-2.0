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

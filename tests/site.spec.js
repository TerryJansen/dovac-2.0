import { test, expect } from "@playwright/test";
test("homepage presents clear conversion actions", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Techniek die blijft draaien.",
  );
  await expect(
    page.getByRole("button", { name: "Offerte aanvragen" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Afspraak maken" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Onze partners" }),
  ).toBeVisible();
  await expect(page.getByAltText("DVP logo")).toBeVisible();
  await expect(page.getByAltText("ASCO logo")).toBeVisible();
  await expect(page.getByAltText("Master Blower logo")).toBeVisible();
  await expect(page.getByAltText("Galex Air logo")).toBeVisible();
});

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
  await expect(page.getByAltText("DVP logo").first()).toBeVisible();
  await expect(page.getByAltText("ASCO logo").first()).toBeVisible();
  await expect(page.getByAltText("Master Blower logo").first()).toBeVisible();
  await expect(page.getByAltText("Galex Air logo").first()).toBeVisible();
  await expect(page.locator(".partner-logos")).toHaveCSS(
    "animation-name",
    "partner-loop",
  );
});

test("brand logo switches to the dark-theme variant", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("dovac-theme", "light"));
  await page.goto("./");
  await page.getByRole("button", { name: "Donker thema" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".brand-logo-light").first()).not.toBeVisible();
  await expect(page.locator(".brand-logo-dark").first()).toBeVisible();
  await expect(page.locator(".brand-logo-dark").first()).toHaveJSProperty(
    "naturalWidth",
    260,
  );
  await expect(page.locator(".logo").first()).toHaveCSS(
    "background-color",
    "rgb(17, 29, 39)",
  );
});

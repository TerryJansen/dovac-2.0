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
  const video = page.locator(".product-motion-video video");
  await expect(video).toHaveAttribute("src", /videos\/3d-vacuumpomp\.mp4$/);
  await expect(video).toHaveAttribute(
    "poster",
    /images\/3d-vacuumpomp-poster\.jpg$/,
  );
  await expect(video).toHaveJSProperty("videoWidth", 704);
  await expect(video).toHaveJSProperty("videoHeight", 576);
});

test("brand logo switches to the dark-theme variant", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("dovac-theme", "light"));
  await page.goto("./");
  await page.getByRole("button", { name: "Donker thema" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".brand-logo-light").first()).not.toBeVisible();
  await expect(page.locator(".brand-logo-dark").first()).toBeVisible();
  await expect(page.locator(".brand-logo-dark")).toHaveCount(2);
  await expect(page.locator(".brand-logo-dark").nth(1)).toHaveAttribute(
    "src",
    /logo-dark-contrast[.]png$/,
  );
  await expect(page.locator("footer .brand-logo-dark")).toBeVisible();
  await expect(page.locator("footer .brand-logo-dark")).toHaveJSProperty(
    "naturalWidth",
    260,
  );
  await expect(page.locator(".brand-logo-dark").first()).toHaveJSProperty(
    "naturalWidth",
    260,
  );
  await expect(page.locator(".logo").first()).toHaveCSS(
    "background-color",
    "rgb(17, 29, 39)",
  );
});

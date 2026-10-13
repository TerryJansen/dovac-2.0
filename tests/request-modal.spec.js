import { expect, test } from "@playwright/test";

test("quote and appointment popups prepare honest email drafts", async ({
  page,
}) => {
  await page.goto("./");

  await page.getByRole("button", { name: "Offerte aanvragen" }).click();
  await expect(
    page.getByRole("dialog", { name: "Offerte aanvragen" }),
  ).toBeVisible();
  await page.getByLabel("Naam", { exact: true }).fill("Test Bezoeker");
  await page
    .getByLabel("E-mailadres", { exact: true })
    .fill("test@example.com");
  await page.getByLabel("Waar wilt u een offerte voor?").fill("Vacuümpomp");
  await page.getByRole("button", { name: "Maak e-mailconcept" }).click();
  const quoteDraft = page.getByRole("link", { name: "Open e-mailprogramma" });
  await expect(quoteDraft).toHaveAttribute(
    "href",
    /^mailto:info@dovac.nl\?subject=/,
  );
  expect(decodeURIComponent(await quoteDraft.getAttribute("href"))).toContain(
    "Offerteaanvraag: Vacuümpomp",
  );

  await page.getByRole("button", { name: "Popup sluiten" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Afspraak maken" }).click();
  await expect(
    page.getByRole("dialog", { name: "Afspraak maken" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

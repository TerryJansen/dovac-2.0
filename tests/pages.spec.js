import { test, expect } from "@playwright/test";

test("primary navigation opens distinct, directly addressable pages", async ({
  page,
}) => {
  await page.goto("./");
  const pages = [
    ["Producten", "Vind de techniek die bij u past."],
    ["Onderhoud & Reparaties", "Meer draaien. Minder stilstaan."],
    ["Datasheets", "De details maken het verschil."],
    ["Toepassingen", "Techniek die uw proces vooruithelpt."],
    ["Industrieën", "Kennis van techniek. Oog voor uw industrie."],
    ["FAQ", "Een vraag? Hier begint het antwoord."],
    ["Over ons", "Techniek is ons vak. Meedenken onze natuur."],
    ["Contact", "Vertel ons wat u nodig heeft."],
  ];
  for (const [label, title] of pages) {
    await page
      .getByRole("navigation", { name: "Hoofdnavigatie" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  }
});

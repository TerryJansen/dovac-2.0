import { test, expect } from "@playwright/test";

test("primary navigation opens distinct, directly addressable pages", async ({
  page,
}) => {
  test.setTimeout(60000);
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

test("every industry detail places a square image beside its copy", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const industries = [
    "voeding-en-dranken",
    "verpakkingsindustrie",
    "zwembad-en-wellness",
    "machinebouw-en-oem",
    "farmaceutische-en-medische-industrie",
    "afvalverwerking",
    "tuinbouw-en-landbouw",
    "waterzuivering-en-milieu",
  ];
  for (const industry of industries) {
    await page.goto(`./nl/industrieen/${industry}/`);
    const layout = await page
      .locator(".industry-layout")
      .evaluate((element) => {
        const image = element
          .querySelector(".industry-image")
          .getBoundingClientRect();
        const copy = element
          .querySelector(".industry-focus")
          .getBoundingClientRect();
        return {
          imageHeight: image.height,
          imageWidth: image.width,
          imageX: image.x,
          copyX: copy.x,
        };
      });
    expect(layout.imageHeight, industry).toBeCloseTo(layout.imageWidth, 0);
    expect(layout.imageX, industry).toBeGreaterThan(layout.copyX);
  }
});

test("industries overview offers custom-solution advice", async ({ page }) => {
  await page.goto("./nl/industrieen/");
  await expect(
    page.getByRole("heading", { name: "Op zoek naar een oplossing op maat?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Advies aanvragen" }),
  ).toHaveAttribute("href", /nl\/contact\/\?onderwerp=Advies%20op%20maat/);
});

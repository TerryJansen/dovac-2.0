import { test, expect } from "@playwright/test";

test("primary navigation opens distinct, directly addressable pages", async ({
  page,
}) => {
  test.setTimeout(90000);
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

test("over ons menu reveals blog and news pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  const submenu = page.locator("#about-submenu");
  await expect(submenu).not.toBeVisible();
  await page.locator(".nav-dropdown").hover();
  await expect(submenu).toBeVisible();
  for (const [label, heading] of [
    ["Blog", "Blog"],
    ["Nieuws", "Nieuws"],
  ]) {
    await submenu.getByRole("link", { name: label }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await page.goto("./");
    await page.locator(".nav-dropdown").hover();
  }
});

test("blog and news show the recovered DOVAC source content", async ({
  page,
}) => {
  await page.goto("./nl/blog/");
  await expect(page.locator(".insight-card")).toHaveCount(9);
  await expect(
    page.getByRole("heading", { name: "Onderhoud = Behoud" }),
  ).toBeVisible();
  await expect(page.locator(".insight-card a").first()).toHaveAttribute(
    "href",
    /\/nl\/blog\/onderhoud-behoud\/$/,
  );
  await page.locator(".insight-card a").first().click();
  await expect(page).toHaveURL(/\/nl\/blog\/onderhoud-behoud\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Onderhoud = Behoud",
  );
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Onderhoud = Behoud",
  );
  await page.goto("./nl/nieuws/");
  await expect(page.locator(".insight-card")).toHaveCount(1);
  await expect(page.locator(".insight-video iframe")).toHaveAttribute(
    "src",
    /player\.vimeo\.com\/video\/1216074268/,
  );
  await expect(page.locator(".insight-card a")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "DOVAC op Empack: vacuüm- en blowertechniek voor iedere industrie",
    }),
  ).toBeVisible();
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
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("./nl/industrieen/");
  await expect(
    page.getByRole("heading", { name: "Op zoek naar een oplossing op maat?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Advies aanvragen" }),
  ).toHaveAttribute("href", /nl\/contact\/\?onderwerp=Advies%20op%20maat/);
  const layout = await page.locator(".industry-advice").evaluate((element) => {
    const copy = element.querySelector("p").getBoundingClientRect();
    const button = element
      .querySelector(".industry-advice-button")
      .getBoundingClientRect();
    return { buttonX: button.x, copyX: copy.x };
  });
  expect(layout.buttonX).toBeGreaterThan(layout.copyX);
});

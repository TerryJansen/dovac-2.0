import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const routes = [
  "home",
  "producten",
  "onderhoud-reparaties/onderhoud-en-reparaties",
  "datasheets",
  "documentatie",
  "faq",
  "veelgestelde-vragen",
  "toepassingen",
  "toepassingen/vacuum-verpakken",
  "toepassingen/drogen-met-luchtmessen",
  "toepassingen/beluchting",
  "toepassingen/vacuum-heffen",
  "industrieen",
  "industrieen/voeding-en-dranken",
  "industrieen/verpakkingsindustrie",
  "industrieen/zwembad-en-wellness",
  "industrieen/machinebouw-en-oem",
  "industrieen/farmaceutische-en-medische-industrie",
  "industrieen/afvalverwerking",
  "industrieen/tuinbouw-en-landbouw",
  "industrieen/waterzuivering-en-milieu",
  "over-ons",
  "contact",
  "producten/vacuumpompen",
  "producten/draaischuifpompen",
  "producten/zijkanaalventilatoren",
  "producten/turbo-blowers",
  "producten/beluchters",
  "producten/luchtmessen",
  "producten/systems",
  "producten/vacuumsystemen",
  "producten/spare-parts",
];
for (const width of [390, 1440]) {
  test(`all routes render without overflow or broken images at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const results = [];
    for (const route of routes) {
      await page.goto(`./nl/${route}/`);
      await expect(page.locator("h1")).toHaveCount(1);
      const images = page.locator("img");
      for (let index = 0; index < (await images.count()); index += 1) {
        const image = images.nth(index);
        if (await image.isVisible()) {
          await image.scrollIntoViewIfNeeded();
        }
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate((element) => element.naturalWidth),
          route,
        ).toBeGreaterThan(0);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      expect(await page.locator("body").innerText()).not.toMatch(/[—–]/);
      results.push({
        route,
        width,
        heading: await page.locator("h1").innerText(),
      });
    }
    expect(errors).toEqual([]);
    fs.mkdirSync("artifacts", { recursive: true });
    fs.writeFileSync(
      `artifacts/routes-${width}.json`,
      JSON.stringify(results, null, 2),
    );
  });
}
test("mobile navigation, FAQ and theme toggle work with keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const menu = page.getByRole("button", { name: "Menu openen" });
  await menu.click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await menu.click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "FAQ", exact: true })
    .click();
  const first = page.locator("summary").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Donker thema" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
for (const theme of ["light", "dark"]) {
  test(`accessibility and screenshots in ${theme} theme`, async ({ page }) => {
    test.setTimeout(120000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.addInitScript(
      (t) => localStorage.setItem("dovac-theme", t),
      theme,
    );
    for (const route of ["home", "producten", "contact", "faq"]) {
      await page.goto(`./nl/${route}/`);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          description: v.description,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${theme}/${route}`,
      ).toEqual([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/${route}-${theme}-desktop.png`,
        fullPage: true,
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("./");
    await page.screenshot({
      path: `artifacts/home-${theme}-mobile.png`,
      fullPage: true,
    });
  });
}
test("unknown route shows recovery and real motion is present", async ({
  page,
}) => {
  await page.goto("./nl/not-a-page/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Hier loopt de route even dood.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: "Offerte aanvragen", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1000);
  expect(
    await page
      .locator(".line-mask > span")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.screenshot({ path: "artifacts/home-motion-desktop.png" });
});

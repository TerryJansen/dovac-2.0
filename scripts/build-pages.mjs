import { readFile, writeFile, mkdir } from "node:fs/promises";
const html = await readFile("dist/index.html", "utf8");
const pages = {
  home: "Blower- en vacuümtechniek",
  producten: "Producten",
  "onderhoud-reparaties/onderhoud-en-reparaties": "Onderhoud & Reparaties",
  datasheets: "Datasheets",
  documentatie: "Documentatie",
  toepassingen: "Toepassingen",
  "toepassingen/vacuum-verpakken": "Vacuüm verpakken",
  "toepassingen/drogen-met-luchtmessen": "Drogen met luchtmessen",
  "toepassingen/beluchting": "Beluchting",
  "toepassingen/vacuum-heffen": "Vacuümheffen",
  industrieen: "Industrieën",
  "industrieen/voeding-en-dranken": "Voeding en dranken",
  "industrieen/verpakkingsindustrie": "Verpakkingsindustrie",
  "industrieen/zwembad-en-wellness": "Zwembad en wellness",
  "industrieen/machinebouw-en-oem": "Machinebouw en OEM",
  "industrieen/farmaceutische-en-medische-industrie":
    "Farmaceutische en medische industrie",
  "industrieen/afvalverwerking": "Afvalverwerking",
  "industrieen/tuinbouw-en-landbouw": "Tuinbouw en landbouw",
  "industrieen/waterzuivering-en-milieu": "Waterzuivering en milieu",
  faq: "Veelgestelde vragen",
  "veelgestelde-vragen": "Veelgestelde vragen",
  "over-ons": "Over DOVAC",
  blog: "Blog",
  nieuws: "Nieuws",
  contact: "Contact",
  "producten/vacuumpompen": "Vacuümpompen",
  "producten/draaischuifpompen": "Draaischuifpompen",
  "producten/zijkanaalventilatoren": "Zijkanaalventilatoren",
  "producten/turbo-blowers": "Turbo Blowers",
  "producten/beluchters": "Beluchters",
  "producten/luchtmessen": "Luchtmessen",
  "producten/systems": "Systems",
  "producten/vacuumsystemen": "Vacuümsystemen",
  "producten/spare-parts": "Spare parts",
};
for (const [path, title] of Object.entries(pages)) {
  const folder = `dist/nl/${path}`;
  await mkdir(folder, { recursive: true });
  await writeFile(
    `${folder}/index.html`,
    html.replace(
      /<title>.*?<\/title>/,
      `<title>${title.replaceAll("&", "&amp;")} | DOVAC</title>`,
    ),
  );
}
await writeFile(
  "dist/404.html",
  html.replace(
    /<title>.*?<\/title>/,
    "<title>Pagina niet gevonden | DOVAC</title>",
  ),
);
await writeFile("dist/.nojekyll", "");
await writeFile("dist/robots.txt", "User-agent: *\nDisallow: /\n");
console.log(
  `Built ${Object.keys(pages).length} directly addressable pages plus root and 404.`,
);

export const base = import.meta.env.BASE_URL;
export const localeFromPath = () => {
  if (typeof location === "undefined") return "nl";
  return location.pathname.match(/\/(nl|en|de)(?:\/|$)/)?.[1] || "nl";
};
export const url = (path = "home", locale = localeFromPath()) =>
  `${base}${locale}/${path}/`;
export const asset = (name) => `${base}images/${name}.webp`;
export const originalAsset = (name) => `${base}images/dovac-originals/${name}`;
export const routesFor = (ui) => [
  [ui.navigation.products, "producten"],
  [
    ui.navigation.maintenanceRepairs,
    "onderhoud-reparaties/onderhoud-en-reparaties",
  ],
  [ui.navigation.datasheets, "datasheets"],
  [ui.navigation.applications, "toepassingen"],
  [ui.navigation.industries, "industrieen"],
  [ui.navigation.faq, "veelgestelde-vragen"],
  [ui.navigation.about, "over-ons"],
  [ui.navigation.contact, "contact"],
];
export const products = [
  {
    slug: "vacuumpompen",
    name: "Vacuümpompen",
    group: "Vacuüm",
    icon: "vacuum",
    image: "fe6c7287d78f4143.png",
    intro: "Het juiste vacuüm begint bij uw proces.",
    description:
      "Voor het afzuigen van lucht en het creëren van onderdruk. Samen bepalen we welke pomp bij uw toepassing past.",
    uses: [
      "Benodigde einddruk",
      "Gewenste pompcapaciteit",
      "Het medium en de bedrijfsomstandigheden",
    ],
    why: "Niet iedere toepassing vraagt om hetzelfde vacuüm. De benodigde druk, het debiet en het gebruik bepalen samen de keuze.",
  },
  {
    slug: "draaischuifpompen",
    name: "Draaischuifpompen",
    group: "Vacuüm",
    icon: "rotor",
    image: "14438d7c8a393da3.png",
    intro: "Bewezen techniek. Zorgvuldig geselecteerd.",
    description:
      "Een vertrouwde pomptechniek voor uiteenlopende vacuümtoepassingen. DOVAC helpt bij de selectie en het onderhoud.",
    uses: [
      "Drooglopend of oliegesmeerd",
      "Bedrijfsduur en belasting",
      "Onderhoud en service",
    ],
    why: "De uitvoering moet passen bij uw proces. We kijken naar het vereiste vacuüm, de belasting en het onderhoud dat daarbij hoort.",
  },
  {
    slug: "zijkanaalventilatoren",
    name: "Zijkanaalventilatoren",
    group: "Lucht",
    icon: "fan",
    image: "411cfc11ff40341a.jpg",
    intro: "Lucht verplaatsen. Gericht op uw proces.",
    description:
      "Voor toepassingen met onderdruk of overdruk. Kies met ons de uitvoering die aansluit op uw luchtbehoefte.",
    uses: [
      "Onderdruk of overdruk",
      "Benodigd luchtdebiet",
      "De weerstand in uw systeem",
    ],
    why: "Druk en luchtdebiet hangen met elkaar samen. Daarom bekijken we niet alleen de ventilator, maar ook de installatie eromheen.",
  },
  {
    slug: "turbo-blowers",
    name: "Turbo Blowers",
    group: "Lucht",
    icon: "wind",
    image: "69b30a172b715cad.png",
    intro: "De luchtstroom die uw toepassing vraagt.",
    description:
      "Blowertechniek voor processen die een gerichte luchtstroom vragen. We helpen u de juiste keuze te maken.",
    uses: [
      "Gewenste luchtstroom",
      "Druk en bedrijfscondities",
      "Aansluiting op uw installatie",
    ],
    why: "Een blower moet passen bij de totale installatie. Bespreek de benodigde capaciteit en bedrijfsomstandigheden met onze specialisten.",
  },
  {
    slug: "beluchters",
    name: "Beluchters",
    group: "Lucht",
    icon: "air",
    image: "50ca684155230b04.png",
    intro: "Zuurstof en beweging in ieder bassin.",
    description:
      "Voor water waarin zuurstof, circulatie en een stabiele kwaliteit essentieel zijn. De installatie wordt berekend op uw bassin en proces.",
    uses: [
      "Waterdiepte en benodigde tegendruk",
      "Leidinglengte en gewenste luchthoeveelheid",
      "Continu energieverbruik en bescherming",
    ],
    why: "De juiste beluchter voorkomt stilstaand water, beperkt storingen en voorkomt dat een continu draaiende blower onnodig energie verbruikt.",
  },
  {
    slug: "luchtmessen",
    name: "Luchtmessen",
    group: "Lucht",
    icon: "air",
    image: "71ece1274c9efbfc.jpg",
    intro: "Gerichte lucht. Precies waar het nodig is.",
    description:
      "Voor het gericht afblazen en drogen van oppervlakken. Afgestemd op uw product en de snelheid van uw proces.",
    uses: [
      "Breedte van het werkgebied",
      "Product en transportsnelheid",
      "Luchtvoorziening en opstelling",
    ],
    why: "Het resultaat hangt af van de luchtstroom én de positie. We denken mee over de combinatie van luchtmes, luchtbron en opstelling.",
  },
  {
    slug: "systems",
    name: "Systems",
    group: "Systemen & onderdelen",
    icon: "system",
    image: "8a4b9cfa223b15c9.png",
    intro: "Van losse component naar één oplossing.",
    description:
      "Een vacuüm- of blowerinstallatie die als geheel werkt. Van technische vraag tot assemblage en testen.",
    uses: [
      "Proces en gewenste prestaties",
      "Componenten en aansturing",
      "Assemblage en testen",
    ],
    why: "Een goed systeem is meer dan een verzameling onderdelen. DOVAC beschikt over een werkplaats en proefstand voor assemblage en testen.",
  },
  {
    slug: "vacuumsystemen",
    name: "Vacuümsystemen",
    group: "Systemen & onderdelen",
    icon: "system",
    image: "8a4b9cfa223b15c9.png",
    intro: "Eén centrale oplossing voor meerdere afnamepunten.",
    description:
      "Complete vacuümsystemen met pompen, vat en regeling, afgestemd op capaciteit, continuïteit en energieverbruik.",
    uses: [
      "Aantal afnamepunten en gelijktijdigheid",
      "Benodigde continuïteit en reserve",
      "Regeling en energiegebruik",
    ],
    why: "Een centraal systeem schakelt mee met de vraag en kan voor meerdere afnamepunten een betrouwbare, overzichtelijke oplossing bieden.",
  },
  {
    slug: "spare-parts",
    name: "Spare parts",
    group: "Systemen & onderdelen",
    icon: "parts",
    image: "0711ad68a3427eb0.jpg",
    intro: "Het juiste onderdeel. Weer vooruit.",
    description:
      "Onderdelen, filters en vacuümpompolie voor onderhoud en reparatie. Deel uw merk en type voor gericht advies.",
    uses: [
      "Merk en type van de pomp",
      "Onderdeel- of serienummer",
      "Foto van het typeplaatje",
    ],
    why: "Een passend onderdeel begint bij de juiste identificatie. Met het merk, type en eventueel een foto helpen we u gerichter.",
  },
];
export const faqs = [
  [
    "Hoe kies ik de juiste vacuümpomp?",
    "Begin bij uw toepassing, de benodigde einddruk en het gewenste debiet. Ook het medium en de bedrijfsduur zijn belangrijk. DOVAC denkt mee en kan technische berekeningen uitvoeren om tot een passende selectie te komen.",
  ],
  [
    "Onderhouden jullie ook andere merken?",
    "Ja. DOVAC verzorgt onderhoud en reparatie zonder uitsluitend naar het merk of de leeftijd van de pomp te kijken. Neem contact op met het merk, type en een omschrijving van het probleem.",
  ],
  [
    "Kan ik terecht voor onderdelen en olie?",
    "DOVAC levert onderdelen, filters en vacuümpompolie voor diverse merken. Vermeld het merk, type en onderdeelnummer als u dat heeft. Zo kan gericht worden gekeken naar het juiste onderdeel.",
  ],
  [
    "Wat kan ik doen bij een storing?",
    "Bel DOVAC op 0252 42 33 63. De website vermeldt 24/7 bereikbaarheid. Houd indien mogelijk het merk, type en de symptomen bij de hand.",
  ],
  [
    "Kan ik een pomp of blower op proef nemen?",
    "Volgens de bestaande DOVAC-website is het mogelijk om een pomp of blower op proef te nemen. Bespreek uw toepassing en de voorwaarden vooraf met DOVAC.",
  ],
  [
    "Waar is DOVAC gevestigd?",
    "DOVAC is gevestigd aan de Koning Willem-Alexanderlaan 195, 2761 HK in Zevenhuizen. Neem voor een bezoek contact op om een afspraak te maken.",
  ],
];

const nlCatalogue = [
  {
    title: "Vacuümpompen",
    items: [
      "Vloeistofring",
      "Klauwen vacuumpompen",
      "Membraan/Zuiger",
      "Roots & Vacuümboosters",
      "ATEX Vacuumpompen",
    ],
  },
  {
    title: "Draaischuifpompen",
    items: [
      "Drooglopend",
      "Oliegesmeerde Eentraps Vacuümpompen",
      "Oliegesmeerde Tweetraps Vacuümpompen",
    ],
  },
  {
    title: "Zijkanaalventilatoren",
    items: [
      "Vacuüm 1-traps",
      "Vacuüm 2-traps",
      "Overdruk 1-traps",
      "Overdruk 2-traps",
      "DOVAC ATEX Zijkanaalventilator",
    ],
  },
  {
    title: "Turbo Blowers",
    items: [
      "Master Blower MB 2300",
      "Master Blower MB 2800",
      "Master Blower MB 5000",
      "Galex Air Axion One 720",
      "Galex Air Axion One 730",
    ],
  },
  {
    title: "Luchtmessen",
    items: ["RVS Luchtmessen", "Aluminium Luchtmessen", "Luchtkanon"],
  },
  {
    title: "Systems",
    items: [
      "DVP CPV 4/8",
      "DVP CPV 12/25 - 25/25 - 40/25 - 60/25",
      "DVP CPA Simplex",
      "DVP CPA Duplex",
      "DVP CPA Triplex",
      "DVP CPA Triplex H",
    ],
  },
  {
    title: "Beluchters",
    items: [
      "Beluchter 10 m³/h",
      "Beluchter 20 m³/h",
      "Beluchter 40 m³/h",
      "Rack beluchter",
    ],
  },
  {
    title: "Spare parts",
    items: [
      "Vacuümfilters",
      "Zuigfilters",
      "Inzetfilters",
      "Geluiddempers",
      "Begrenzingsventiel",
      "Onderhoudskits",
      "Olie",
      "Toebehoren",
    ],
  },
];

export function catalogueFor(locale) {
  const titles =
    {
      en: {
        Vacuümpompen: "Vacuum pumps",
        Draaischuifpompen: "Rotary vane pumps",
        Zijkanaalventilatoren: "Side channel blowers",
        Luchtmessen: "Air knives",
        Beluchters: "Aerators",
        "Spare parts": "Spare parts",
      },
      de: {
        Vacuümpompen: "Vakuumpumpen",
        Draaischuifpompen: "Drehschieberpumpen",
        Zijkanaalventilatoren: "Seitenkanalverdichter",
        Luchtmessen: "Luftmesser",
        Beluchters: "Belüfter",
        "Spare parts": "Ersatzteile",
      },
    }[locale] || {};
  return nlCatalogue.map((category) => ({
    ...category,
    title: titles[category.title] || category.title,
  }));
}

import { useState } from "react";
import {
  MagnifyingGlass,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  Fan,
  Waveform,
  Wind,
  GearSix,
  CirclesFour,
  Wrench,
} from "@phosphor-icons/react";
import { products, url, asset } from "./site-data";

const icons = {
  vacuum: Waveform,
  rotor: GearSix,
  fan: Fan,
  wind: Wind,
  air: Wind,
  system: CirclesFour,
  parts: Wrench,
};
function ProductIcon({ type, size = 80 }) {
  const Icon = icons[type] || Fan;
  return <Icon size={size} weight="light" aria-hidden="true" />;
}
export function ProductExplorer({ ui }) {
  const { Reveal } = ui;
  const [group, setGroup] = useState("Alles");
  const [query, setQuery] = useState("");
  const result = products.filter(
    (p) =>
      (group === "Alles" || p.group === group) &&
      `${p.name} ${p.description}`
        .toLocaleLowerCase("nl")
        .includes(query.trim().toLocaleLowerCase("nl")),
  );
  return (
    <section className="wrap product-section" aria-label="Productgroepen">
      <div className="product-toolbar">
        <div className="filters" aria-label="Filter op productgroep">
          {["Alles", "Vacuüm", "Lucht", "Systemen & onderdelen"].map((g) => (
            <button
              key={g}
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="product-search">
          <span className="sr-only">Zoek een productgroep</span>
          <MagnifyingGlass size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek een productgroep"
            type="search"
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {result.length}{" "}
        {result.length === 1 ? "productgroep" : "productgroepen"}
      </p>
      {result.length ? (
        <div className="product-grid">
          {result.map((p) => (
            <Reveal key={p.slug} className="product-card">
              <a href={url(`producten/${p.slug}`)}>
                <div className="product-visual">
                  <img
                    src={asset(`products/${p.slug}`)}
                    alt={`${p.name} voor industriële toepassingen`}
                    width="960"
                    height="720"
                    loading="lazy"
                  />
                  <span className="product-group-label">{p.group}</span>
                </div>
                <div className="product-card-copy">
                  <h2>{p.name}</h2>
                  <p>{p.description}</p>
                  <span className="product-arrow">
                    <ArrowUpRight size={24} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <MagnifyingGlass size={42} />
          <h2>Geen productgroepen gevonden.</h2>
          <p>Probeer een andere zoekterm of bekijk het hele assortiment.</p>
          <button
            className="button"
            onClick={() => {
              setGroup("Alles");
              setQuery("");
            }}
          >
            Wis filters
          </button>
        </div>
      )}
    </section>
  );
}
export function ProductNavigator({ ui }) {
  const { Reveal } = ui;
  const groups = [
    {
      name: "Vacuümtechniek",
      description: "Voor creëren, vasthouden en regelen van vacuüm.",
      items: products.filter((p) => p.group === "Vacuüm"),
    },
    {
      name: "Blowertechniek",
      description: "Voor luchttransport, beluchting en gerichte luchtstroom.",
      items: products.filter((p) => p.group === "Lucht"),
    },
    {
      name: "Systemen & onderdelen",
      description: "Voor complete installaties en een passende vervanging.",
      items: products.filter((p) => p.group === "Systemen & onderdelen"),
    },
  ];
  return (
    <section className="product-navigator" aria-label="Productgroepen verkennen">
      <div className="wrap">
        <div className="product-navigator-head">
        <div>
            <p className="eyebrow">Ons assortiment</p>
            <h2>Vind direct de juiste techniek.</h2>
        </div>
          <a className="text-link" href={url("producten")}>
            Bekijk alle productgroepen <ArrowRight size={20} />
          </a>
        </div>
        <div className="product-navigator-grid">
          {groups.map((group, index) => (
            <Reveal key={group.name} className="product-navigator-card" delay={index * 0.06}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <ul>
                {group.items.map((p) => (
                  <li key={p.slug}>
                    <a href={url(`producten/${p.slug}`)}>
                      {p.name} <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ProductDetail({ product: p, ui }) {
  const { Reveal, Button, PageTitle, ContactBand } = ui;
  return (
    <>
      <div className="wrap breadcrumbs">
        <a href={url("producten")}>Producten</a>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <PageTitle label={p.group} description={p.description}>
        {p.name}
      </PageTitle>
      <section className="wrap product-detail">
        <Reveal className="product-detail-copy">
          <h2>{p.intro}</h2>
          <p>{p.why}</p>
          <h3>Dit brengen we samen in kaart</h3>
          <ul>
            {p.uses.map((item) => (
              <li key={item}>
                <CheckCircle size={23} />
                {item}
              </li>
            ))}
          </ul>
          <Button
            href={url("contact") + `?onderwerp=${encodeURIComponent(p.name)}`}
          >
            Bespreek uw vraag
          </Button>
        </Reveal>
        <Reveal className="product-consult">
          <img
            src={asset(`products/${p.slug}`)}
            alt={`${p.name} voor industriële toepassingen`}
            width="960"
            height="720"
            loading="lazy"
          />
          <h3>
            Uw toepassing
            <br />
            bepaalt de keuze.
          </h3>
          <p>
            Geen willekeurig model, maar een selectie op basis van wat uw proces
            nodig heeft.
          </p>
          <a className="text-link" href={url("datasheets")}>
            Technische documentatie <ArrowUpRight size={20} />
          </a>
        </Reveal>
      </section>
      <section className="wrap product-service">
        <img
          src={asset("maintenance")}
          alt="DOVAC voert onderhoud uit aan een vacuümpomp"
          width="941"
          height="659"
          loading="lazy"
        />
        <div>
          <h2>
            Ook na de levering
            <br />
            denken we mee.
          </h2>
          <p>
            Van onderdelen tot onderhoud. Ontdek hoe DOVAC uw installatie in
            goede conditie helpt houden.
          </p>
          <a
            className="text-link"
            href={url("onderhoud-reparaties/onderhoud-en-reparaties")}
          >
            Onderhoud & reparaties <ArrowRight size={20} />
          </a>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

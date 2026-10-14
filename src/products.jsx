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
import { url, originalAsset } from "./site-data";
import { contentFor, currentLocale, localize, uiFor } from "./i18n";

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
  const locale = currentLocale();
  const copy = uiFor(locale).products;
  const { products } = contentFor(locale);
  const [group, setGroup] = useState(copy.groups.all);
  const [query, setQuery] = useState("");
  const result = products.filter(
    (p) =>
      (group === copy.groups.all || p.group === group) &&
      `${p.name} ${p.description}`
        .toLocaleLowerCase(locale)
        .includes(query.trim().toLocaleLowerCase(locale)),
  );
  return (
    <section
      className="wrap product-section"
      aria-label={copy.explorerAriaLabel}
    >
      <div className="product-toolbar">
        <div className="filters" aria-label={copy.filterAriaLabel}>
          {Object.values(copy.groups).map((g) => (
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
          <span className="sr-only">{copy.searchLabel}</span>
          <MagnifyingGlass size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            type="search"
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {result.length}{" "}
        {result.length === 1 ? copy.productGroup : copy.productGroups}
      </p>
      {result.length ? (
        <div className="product-grid">
          {result.map((p) => (
            <Reveal key={p.slug} className="product-card">
              <a href={url(`producten/${p.slug}`)}>
                <div className="product-visual">
                  <img
                    src={originalAsset(p.image)}
                    alt={localize(copy.productImageAlt, { name: p.name })}
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
          <h2>{copy.noResultsTitle}</h2>
          <p>{copy.noResultsDescription}</p>
          <button
            className="button"
            onClick={() => {
              setGroup(copy.groups.all);
              setQuery("");
            }}
          >
            {copy.clearFilters}
          </button>
        </div>
      )}
    </section>
  );
}
export function ProductNavigator({ ui }) {
  const { Reveal } = ui;
  const locale = currentLocale();
  const copy = uiFor(locale).products;
  const { products } = contentFor(locale);
  const groups = [
    {
      ...copy.categories.vacuumTechnology,
      items: products.filter((p) => p.group === copy.groups.vacuum),
    },
    {
      ...copy.categories.blowerTechnology,
      items: products.filter((p) => p.group === copy.groups.air),
    },
    {
      ...copy.categories.systemsAndParts,
      items: products.filter((p) => p.group === copy.groups.systemsAndParts),
    },
  ];
  return (
    <section className="product-navigator" aria-label={copy.navigatorAriaLabel}>
      <div className="wrap">
        <div className="product-navigator-head">
          <div>
            <p className="eyebrow">{copy.navigatorEyebrow}</p>
            <h2>{copy.navigatorTitle}</h2>
          </div>
          <a className="text-link" href={url("producten")}>
            {copy.viewAllProductGroups} <ArrowRight size={20} />
          </a>
        </div>
        <div className="product-navigator-grid">
          {groups.map((group, index) => (
            <Reveal
              key={group.name}
              className="product-navigator-card"
              delay={index * 0.06}
            >
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
  const copy = uiFor().products;
  return (
    <>
      <div className="wrap breadcrumbs">
        <a href={url("producten")}>{copy.breadcrumbProducts}</a>
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
          <h3>{copy.assessmentTitle}</h3>
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
            {copy.discussQuestion}
          </Button>
        </Reveal>
        <Reveal className="product-consult">
          <img
            src={originalAsset(p.image)}
            alt={localize(copy.productImageAlt, { name: p.name })}
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
          src={originalAsset("1f7e68e87940984c.jpg")}
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

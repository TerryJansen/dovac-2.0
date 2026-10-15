import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  FileText,
} from "@phosphor-icons/react";
import { url, originalAsset } from "./site-data";
import { contentFor, currentLocale, localize, uiFor } from "./i18n";

export function ProductExplorer({ ui }) {
  return (
    <section className="wrap product-section">
      <ProductCatalogue />
    </section>
  );
}
function ProductCatalogue() {
  const locale = currentLocale();
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [catalogueProducts, setCatalogueProducts] = useState([]);
  const [catalogueStatus, setCatalogueStatus] = useState("loading");
  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/product-content.json`)
      .then((response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((products) => {
        if (!active) return;
        setCatalogueProducts(products);
        setCatalogueStatus("ready");
      })
      .catch(() => {
        if (active) setCatalogueStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);
  const categoryOrder = [
    "Vacuümpompen",
    "Draaischuifpompen",
    "Zijkanaalventilatoren",
    "Turbo Blowers",
    "Luchtmessen",
    "Systems",
    "Beluchters",
    "Spare parts",
  ];
  const categories = categoryOrder
    .map((category) => ({
      title: category,
      products: catalogueProducts.filter(
        (product) => product.category === category,
      ),
    }))
    .filter((category) => category.products.length > 0);
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase(locale);
  const visibleCategories = categories
    .map((category) => ({
      ...category,
      products: category.products.filter((product) =>
        product.title.toLocaleLowerCase(locale).includes(normalizedSearch),
      ),
    }))
    .filter((category) => category.products.length > 0);
  const matchingProductCount = visibleCategories.reduce(
    (total, category) => total + category.products.length,
    0,
  );
  const copy = {
    nl: {
      eyebrow: "Productassortiment",
      title: "Vind het juiste product",
      description: "Zoek op productnaam of kies een productgroep.",
      loading: "Productinformatie laden…",
      loadError:
        "De productinformatie kan nu niet worden geladen. Vernieuw de pagina om het opnieuw te proberen.",
      searchLabel: "Zoek in producten",
      searchPlaceholder: "Typ een productnaam",
      resultCount: (products, groups) =>
        `${products} producten in ${groups} productgroepen`,
      categoryCount: (count) => `${count} producten`,
      noResults: "Geen producten gevonden. Probeer een andere zoekterm.",
      productDescription: "Productbeschrijving",
      specifications: "Technische specificaties",
      documentation: "Documentatie",
      request: "Document aanvragen",
      noDocuments:
        "Op de DOVAC-bronpagina staat voor dit product geen afzonderlijke documentatielink vermeld.",
      close: "Sluit productinformatie",
    },
    en: {
      eyebrow: "Product range",
      title: "Find the right product",
      description: "Search by product name or choose a product group.",
      loading: "Loading product information…",
      loadError:
        "Product information could not be loaded. Refresh to try again.",
      searchLabel: "Search products",
      searchPlaceholder: "Type a product name",
      resultCount: (products, groups) =>
        `${products} products in ${groups} product groups`,
      categoryCount: (count) => `${count} products`,
      noResults: "No products found. Try another search.",
      productDescription: "Product description",
      specifications: "Technical specifications",
      documentation: "Documentation",
      request: "Request document",
      noDocuments:
        "No separate document link is listed on the DOVAC source page.",
      close: "Close product information",
    },
    de: {
      eyebrow: "Produktsortiment",
      title: "Das passende Produkt finden",
      description: "Suchen Sie nach Produktnamen oder wählen Sie eine Gruppe.",
      loading: "Produktinformationen werden geladen…",
      loadError:
        "Produktinformationen konnten nicht geladen werden. Bitte aktualisieren Sie die Seite.",
      searchLabel: "Produkte suchen",
      searchPlaceholder: "Produktnamen eingeben",
      resultCount: (products, groups) =>
        `${products} Produkte in ${groups} Produktgruppen`,
      categoryCount: (count) => `${count} Produkte`,
      noResults: "Keine Produkte gefunden. Bitte anders suchen.",
      productDescription: "Produktbeschreibung",
      specifications: "Technische Spezifikationen",
      documentation: "Dokumentation",
      request: "Dokument anfordern",
      noDocuments:
        "Auf der DOVAC-Quellseite ist kein separates Dokument verlinkt.",
      close: "Produktinformationen schließen",
    },
  }[locale];
  return (
    <section className="catalogue" aria-label={copy.title}>
      <div className="catalogue-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      {catalogueStatus === "loading" && <p role="status">{copy.loading}</p>}
      {catalogueStatus === "error" && <p role="alert">{copy.loadError}</p>}
      {catalogueStatus === "ready" && (
        <div className="catalogue-controls">
          <label className="catalogue-search">
            <span>{copy.searchLabel}</span>
            <input
              type="search"
              value={searchTerm}
              placeholder={copy.searchPlaceholder}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <p className="catalogue-result-count" role="status">
            {copy.resultCount(matchingProductCount, visibleCategories.length)}
          </p>
        </div>
      )}
      {catalogueStatus === "ready" && matchingProductCount === 0 ? (
        <p className="catalogue-no-results">{copy.noResults}</p>
      ) : (
        visibleCategories.map((category) => (
          <details
            className="catalogue-category"
            key={category.title}
            open={normalizedSearch ? true : undefined}
          >
            <summary>
              <span
                className="catalogue-category-title"
                role="heading"
                aria-level="3"
              >
                {category.title}
              </span>
              <span className="catalogue-category-count">
                {copy.categoryCount(category.products.length)}
              </span>
              <ArrowRight size={20} aria-hidden="true" />
            </summary>
            <div className="catalogue-grid">
              {category.products.map((product) => {
                const isSelected = selectedPath === product.sourcePath;
                return (
                  <article
                    className="catalogue-product"
                    key={product.sourcePath}
                  >
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      aria-controls={`product-info-${product.slug}`}
                      onClick={() =>
                        setSelectedPath(isSelected ? null : product.sourcePath)
                      }
                    >
                      <img
                        src={originalAsset(product.localImage)}
                        alt={product.mainImage?.alt || product.title}
                        width="540"
                        height="482"
                        loading="lazy"
                      />
                      <span>{product.title}</span>
                      <ArrowRight size={20} aria-hidden="true" />
                    </button>
                    {isSelected && (
                      <div
                        className="catalogue-detail"
                        id={`product-info-${product.slug}`}
                        aria-label={`${product.title} product information`}
                      >
                        {product.descriptions.length > 0 && (
                          <details className="catalogue-detail-group">
                            <summary>
                              <span>{copy.productDescription}</span>
                              <ArrowRight size={17} aria-hidden="true" />
                            </summary>
                            <div>
                              {product.descriptions.map(
                                (description, index) => (
                                  <div
                                    className="source-description"
                                    key={`${product.slug}-description-${index}`}
                                    dangerouslySetInnerHTML={{
                                      __html: description.html,
                                    }}
                                  />
                                ),
                              )}
                            </div>
                          </details>
                        )}
                        {product.specificationTables.length > 0 && (
                          <details className="catalogue-detail-group">
                            <summary>
                              <span>{copy.specifications}</span>
                              <ArrowRight size={17} aria-hidden="true" />
                            </summary>
                            <div>
                              {product.specificationTables.map(
                                (table, index) => (
                                  <div
                                    className="specification-table-scroll"
                                    key={`${product.slug}-table-${index}`}
                                    tabIndex="0"
                                    role="region"
                                    aria-label={`${product.title} ${copy.specifications} ${index + 1}`}
                                  >
                                    <table>
                                      <tbody>
                                        {table
                                          .filter((row) => row.some(Boolean))
                                          .map((row, rowIndex) => (
                                            <tr
                                              key={`${product.slug}-row-${rowIndex}`}
                                            >
                                              {row.map((cell, cellIndex) => {
                                                const Tag =
                                                  rowIndex === 0 ? "th" : "td";
                                                return (
                                                  <Tag
                                                    key={`${cellIndex}-${cell}`}
                                                  >
                                                    {cell}
                                                  </Tag>
                                                );
                                              })}
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ),
                              )}
                            </div>
                          </details>
                        )}
                        <details className="catalogue-detail-group">
                          <summary>
                            <span>{copy.documentation}</span>
                            <ArrowRight size={17} aria-hidden="true" />
                          </summary>
                          <div className="catalogue-documentation">
                            {product.relatedDocuments.length > 0 ? (
                              <ul>
                                {product.relatedDocuments.map(
                                  (document, index) => (
                                    <li
                                      key={`${product.slug}-document-${index}`}
                                    >
                                      <FileText size={18} aria-hidden="true" />
                                      <span>{document.title}</span>
                                      <a
                                        href={`mailto:info@dovac.nl?subject=${encodeURIComponent(`${copy.request}: ${document.title}`)}&body=${encodeURIComponent(`${copy.request}\nProduct: ${product.title}\nDocument: ${document.title}\n\n`)}`}
                                      >
                                        {copy.request}
                                      </a>
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              <p>{copy.noDocuments}</p>
                            )}
                          </div>
                        </details>
                        <button
                          className="catalogue-close"
                          type="button"
                          onClick={() => setSelectedPath(null)}
                        >
                          {copy.close}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </details>
        ))
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

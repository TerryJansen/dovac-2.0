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
  const [selected, setSelected] = useState(null);
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
  const copy = {
    nl: {
      eyebrow: "Compleet assortiment",
      title: "Producten en technische informatie van DOVAC.",
      description:
        "Bekijk de productbeschrijvingen en technische specificaties van de bronpagina's. Klik een product open voor de volledige informatie en bijbehorende documentatie.",
      loading: "Productinformatie laden…",
      loadError:
        "De productinformatie kan nu niet worden geladen. Vernieuw de pagina om het opnieuw te proberen.",
      productDescription: "Productbeschrijving",
      specifications: "Productspecificaties",
      documentation: "Gerelateerde documentatie",
      request: "Document aanvragen",
      noDocuments:
        "Op de DOVAC-bronpagina staat voor dit product geen afzonderlijke documentatielink vermeld.",
      close: "Sluit productinformatie",
    },
    en: {
      eyebrow: "Complete range",
      title: "All product types, clearly grouped.",
      description:
        "View the product descriptions and technical specifications from the source pages. Open a product for its full information and related documentation.",
      loading: "Loading product information…",
      loadError:
        "Product information could not be loaded. Refresh to try again.",
      productDescription: "Product description",
      specifications: "Product specifications",
      documentation: "Related documentation",
      request: "Request document",
      noDocuments:
        "No separate document link is listed on the DOVAC source page.",
      close: "Close product information",
    },
    de: {
      eyebrow: "Komplettes Sortiment",
      title: "Alle Produkttypen, übersichtlich zusammengefasst.",
      description:
        "Sehen Sie sich die Produktbeschreibungen und technischen Daten der Quellseiten an. Öffnen Sie ein Produkt für alle Informationen und zugehörige Dokumente.",
      loading: "Produktinformationen werden geladen…",
      loadError:
        "Produktinformationen konnten nicht geladen werden. Bitte aktualisieren Sie die Seite.",
      productDescription: "Produktbeschreibung",
      specifications: "Produktspezifikationen",
      documentation: "Zugehörige Dokumentation",
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
      {categories.map((category) => (
        <section className="catalogue-category" key={category.title}>
          <h3>{category.title}</h3>
          <div className="catalogue-grid">
            {category.products.map((product) => {
              const isSelected = selected === product.sourcePath;
              return (
                <article className="catalogue-product" key={product.sourcePath}>
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls={`product-info-${product.slug}`}
                    onClick={() =>
                      setSelected(isSelected ? null : product.sourcePath)
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
                        <section className="catalogue-description">
                          <h4>{copy.productDescription}</h4>
                          {product.descriptions.map((description, index) => (
                            <div
                              className="source-description"
                              key={`${product.slug}-description-${index}`}
                              dangerouslySetInnerHTML={{
                                __html: description.html,
                              }}
                            />
                          ))}
                        </section>
                      )}
                      {product.specificationTables.length > 0 && (
                        <section className="catalogue-specifications">
                          <h4>{copy.specifications}</h4>
                          {product.specificationTables.map((table, index) => (
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
                                            <Tag key={`${cellIndex}-${cell}`}>
                                              {cell}
                                            </Tag>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </section>
                      )}
                      <section className="catalogue-documentation">
                        <h4>{copy.documentation}</h4>
                        {product.relatedDocuments.length > 0 ? (
                          <ul>
                            {product.relatedDocuments.map((document, index) => (
                              <li key={`${product.slug}-document-${index}`}>
                                <FileText size={18} aria-hidden="true" />
                                <span>{document.title}</span>
                                <a
                                  href={`mailto:info@dovac.nl?subject=${encodeURIComponent(`${copy.request}: ${document.title}`)}&body=${encodeURIComponent(`${copy.request}\nProduct: ${product.title}\nDocument: ${document.title}\n\n`)}`}
                                >
                                  {copy.request}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>{copy.noDocuments}</p>
                        )}
                      </section>
                      <button
                        className="catalogue-close"
                        type="button"
                        onClick={() => setSelected(null)}
                      >
                        {copy.close}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
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

import {
  ArrowUpRight,
  ArrowRight,
  Fan,
  Waveform,
  Wind,
  GearSix,
  CirclesFour,
  Wrench,
  ShieldCheck,
  Phone,
  EnvelopeSimple,
  MapPin,
  FileText,
  Plus,
  CheckCircle,
} from "@phosphor-icons/react";
import { url, originalAsset } from "./site-data";
import { applicationPages, industries } from "./source-content";
import { knowledgeContent } from "./knowledge-content";
import { ProductExplorer, ProductDetail } from "./products";
import ContactForm from "./contact-form";
import { contentFor, currentLocale } from "./i18n";
import "./pages.css";

const icons = {
  vacuum: Waveform,
  rotor: GearSix,
  fan: Fan,
  wind: Wind,
  air: Wind,
  system: CirclesFour,
  parts: Wrench,
};
export function ProductIcon({ type, size = 58 }) {
  const Icon = icons[type] || Fan;
  return <Icon size={size} weight="light" aria-hidden="true" />;
}

function SourceLinks({ slugs }) {
  const { products } = contentFor();
  return (
    <div className="source-product-links">
      {slugs.map((slug) => {
        const product = products.find((item) => item.slug === slug);
        return product ? (
          <a key={slug} href={url(`producten/${slug}`)}>
            {product.name} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ) : null;
      })}
    </div>
  );
}

function ArticlePage({ article, ui }) {
  const { Reveal, Button, PageTitle, ContactBand } = ui;
  return (
    <>
      <div className="wrap breadcrumbs">
        <a href={url("toepassingen")}>Toepassingen</a>
        <span>/</span>
        <span>{article.title}</span>
      </div>
      <PageTitle label="Toepassingen" description={article.intro}>
        {article.title}
      </PageTitle>
      <div className="wrap source-page-image">
        <img src={originalAsset(article.image)} alt="" />
      </div>
      <section className="wrap source-article">
        {article.sections.map(([title, text], index) => (
          <Reveal
            key={title}
            className="source-article-row"
            delay={index * 0.04}
          >
            <h2>{title}</h2>
            <p>{text}</p>
          </Reveal>
        ))}
      </section>
      <section className="wrap related-technique">
        <p className="eyebrow">Passende techniek</p>
        <h2>Van toepassing naar een complete oplossing.</h2>
        <SourceLinks slugs={article.products} />
        <Button
          href={
            url("contact") + "?onderwerp=" + encodeURIComponent(article.title)
          }
        >
          Vraag technisch advies
        </Button>
      </section>
      <ContactBand />
    </>
  );
}

function ApplicationsPage({ ui }) {
  const { Reveal, PageTitle, ContactBand } = ui;
  return (
    <>
      <PageTitle
        label="Toepassingen"
        description="DOVAC levert producten voor diverse toepassingen. Ontdek welke techniek aansluit op uw proces."
      >
        Techniek die uw proces vooruithelpt.
      </PageTitle>
      <section className="wrap source-card-grid">
        {Object.entries(applicationPages).map(([slug, article], index) => (
          <Reveal key={slug} className="source-card" delay={index * 0.05}>
            <img src={originalAsset(article.image)} alt="" loading="lazy" />
            <p className="eyebrow">Toepassing</p>
            <h2>{article.title}</h2>
            <p>{article.intro}</p>
            <a className="text-link" href={url(`toepassingen/${slug}`)}>
              Bekijk toepassing <ArrowRight size={20} />
            </a>
          </Reveal>
        ))}
      </section>
      <ContactBand />
    </>
  );
}

function BlogArticlePage({ article, ui }) {
  const { Reveal, PageTitle, ContactBand } = ui;
  return (
    <>
      <div className="wrap breadcrumbs">
        <a href={url("blog")}>Blog</a>
        <span>/</span>
        <span>{article.title}</span>
      </div>
      <PageTitle label="Blog" description={article.excerpt}>
        {article.title}
      </PageTitle>
      <article className="wrap blog-article">
        <Reveal className="blog-article-image">
          <img src={originalAsset(article.image)} alt="" />
        </Reveal>
        <Reveal className="blog-article-copy">
          <p className="insight-meta">
            {article.date} <span>{article.readTime}</span>
          </p>
          <p>{article.excerpt}</p>
          <a className="text-link" href={url("contact")}>
            Bespreek uw toepassing <ArrowUpRight size={20} />
          </a>
        </Reveal>
      </article>
      <ContactBand />
    </>
  );
}

function InsightsPage({ page, ui, content = knowledgeContent }) {
  const { Reveal, PageTitle, ContactBand } = ui;
  const pageContent = content[page];
  return (
    <>
      <PageTitle label="Over DOVAC" description={pageContent.description}>
        {page === "nieuws" ? "Nieuws" : "Blog"}
      </PageTitle>
      <section className="wrap insights-grid">
        {pageContent.items.map((item, index) => {
          const card = (
            <>
              {item.vimeoId ? (
                <div className="insight-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${item.vimeoId}?dnt=1&title=0&byline=0&portrait=0`}
                    title="In gesprek met DOVAC - Empack 2026"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img src={originalAsset(item.image)} alt="" loading="lazy" />
              )}
              <div className="insight-card-copy">
                <p className="insight-meta">
                  {item.date} <span>{item.readTime}</span>
                </p>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
                {item.slug && (
                  <span className="text-link">
                    Lees artikel <ArrowUpRight size={20} aria-hidden="true" />
                  </span>
                )}
              </div>
            </>
          );
          return (
            <Reveal
              className="insight-card"
              delay={index * 0.03}
              key={item.slug || item.vimeoId}
            >
              {item.slug ? <a href={url(`blog/${item.slug}`)}>{card}</a> : card}
            </Reveal>
          );
        })}
      </section>
      <ContactBand />
    </>
  );
}

function IndustriesPage({ page, ui }) {
  const { Reveal, PageTitle, ContactBand } = ui;
  const industry = industries.find(([slug]) => page === `industrieen/${slug}`);
  if (industry) {
    const [, title, description, image] = industry;
    return (
      <>
        <div className="wrap breadcrumbs">
          <a href={url("industrieen")}>Industrieën</a>
          <span>/</span>
          <span>{title}</span>
        </div>
        <PageTitle label="Industrieën" description={description}>
          {title}
        </PageTitle>
        <section className="wrap industry-layout">
          <div className="industry-focus">
            <Reveal>
              <h2>Techniek begint bij uw proces.</h2>
              <p>{description}</p>
              <p>
                DOVAC kijkt naar de toepassing, benodigde capaciteit, druk,
                bedrijfsomstandigheden en gewenste continuïteit. Zo ontstaat een
                oplossing die past bij het proces in plaats van alleen bij een
                bestaand typenummer.
              </p>
              <a className="text-link" href={url("contact")}>
                Bespreek uw toepassing <ArrowUpRight size={20} />
              </a>
            </Reveal>
          </div>
          <div className="industry-image">
            <img src={originalAsset(image)} alt="" />
          </div>
        </section>
        <ContactBand />
      </>
    );
  }
  return (
    <>
      <PageTitle
        label="Industrieën"
        description="Vacuüm- en blowertechniek voor uiteenlopende productie- en waterprocessen."
      >
        Kennis van techniek. Oog voor uw industrie.
      </PageTitle>
      <section className="wrap source-card-grid industry-grid">
        {industries.map(([slug, title, description, image], index) => (
          <Reveal key={slug} className="source-card" delay={index * 0.04}>
            <img src={originalAsset(image)} alt="" loading="lazy" />
            <p className="eyebrow">Industrie</p>
            <h2>{title}</h2>
            <p>{description}</p>
            <a className="text-link" href={url(`industrieen/${slug}`)}>
              Meer over deze industrie <ArrowRight size={20} />
            </a>
          </Reveal>
        ))}
        <Reveal className="industry-advice" delay={industries.length * 0.04}>
          <h2>Op zoek naar een oplossing op maat?</h2>
          <p>
            Vraag een vrijblijvend adviesgesprek aan bij DOVAC en kom in contact
            met onze specialisten.
          </p>
          <a
            className="button industry-advice-button"
            href={url("contact") + "?onderwerp=Advies%20op%20maat"}
          >
            Advies aanvragen <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </Reveal>
      </section>
      <ContactBand />
    </>
  );
}

export default function InnerPage({ page, ui }) {
  const locale = currentLocale();
  const { products, faqs, applicationPages, industries, knowledgeContent } =
    contentFor(locale);
  const blogArticle = knowledgeContent.blog.items.find(
    (item) => page === `blog/${item.slug}`,
  );
  if (blogArticle) return <BlogArticlePage article={blogArticle} ui={ui} />;
  if (page === "blog" || page === "nieuws")
    return <InsightsPage page={page} ui={ui} content={knowledgeContent} />;
  const { Reveal, Button, PageTitle, ContactBand } = ui;
  const product = products.find((p) => page === `producten/${p.slug}`);
  if (product) return <ProductDetail product={product} ui={ui} />;
  const application = applicationPages[page.replace("toepassingen/", "")];
  if (page.startsWith("toepassingen/") && application)
    return <ArticlePage article={application} ui={ui} />;
  if (page === "toepassingen") return <ApplicationsPage ui={ui} />;
  if (page === "industrieen" || page.startsWith("industrieen/"))
    return <IndustriesPage page={page} ui={ui} />;
  if (page === "producten")
    return (
      <>
        <PageTitle
          label="Producten"
          description="Van vacuüm tot luchtstroom. Ontdek ons assortiment en vind samen met DOVAC de juiste oplossing."
        >
          Vind de techniek die bij u past.
        </PageTitle>
        <ProductExplorer ui={ui} />
        <ContactBand />
      </>
    );
  if (page === "onderhoud-reparaties/onderhoud-en-reparaties")
    return (
      <>
        <PageTitle
          label="Onderhoud & reparaties"
          description="Geef uw pomp de aandacht die hij verdient. Met preventief onderhoud, vakkundige reparatie en grondige revisie."
        >
          Meer draaien. Minder stilstaan.
        </PageTitle>
        <section className="wrap service-banner">
          <img
            src={originalAsset("349d77612df50334.jpg")}
            alt="Onderhoud aan de rotor van een vacuümpomp"
            width="941"
            height="659"
            fetchPriority="high"
          />
          <div className="service-callout">
            <Phone size={30} />
            <h2>Een storing wacht niet.</h2>
            <p>
              Onze bereikbaarheid ook niet. Bel ons en bespreek direct wat er
              aan de hand is.
            </p>
            <a className="button" href="tel:+31252423363">
              0252 42 33 63 <ArrowUpRight size={20} />
            </a>
            <span>24/7 bereikbaar</span>
          </div>
        </section>
        <section className="wrap section">
          <Reveal>
            <h2>
              Aandacht voor
              <br />
              ieder onderdeel.
            </h2>
          </Reveal>
          <div className="service-list">
            {[
              [
                Wrench,
                "Preventief onderhoud",
                "Problemen voorkomen begint met regelmatig onderhoud. We kijken naar de staat van uw pomp en het gebruik in uw proces.",
              ],
              [
                GearSix,
                "Reparatie & revisie",
                "Van een defect onderdeel tot een complete revisie. Na de werkzaamheden wordt uw pomp uitgebreid getest.",
              ],
              [
                ShieldCheck,
                "Onderdelen & advies",
                "Filters, vacuümpompolie en onderdelen voor diverse merken. Met technisch advies over de juiste keuze.",
              ],
            ].map(([Icon, title, copy]) => (
              <Reveal key={title} className="service-item">
                <Icon size={34} weight="light" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="wrap service-detail">
          <Reveal>
            <img
              src={originalAsset("08682a32485e7ef2.jpg")}
              width="480"
              height="801"
              loading="lazy"
              alt="Een specialist inspecteert onderdelen in de DOVAC-werkplaats"
            />
          </Reveal>
          <Reveal>
            <h2>
              Uw pomp.
              <br />
              In ervaren handen.
            </h2>
            <p>
              Het merk of de leeftijd hoeft geen belemmering te zijn. DOVAC
              onderhoudt en repareert vacuümpompen en blowers van verschillende
              merken.
            </p>
            <div className="guarantee">
              <strong>12 maanden</strong>
              <span>
                garantie na service, zoals vermeld op de bestaande
                DOVAC-website. Vraag naar de toepasselijke voorwaarden.
              </span>
            </div>
            <Button
              href={url("contact") + "?onderwerp=Onderhoud%20of%20reparatie"}
            >
              Bespreek uw vraag
            </Button>
          </Reveal>
        </section>
        <ContactBand />
      </>
    );
  if (page === "datasheets" || page === "documentatie")
    return (
      <>
        <PageTitle
          label="Datasheets"
          description="Een goede keuze begint met de juiste gegevens. Vraag de technische documentatie aan voor uw pomp, blower of systeem."
        >
          De details maken het verschil.
        </PageTitle>
        <section className="wrap document-section">
          <div className="document-intro">
            <FileText size={78} weight="thin" />
            <h2>
              Welke gegevens
              <br />
              heeft u nodig?
            </h2>
            <p>
              Capaciteit, druk, afmetingen of aansluitingen: vermeld de
              productgroep en het type, dan kan DOVAC de juiste datasheet
              selecteren.
            </p>
            <p className="notice">
              Dit ontwerpconcept bevat nog geen originele PDF-bestanden. De
              knoppen hieronder openen een e-mailconcept, geen download.
            </p>
          </div>
          <div className="document-list">
            {products.map((p) => (
              <a
                key={p.slug}
                className="document-row"
                href={`mailto:info@dovac.nl?subject=${encodeURIComponent("Datasheet aanvragen: " + p.name)}&body=${encodeURIComponent("Goedendag DOVAC,\n\nGraag ontvang ik een datasheet voor:\nProductgroep: " + p.name + "\nMerk en type: \nToepassing: \n\nMet vriendelijke groet,")}`}
              >
                <FileText size={24} />
                <div>
                  <h3>{p.name}</h3>
                  <span>Datasheet aanvragen per e-mail</span>
                </div>
                <ArrowUpRight size={22} />
              </a>
            ))}
          </div>
        </section>
        <ContactBand />
      </>
    );
  if (page === "faq" || page === "veelgestelde-vragen")
    return (
      <>
        <PageTitle
          label="Veelgestelde vragen"
          description="Van pompselectie tot onderhoud. De belangrijkste antwoorden bij elkaar, zonder ingewikkeld verhaal."
        >
          Een vraag? Hier begint het antwoord.
        </PageTitle>
        <section className="wrap faq-section">
          <div className="faq-intro">
            <h2>
              Liever even
              <br />
              overleggen?
            </h2>
            <p>
              Elke toepassing is anders. We denken graag mee over uw situatie.
            </p>
            <a className="text-link" href="tel:+31252423363">
              0252 42 33 63 <ArrowUpRight size={22} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={22} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <ContactBand />
      </>
    );
  if (page === "over-ons")
    return (
      <>
        <PageTitle
          label="Over DOVAC"
          description="Een team met kennis van techniek en aandacht voor uw proces. Sinds 2003 thuis in blower- en vacuümtechniek."
        >
          Techniek is ons vak. Meedenken onze natuur.
        </PageTitle>
        <section className="wrap company-story">
          <Reveal className="company-photo">
            <img
              src={originalAsset("7ef641b23b81fed5.jpg")}
              alt="Het DOVAC-bedrijfspand met zonnepanelen in Zevenhuizen"
              width="941"
              height="801"
              fetchPriority="high"
            />
          </Reveal>
          <Reveal className="company-copy">
            <h2>
              Korte lijnen.
              <br />
              Diepgaande kennis.
            </h2>
            <p>
              Vanuit Zevenhuizen leveren we vacuümpompen, blowers, systemen en
              onderdelen. Met een eigen werkplaats, magazijn en proefstand
              brengen we advies en uitvoering samen.
            </p>
            <p>
              DOVAC is exclusief agent van DVP, ASCO, Galex & Master Blower voor
              de Benelux. De technische vraag achter uw toepassing staat
              centraal.
            </p>
            <a className="text-link" href={url("contact")}>
              Bespreek uw vraag <ArrowUpRight size={20} />
            </a>
          </Reveal>
        </section>
        <section className="wrap timeline-section">
          <Reveal>
            <h2>
              Gebouwd op ervaring.
              <br />
              Gericht op morgen.
            </h2>
          </Reveal>
          <div className="timeline">
            {[
              [
                "2003",
                "Het begin",
                "DOVAC wordt opgericht vanuit jarenlange vakkennis van de industrie.",
              ],
              [
                "2006",
                "Ruimte voor groei",
                "DOVAC vestigt zich in Lisse en bouwt het assortiment verder uit.",
              ],
              [
                "2020",
                "Een nieuwe impuls",
                "Ferry Jansen treedt toe als nieuwe drijvende kracht achter het bedrijf.",
              ],
              [
                "2022",
                "Thuis in Zevenhuizen",
                "De verhuizing naar een modern, energieneutraal pand met magazijn, werkplaats en proefstand.",
              ],
            ].map(([year, title, text]) => (
              <Reveal key={year}>
                <strong>{year}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="wrap team-statement">
          <Waveform size={72} weight="thin" />
          <h2>
            Niet alleen een pomp leveren.
            <br />
            <span className="muted">De juiste oplossing vinden.</span>
          </h2>
          <p>
            Waar nodig voeren we lucht- en vacuümtechnische berekeningen uit.
            Ook een pomp of blower op proef behoort tot de mogelijkheden.
          </p>
        </section>
        <ContactBand />
      </>
    );
  if (page === "contact")
    return (
      <>
        <PageTitle
          label="Contact"
          description="Een nieuwe toepassing, een technische vraag of een pomp die aandacht nodig heeft. We denken met u mee."
        >
          Vertel ons wat u nodig heeft.
        </PageTitle>
        <section className="wrap contact-layout">
          <div className="contact-information">
            <a href="tel:+31252423363">
              <Phone size={27} />
              <span>
                <small>Bel ons, ook bij een storing</small>
                <strong>0252 42 33 63</strong>
              </span>
              <ArrowUpRight size={22} />
            </a>
            <a href="mailto:info@dovac.nl">
              <EnvelopeSimple size={27} />
              <span>
                <small>Stuur een e-mail</small>
                <strong>info@dovac.nl</strong>
              </span>
              <ArrowUpRight size={22} />
            </a>
            <div>
              <MapPin size={27} />
              <span>
                <small>Bezoek op afspraak</small>
                <address>
                  Koning Willem-Alexanderlaan 195
                  <br />
                  2761 HK Zevenhuizen
                </address>
              </span>
            </div>
            <img
              src={originalAsset("7ef641b23b81fed5.jpg")}
              width="941"
              height="801"
              alt="DOVAC in Zevenhuizen"
              loading="lazy"
            />
          </div>
          <ContactForm />
        </section>
      </>
    );
  return (
    <>
      <PageTitle
        label="Pagina niet gevonden"
        description="Deze pagina bestaat niet in dit ontwerpconcept. Via het overzicht vindt u de beschikbare productgroepen."
      >
        Hier loopt de route even dood.
      </PageTitle>
      <div className="wrap empty-page">
        <Button href={url("producten")}>Bekijk producten</Button>
      </div>
    </>
  );
}

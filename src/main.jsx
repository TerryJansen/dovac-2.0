import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Phone,
  List,
  X,
  Sun,
  Moon,
  Fan,
  Wrench,
  ShieldCheck,
  Waveform,
  CheckCircle,
  CaretDown,
} from "@phosphor-icons/react";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./styles.css";
import "./interactions.css";
import InnerPage from "./pages";
import { ProductNavigator } from "./products";
import RequestModal from "./request-modal";
import { url, asset, originalAsset, routesFor, base } from "./site-data";
import { currentLocale, uiFor } from "./i18n";

export function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Button({ children, href, secondary = false, ...props }) {
  return (
    <a
      className={`button ${secondary ? "secondary" : ""}`}
      href={href}
      {...props}
    >
      {children}
      <ArrowUpRight size={20} aria-hidden="true" />
    </a>
  );
}
export function PageTitle({ label, children, description }) {
  return (
    <header className="page-title wrap">
      <Reveal>
        {label && <p className="eyebrow">{label}</p>}
        <h1>{children}</h1>
        {description && <p className="lead">{description}</p>}
      </Reveal>
    </header>
  );
}
function BrandLogo() {
  return (
    <span className="brand-logo">
      <img
        className="brand-logo-light"
        src={asset("logo")}
        width="127"
        height="69"
        alt="DOVAC"
      />
      <img
        className="brand-logo-dark"
        src={`${base}images/logo-dark.png`}
        width="260"
        height="134"
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}
function Header() {
  const locale = currentLocale();
  const ui = uiFor(locale);
  const routes = routesFor(ui);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("dovac-theme") || "system";
    } catch {
      return "system";
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("dovac-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        document.querySelector(".menu-toggle")?.focus();
      }
      if (e.key === "Escape" && aboutOpen) setAboutOpen(false);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [aboutOpen, open]);
  const isDark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <>
      <a className="skip" href="#main">
        {ui.header.skipToContent}
      </a>
      <div className="utility">
        <div className="wrap">
          <span>
            <CheckCircle size={15} />
            {ui.header.technicalAdvice}
          </span>
          <span>
            <CheckCircle size={15} />
            {ui.header.available247}
          </span>
          <span>
            <CheckCircle size={15} />
            {ui.header.fastDelivery}
          </span>
          <div className="language-switcher" aria-label="Language selector">
            {["nl", "en", "de"].map((language) => (
              <a
                key={language}
                href={url(
                  location.pathname
                    .replace(/^.*?\/(?:nl|en|de)\/?/, "")
                    .replace(/\/$/, "") || "home",
                  language,
                )}
                lang={language}
                aria-current={locale === language ? "page" : undefined}
              >
                {language.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap nav-wrap">
          <a className="logo" href={url()} aria-label={ui.header.homeAriaLabel}>
            <BrandLogo />
          </a>
          <nav
            id="navigation"
            className={open ? "open" : ""}
            aria-label={ui.header.primaryNavigation}
          >
            {routes.map(([text, path]) => {
              const isAbout = path === "over-ons";
              const isCurrent = location.pathname.includes(
                `/${locale}/${path}/`,
              );
              if (!isAbout)
                return (
                  <a
                    key={path}
                    href={url(path)}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {text}
                  </a>
                );
              const isAboutSection =
                isCurrent ||
                ["blog", "nieuws"].some((item) =>
                  location.pathname.includes(`/${locale}/${item}/`),
                );
              return (
                <div
                  className="nav-dropdown"
                  data-open={aboutOpen || undefined}
                  key={path}
                >
                  <a
                    href={url(path)}
                    aria-current={isAboutSection ? "page" : undefined}
                  >
                    {text}
                  </a>
                  <button
                    type="button"
                    className="nav-submenu-toggle"
                    aria-label={ui.header.openAboutMenu}
                    aria-expanded={aboutOpen}
                    aria-controls="about-submenu"
                    onClick={() => setAboutOpen((value) => !value)}
                  >
                    <CaretDown size={15} aria-hidden="true" />
                  </button>
                  <div className="nav-submenu" id="about-submenu">
                    <a href={url("blog")}>{ui.header.blog}</a>
                    <a href={url("nieuws")}>{ui.header.news}</a>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="nav-actions">
            <a
              className="phone"
              href="tel:+31252423363"
              aria-label={ui.header.callDovac}
            >
              <Phone size={19} />
              <span>0252 42 33 63</span>
            </a>
            <button
              className="icon-button theme"
              aria-label={isDark ? ui.header.lightTheme : ui.header.darkTheme}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="icon-button menu-toggle"
              aria-label={open ? ui.header.closeMenu : ui.header.openMenu}
              aria-controls="navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band wrap">
      <Reveal>
        <p>Een technische vraag verdient een helder antwoord.</p>
        <h2>
          Waar kunnen we
          <br />u mee helpen?
        </h2>
        <Button href={url("contact")}>Bespreek uw vraag</Button>
      </Reveal>
      <a className="big-phone" href="tel:+31252423363">
        <Phone size={30} />
        <span>
          0252 42 33 63<small>Direct contact met DOVAC</small>
        </span>
        <ArrowUpRight size={30} />
      </a>
    </section>
  );
}
function Partners() {
  const partners = [
    ["dvp", "DVP"],
    ["asco", "ASCO"],
    ["master-blower", "Master Blower"],
    ["galex-air", "Galex Air"],
  ];
  const loopPartners = [...partners, ...partners];
  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="wrap partners-inner">
        <div>
          <h2 id="partners-title">Onze partners</h2>
          <p>
            Merken die we met technische kennis en korte lijnen
            vertegenwoordigen.
          </p>
        </div>
        <div className="partner-marquee">
          <ul className="partner-logos">
            {loopPartners.map(([slug, name], index) => (
              <li
                key={`${slug}-${index}`}
                aria-hidden={index >= partners.length || undefined}
              >
                <img
                  src={`${base}images/partners/${slug}.webp`}
                  alt={`${name} logo`}
                  width="220"
                  height="130"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  const ui = uiFor();
  const routes = routesFor(ui);
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <a className="logo" href={url()} aria-label={ui.header.homeAriaLabel}>
            <BrandLogo />
          </a>
          <p>{ui.footer.tagline}</p>
        </div>
        <div>
          <h3>{ui.footer.discover}</h3>
          {routes.slice(0, 3).map(([t, p]) => (
            <a key={p} href={url(p)}>
              {t}
            </a>
          ))}
        </div>
        <div>
          <h3>{ui.footer.goodToKnow}</h3>
          {routes.slice(3).map(([t, p]) => (
            <a key={p} href={url(p)}>
              {t}
            </a>
          ))}
          <a href={url("blog")}>{ui.header.blog}</a>
          <a href={url("nieuws")}>{ui.header.news}</a>
        </div>
        <div>
          <h3>{ui.footer.getInTouch}</h3>
          <a href="mailto:info@dovac.nl">
            info@dovac.nl <ArrowUpRight size={16} />
          </a>
          <a href="tel:+31252423363">0252 42 33 63</a>
          <address>
            Koning Willem-Alexanderlaan 195
            <br />
            2761 HK Zevenhuizen
          </address>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>{ui.footer.companyLine}</span>
        <span>{ui.footer.designConcept}</span>
      </div>
    </footer>
  );
}
function Home({ onRequest }) {
  const reduce = useReducedMotion();
  const home = uiFor().home;
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="mini-line" />
            {home.eyebrow}
          </p>
          <h1 aria-label={home.title}>
            <span className="line-mask">
              <motion.span
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                {home.titleFirstLine}{" "}
              </motion.span>
            </span>
            <span className="line-mask accent">
              <motion.span
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {home.titleSecondLine}
              </motion.span>
            </span>
          </h1>
          <Reveal delay={0.2}>
            <p className="hero-description">{home.description}</p>
            <div className="hero-buttons">
              <button
                className="button"
                type="button"
                onClick={() => onRequest("quote")}
              >
                {home.requestQuote}{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => onRequest("appointment")}
              >
                {home.makeAppointment}{" "}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.12}>
          <div className="image-frame">
            <img
              src={originalAsset("1f7e68e87940984c.jpg")}
              alt={home.heroImageAlt}
              width="941"
              height="659"
              fetchPriority="high"
            />
            <div className="image-corner" aria-hidden="true">
              <ArrowDown size={32} />
            </div>
          </div>
          <div className="photo-caption">
            <span>{home.precisionCaption}</span>
            <span>{home.craftsmanshipCaption}</span>
          </div>
        </Reveal>
      </section>
      <section className="proof-strip">
        <div className="wrap">
          <div>
            <strong>{home.since2003}</strong>
            <span>{home.atHomeInVacuumTechnology}</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>{home.availableForQuestion}</span>
          </div>
          <div>
            <strong>{home.fromAdviceToOverhaul}</strong>
            <span>{home.allUnderOneRoof}</span>
          </div>
          <a href={url("over-ons")}>
            {home.getToKnowDovac} <ArrowUpRight size={24} />
          </a>
        </div>
      </section>
      <section className="product-motion-section">
        <div className="wrap product-motion-layout">
          <Reveal className="product-motion-copy">
            <p className="eyebrow">{home.productMotion.eyebrow}</p>
            <h2>{home.productMotion.title}</h2>
            <p id="product-motion-description">
              {home.productMotion.description}
            </p>
            <a className="text-link" href={url("producten/vacuumpompen")}>
              {home.productMotion.viewVacuumPumps}{" "}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal className="product-motion-video" delay={0.08}>
            <video
              src={`${base}videos/3d-vacuumpomp.mp4`}
              poster={`${base}images/3d-vacuumpomp-poster.jpg`}
              autoPlay={!reduce}
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-describedby="product-motion-description"
            >
              {home.productMotion.unsupportedVideo}
            </video>
          </Reveal>
        </div>
      </section>
      <section className="section wrap">
        <Reveal>
          <h2>
            {home.solutions.title}
            <br />
            <span className="muted">{home.solutions.subtitle}</span>
          </h2>
          <p className="section-intro">{home.solutions.intro}</p>
        </Reveal>
        <div className="solutions-grid">
          <Reveal className="solution vacuum">
            <div className="solution-icon">
              <Waveform weight="thin" size={92} />
            </div>
            <span className="category-label">{home.solutions.vacuumLabel}</span>
            <h3>{home.solutions.vacuumTitle}</h3>
            <p>{home.solutions.vacuumDescription}</p>
            <a
              className="round-link"
              href={url("producten/vacuumpompen")}
              aria-label={home.solutions.viewVacuumPumps}
            >
              <ArrowUpRight size={28} />
            </a>
          </Reveal>
          <Reveal className="solution blower" delay={0.08}>
            <div className="solution-icon">
              <Fan weight="thin" size={108} />
            </div>
            <span className="category-label">{home.solutions.blowerLabel}</span>
            <h3>{home.solutions.blowerTitle}</h3>
            <p>{home.solutions.blowerDescription}</p>
            <a
              className="round-link"
              href={url("producten/zijkanaalventilatoren")}
              aria-label={home.solutions.viewSideChannelBlowers}
            >
              <ArrowUpRight size={28} />
            </a>
          </Reveal>
        </div>
        <div className="section-bottom">
          <span>{home.solutions.systemsAndParts}</span>
          <a className="text-link" href={url("producten")}>
            {home.solutions.allProductGroups} <ArrowRight size={20} />
          </a>
        </div>
      </section>
      <ProductNavigator ui={{ Reveal }} />
      <section className="service-section">
        <div className="wrap service-grid">
          <Reveal className="service-image">
            <img
              src={originalAsset("2a7cea9538ceccd9.jpg")}
              alt={home.service.imageAlt}
              width="480"
              height="801"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="service-copy">
            <p className="eyebrow">{home.service.eyebrow}</p>
            <h2>{home.service.title}</h2>
            <p>{home.service.description}</p>
            <div className="service-points">
              <div>
                <Wrench size={22} />
                <span>{home.service.maintenanceRepairOverhaul}</span>
              </div>
              <div>
                <ShieldCheck size={22} />
                <span>{home.service.thoroughlyTested}</span>
              </div>
              <div>
                <CheckCircle size={22} />
                <span>{home.service.otherBrands}</span>
              </div>
            </div>
            <Button href={url("onderhoud-reparaties/onderhoud-en-reparaties")}>
              {home.service.discoverService}
            </Button>
          </Reveal>
        </div>
      </section>
      <section className="about-section wrap">
        <Reveal>
          <h2>{home.about.title}</h2>
          <p className="section-intro">{home.about.description}</p>
          <a className="text-link" href={url("over-ons")}>
            {home.about.moreAboutDovac} <ArrowUpRight size={20} />
          </a>
        </Reveal>
        <Reveal className="wide-image">
          <img
            src={originalAsset("7ef641b23b81fed5.jpg")}
            alt={home.about.imageAlt}
            width="1600"
            height="221"
            loading="lazy"
          />
        </Reveal>
      </section>
      <ContactBand />
    </>
  );
}
function App() {
  const [requestMode, setRequestMode] = useState(null);
  const relative = location.pathname.startsWith(base)
    ? location.pathname.slice(base.length)
    : location.pathname.slice(1);
  const page =
    relative.replace(/^(?:nl|en|de)\//, "").replace(/\/$/, "") || "home";
  useEffect(() => {
    const heading = document.querySelector("h1")?.textContent;
    document.title = `${heading || "Blower- en vacuümtechniek"} | DOVAC`;
  }, [page]);
  return (
    <>
      <Header />
      <main id="main">
        {page === "home" ? (
          <Home onRequest={setRequestMode} />
        ) : (
          <InnerPage
            page={page}
            ui={{ Reveal, Button, PageTitle, ContactBand }}
          />
        )}
      </main>
      <Partners />
      <Footer />
      {requestMode && (
        <RequestModal mode={requestMode} onClose={() => setRequestMode(null)} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

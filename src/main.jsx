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
} from "@phosphor-icons/react";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./styles.css";
import "./interactions.css";
import InnerPage from "./pages";
import { ProductNavigator } from "./products";
import { url, asset, routes, base } from "./site-data";

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
function Header() {
  const [open, setOpen] = useState(false);
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
      if (e.key === "Escape") {
        setOpen(false);
        document.querySelector(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const isDark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <>
      <a className="skip" href="#main">
        Ga naar inhoud
      </a>
      <div className="utility">
        <div className="wrap">
          <span>
            <CheckCircle size={15} />
            Technisch advies op maat
          </span>
          <span>
            <CheckCircle size={15} />
            24/7 bereikbaar
          </span>
          <span>
            <CheckCircle size={15} />
            Snelle levering uit voorraad
          </span>
          <span className="language">Nederlands</span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap nav-wrap">
          <a className="logo" href={url()} aria-label="DOVAC home">
            <img src={asset("logo")} width="127" height="69" alt="DOVAC" />
          </a>
          <nav
            id="navigation"
            className={open ? "open" : ""}
            aria-label="Hoofdnavigatie"
          >
            {routes.map(([text, path]) => (
              <a
                key={path}
                href={url(path)}
                aria-current={
                  location.pathname.includes(`/nl/${path}/`)
                    ? "page"
                    : undefined
                }
              >
                {text}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a
              className="phone"
              href="tel:+31252423363"
              aria-label="Bel DOVAC op 0252 42 33 63"
            >
              <Phone size={19} />
              <span>0252 42 33 63</span>
            </a>
            <button
              className="icon-button theme"
              aria-label={isDark ? "Licht thema" : "Donker thema"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="icon-button menu-toggle"
              aria-label={open ? "Menu sluiten" : "Menu openen"}
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
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <a className="logo" href={url()} aria-label="DOVAC home">
            <img
              src={asset("logo")}
              alt="DOVAC"
              width="127"
              height="69"
              loading="lazy"
            />
          </a>
          <p>
            De kracht achter
            <br />
            uw lucht- en vacuümtechniek.
          </p>
        </div>
        <div>
          <h3>Ontdek DOVAC</h3>
          {routes.slice(0, 3).map(([t, p]) => (
            <a key={p} href={url(p)}>
              {t}
            </a>
          ))}
        </div>
        <div>
          <h3>Goed om te weten</h3>
          {routes.slice(3).map(([t, p]) => (
            <a key={p} href={url(p)}>
              {t}
            </a>
          ))}
        </div>
        <div>
          <h3>Kom in contact</h3>
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
        <span>DOVAC. Blower- en vacuümtechniek.</span>
        <span>Ontwerpconcept · Niet de officiële website</span>
        <a href="https://dovac.nl/nl/home/" target="_blank" rel="noreferrer">
          Bestaande website <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
function Home() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="mini-line" />
            Blower- en vacuümtechniek
          </p>
          <h1 aria-label="Techniek die blijft draaien.">
            <span className="line-mask">
              <motion.span
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                Techniek die{" "}
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
                blijft draaien.
              </motion.span>
            </span>
          </h1>
          <Reveal delay={0.2}>
            <p className="hero-description">
              Van de juiste vacuümpomp tot vakkundig onderhoud. DOVAC houdt uw
              proces in beweging.
            </p>
            <div className="hero-buttons">
              <Button href={url("producten")}>Ontdek producten</Button>
              <a
                className="text-link"
                href={url("onderhoud-reparaties/onderhoud-en-reparaties")}
              >
                Onderhoud & reparaties <ArrowRight size={20} />
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.12}>
          <div className="image-frame">
            <img
              src={asset("maintenance")}
              alt="DOVAC-monteur werkt zorgvuldig aan een vacuümpomp"
              width="941"
              height="659"
              fetchPriority="high"
            />
            <div className="image-corner" aria-hidden="true">
              <ArrowDown size={32} />
            </div>
          </div>
          <div className="photo-caption">
            <span>Precisie in elk onderdeel.</span>
            <span>Vakmanschap van DOVAC</span>
          </div>
        </Reveal>
      </section>
      <section className="proof-strip">
        <div className="wrap">
          <div>
            <strong>Sinds 2003</strong>
            <span>Thuis in vacuümtechniek</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Bereikbaar voor uw vraag</span>
          </div>
          <div>
            <strong>Van advies tot revisie</strong>
            <span>Alles onder één dak</span>
          </div>
          <a href={url("over-ons")}>
            Maak kennis met DOVAC <ArrowUpRight size={24} />
          </a>
        </div>
      </section>
      <section className="section wrap">
        <Reveal>
          <h2>
            De juiste techniek.
            <br />
            <span className="muted">Voor uw toepassing.</span>
          </h2>
          <p className="section-intro">
            Vacuüm creëren, lucht verplaatsen of gericht drogen. Begin bij wat
            uw proces nodig heeft.
          </p>
        </Reveal>
        <div className="solutions-grid">
          <Reveal className="solution vacuum">
            <div className="solution-icon">
              <Waveform weight="thin" size={92} />
            </div>
            <span className="category-label">Vacuümtechniek</span>
            <h3>
              Meer grip.
              <br />
              Met minder druk.
            </h3>
            <p>Vacuümpompen en draaischuifpompen, afgestemd op uw proces.</p>
            <a
              className="round-link"
              href={url("producten/vacuumpompen")}
              aria-label="Bekijk vacuümpompen"
            >
              <ArrowUpRight size={28} />
            </a>
          </Reveal>
          <Reveal className="solution blower" delay={0.08}>
            <div className="solution-icon">
              <Fan weight="thin" size={108} />
            </div>
            <span className="category-label">Blowertechniek</span>
            <h3>
              Lucht die
              <br />
              werk verzet.
            </h3>
            <p>Zijkanaalventilatoren, turbo blowers en luchtmessen.</p>
            <a
              className="round-link"
              href={url("producten/zijkanaalventilatoren")}
              aria-label="Bekijk zijkanaalventilatoren"
            >
              <ArrowUpRight size={28} />
            </a>
          </Reveal>
        </div>
        <div className="section-bottom">
          <span>Ook voor complete systemen en spare parts.</span>
          <a className="text-link" href={url("producten")}>
            Alle productgroepen <ArrowRight size={20} />
          </a>
        </div>
      </section>
      <ProductNavigator ui={{ Reveal }} />
      <section className="service-section">
        <div className="wrap service-grid">
          <Reveal className="service-image">
            <img
              src={asset("workshop")}
              alt="Een DOVAC-specialist voert onderhoud uit in de werkplaats"
              width="480"
              height="801"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="service-copy">
            <p className="eyebrow">Onderhoud & reparaties</p>
            <h2>
              Stilstand?
              <br />
              Daar werken
              <br />
              we niet aan mee.
            </h2>
            <p>
              Voorkom problemen met tijdig onderhoud. En gaat er toch iets mis?
              Dan helpen we u weer op weg.
            </p>
            <div className="service-points">
              <div>
                <Wrench size={22} />
                <span>Onderhoud, reparatie en revisie</span>
              </div>
              <div>
                <ShieldCheck size={22} />
                <span>Uitgebreid getest na onderhoud</span>
              </div>
              <div>
                <CheckCircle size={22} />
                <span>Ook voor pompen van andere merken</span>
              </div>
            </div>
            <Button href={url("onderhoud-reparaties/onderhoud-en-reparaties")}>
              Ontdek onze service
            </Button>
          </Reveal>
        </div>
      </section>
      <section className="about-section wrap">
        <Reveal>
          <h2>
            Technische kennis.
            <br />
            Persoonlijk betrokken.
          </h2>
          <p className="section-intro">
            Achter iedere pomp staat een team dat meedenkt. Vanuit Zevenhuizen
            helpen we u van eerste vraag tot werkende oplossing.
          </p>
          <a className="text-link" href={url("over-ons")}>
            Meer over DOVAC <ArrowUpRight size={20} />
          </a>
        </Reveal>
        <Reveal className="wide-image">
          <img
            src={asset("warehouse")}
            alt="Het DOVAC-magazijn met onderdelen en pompen op voorraad"
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
  const relative = location.pathname.startsWith(base)
    ? location.pathname.slice(base.length)
    : location.pathname.slice(1);
  const page = relative.replace(/^nl\//, "").replace(/\/$/, "") || "home";
  useEffect(() => {
    const heading = document.querySelector("h1")?.textContent;
    document.title = `${heading || "Blower- en vacuümtechniek"} | DOVAC`;
  }, [page]);
  return (
    <>
      <Header />
      <main id="main">
        {page === "home" ? (
          <Home />
        ) : (
          <InnerPage
            page={page}
            ui={{ Reveal, Button, PageTitle, ContactBand }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

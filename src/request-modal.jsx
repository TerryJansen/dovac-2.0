import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarBlank,
  EnvelopeSimple,
  FileText,
  X,
} from "@phosphor-icons/react";

const configs = {
  quote: {
    title: "Offerte aanvragen",
    intro:
      "Vertel kort wat u nodig heeft. We zetten uw aanvraag klaar als e-mailconcept.",
    subject: "Offerteaanvraag",
    detailLabel: "Waar wilt u een offerte voor?",
    detailPlaceholder: "Bijvoorbeeld: vacuümpomp voor een verpakkingslijn",
  },
  appointment: {
    title: "Afspraak maken",
    intro:
      "Geef uw voorkeur door. We zetten uw afspraakverzoek klaar als e-mailconcept.",
    subject: "Afspraakverzoek",
    detailLabel: "Waarover wilt u een afspraak maken?",
    detailPlaceholder:
      "Bijvoorbeeld: advies over onderhoud of een nieuwe installatie",
  },
};

export default function RequestModal({ mode, onClose }) {
  const [draft, setDraft] = useState(null);
  const heading = useRef(null);
  const firstField = useRef(null);
  const config = configs[mode];

  useEffect(() => {
    firstField.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function prepare(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "Niet opgegeven").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "Niet opgegeven").trim();
    const detail = String(data.get("detail") || "").trim();
    const preferredDate = String(data.get("preferredDate") || "Niet opgegeven");
    const message = String(data.get("message") || "Niet opgegeven").trim();
    const text = `Goedendag DOVAC,\n\n${config.title}\n\nNaam: ${name}\nBedrijfsnaam: ${company}\nE-mailadres: ${email}\nTelefoonnummer: ${phone}\n${config.detailLabel}: ${detail}\n${mode === "appointment" ? `Gewenste datum: ${preferredDate}\n` : ""}Toelichting: ${message}\n\nMet vriendelijke groet,\n${name}`;
    setDraft({
      href: `mailto:info@dovac.nl?subject=${encodeURIComponent(`${config.subject}: ${detail}`)}&body=${encodeURIComponent(text)}`,
      text,
    });
    requestAnimationFrame(() => heading.current?.focus());
  }

  return (
    <div
      className="request-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
      >
        <button
          className="request-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Popup sluiten"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <div className="request-modal-icon" aria-hidden="true">
          {mode === "quote" ? (
            <FileText size={28} />
          ) : (
            <CalendarBlank size={28} />
          )}
        </div>
        <h2 id="request-modal-title" ref={heading} tabIndex={-1}>
          {config.title}
        </h2>
        <p>{config.intro}</p>
        <form onSubmit={prepare} onChange={() => setDraft(null)}>
          <div className="form-grid">
            <label className="form-field">
              Naam
              <input
                ref={firstField}
                name="name"
                autoComplete="name"
                required
                maxLength={100}
              />
            </label>
            <label className="form-field">
              Bedrijfsnaam
              <input
                name="company"
                autoComplete="organization"
                maxLength={120}
              />
            </label>
            <label className="form-field full">
              E-mailadres
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
            <label className="form-field full">
              Telefoonnummer
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
              />
            </label>
            <label className="form-field full">
              {config.detailLabel}
              <input
                name="detail"
                required
                maxLength={180}
                placeholder={config.detailPlaceholder}
              />
            </label>
            {mode === "appointment" && (
              <label className="form-field full">
                Gewenste datum
                <input name="preferredDate" type="date" />
              </label>
            )}
            <label className="form-field full">
              Toelichting
              <textarea
                name="message"
                rows={4}
                maxLength={1400}
                placeholder="Beschrijf uw toepassing of vraag kort."
              />
            </label>
          </div>
          <p className="form-note">
            Uw gegevens worden pas verwerkt wanneer u het e-mailconcept zelf
            controleert en verstuurt.
          </p>
          <button className="button" type="submit">
            Maak e-mailconcept <ArrowUpRight size={20} />
          </button>
        </form>
        {draft && (
          <section className="request-draft" aria-label="E-mailconcept">
            <h3 tabIndex={-1} ref={heading}>
              Uw e-mailconcept staat klaar.
            </h3>
            <p>
              Er is nog niets verzonden. Controleer het bericht in uw
              e-mailprogramma en verstuur het daar.
            </p>
            <a className="button" href={draft.href}>
              Open e-mailprogramma <EnvelopeSimple size={20} />
            </a>
          </section>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { waLink } from "@/lib/utils";

interface BigCtaProps {
  num: string;
  primaryHref: string;
  primaryLabel: string;
  /** Heading is rendered as raw HTML (it contains <br> + <em>). */
  headingHtml: string;
  whatsappMessage?: string;
}

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M17.6 6.3a8 8 0 0 0-12.6 9.6L4 20l4.2-1.1a8 8 0 0 0 11.5-7.1 8 8 0 0 0-2.1-5.5Zm-5.6 12.3a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.5.7.7-2.4-.2-.3a6.6 6.6 0 1 1 5.6 3Zm3.6-5c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5.4 5.4 0 0 1-1.6-1 6 6 0 0 1-1.1-1.4c-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3l-.6-1.4c-.2-.4-.3-.3-.5-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5c0 .9.6 1.7.7 1.8.1.2 1.3 2 3.2 2.7l1 .4a3 3 0 0 0 1.4-.1c.4-.1 1.2-.5 1.4-1l.1-.9c0-.1-.1-.2-.3-.2Z" />
  </svg>
);

export function BigCta({ num, headingHtml, primaryHref, primaryLabel, whatsappMessage = "Hola UNLIMITED" }: BigCtaProps) {
  return (
    <section className="bigcta">
      <div className="wrap">
        <span className="num" data-reveal>
          {num}
        </span>
        <h2
          className="display bigcta-h"
          data-reveal
          data-reveal-delay="1"
          dangerouslySetInnerHTML={{ __html: headingHtml }}
        />
        <div className="bigcta-row" data-reveal data-reveal-delay="2">
          <Link className="btn btn--accent" href={primaryHref}>
            {primaryLabel} <span className="arrow">→</span>
          </Link>
          <a className="btn" href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <WaIcon />
            Whatsapp directo
          </a>
        </div>
      </div>
    </section>
  );
}

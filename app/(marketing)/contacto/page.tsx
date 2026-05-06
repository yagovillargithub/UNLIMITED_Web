import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { WaFloat } from "@/components/wa-float";
import { WA_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cuéntenos en qué piensa. Respondemos en menos de 24h laborables — normalmente antes. Email, formulario o Whatsapp directo.",
  openGraph: {
    title: "Contacto — UNLIMITED",
    description: "Respondemos en menos de 24h laborables.",
    type: "website",
  },
};

const formatWa = (n: string) =>
  n.replace(/(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, "+$1 $2 $3 $4 $5");

export default function ContactoPage() {
  return (
    <>
      <section className="ct-hero" data-screen-label="01 Contacto Hero">
        <div className="wrap ct-grid">
          <div className="ct-left">
            <span className="num" data-reveal>
              Contacto
            </span>
            <h1 className="display ct-h" data-reveal data-reveal-delay="1">
              Cuéntenos<br />
              <em>en qué piensa.</em>
            </h1>
            <p
              className="lede"
              data-reveal
              data-reveal-delay="2"
              style={{ marginTop: "var(--s-3)" }}
            >
              Respondemos en menos de 24h laborables. Si prefiere algo más rápido,
              Whatsapp directo abajo a la derecha.
            </p>

            <div className="ct-info" data-reveal data-reveal-delay="3">
              <div className="ct-info-row">
                <span className="mono text-faint">Email</span>
                <a href="mailto:hola@unlimited.systems">hola@unlimited.systems</a>
              </div>
              <div className="ct-info-row">
                <span className="mono text-faint">Whatsapp</span>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  {formatWa(WA_NUMBER)}
                </a>
              </div>
              <div className="ct-info-row">
                <span className="mono text-faint">Oficina</span>
                <span>Calle de Velázquez, Madrid</span>
              </div>
              <div className="ct-info-row">
                <span className="mono text-faint">Horario</span>
                <span>Lun–Vie · 09:00–19:00 CET</span>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <WaFloat />
    </>
  );
}

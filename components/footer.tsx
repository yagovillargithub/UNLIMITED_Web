import Link from "next/link";
import { WA_NUMBER } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="grid">
          <div>
            <h4>UNLIMITED</h4>
            <p className="text-faint" style={{ maxWidth: "32ch" }}>
              Consultora de sistemas e integración de IA. Madrid + remoto, equipo distribuido en EU.
            </p>
          </div>
          <div>
            <h4>Web</h4>
            <ul>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/servicios">Servicios</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:hola@unlimited.systems">hola@unlimited.systems</a></li>
              <li>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  +{WA_NUMBER.replace(/(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}
                </a>
              </li>
              <li>Madrid · ES</li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/aviso-legal">Aviso legal</Link></li>
              <li><Link href="/privacidad">Privacidad</Link></li>
              <li><Link href="/cookies">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-big" aria-hidden="true">UNLIMITED.</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} UNLIMITED Systems S.L.</span>
          <span>Hecho con cabeza, no con prompts.</span>
        </div>
      </div>
    </footer>
  );
}

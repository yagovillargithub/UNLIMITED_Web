"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/",          label: "Inicio",     match: (p: string) => p === "/" },
  { href: "/servicios", label: "Servicios",  match: (p: string) => p.startsWith("/servicios") },
  { href: "/#proceso",  label: "Proceso",    match: () => false },
  { href: "/contacto",  label: "Contacto",   match: (p: string) => p.startsWith("/contacto") },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Navegación principal">
      <Link href="/" className="nav-logo">
        UNLIMITED<span>.</span>
      </Link>
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={cn(l.match(pathname) && "active")}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/contacto" className="nav-cta">
        <span className="nav-cta-dot" aria-hidden="true" />
        <span>Hablemos</span>
        <span className="nav-cta-arrow" aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}

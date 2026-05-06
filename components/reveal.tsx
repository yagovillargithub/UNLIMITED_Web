"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Activates the prototype's `data-reveal` IntersectionObserver. Mounted once
 * inside the marketing layout; re-runs on each route change so navigating
 * between /, /servicios and /contacto picks up the new page's elements
 * (the marketing layout itself doesn't unmount across these routes).
 *
 * For [data-reveal="char"] we walk only text nodes so inline elements
 * like <br> and <em> survive — splitting via element.textContent (as the
 * original prototype did) silently flattens them.
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");

    const splitChars = (root: HTMLElement) => {
      if (root.dataset.split) return;
      let i = 0;
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          if (!text) return;
          const frag = document.createDocumentFragment();
          for (const ch of text) {
            const sp = document.createElement("span");
            sp.className = "ch";
            sp.style.transitionDelay = `${i * 0.018}s`;
            i++;
            sp.textContent = ch === " " ? " " : ch;
            frag.appendChild(sp);
          }
          node.parentNode?.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Snapshot children — replaceChild mutates the live list.
          [...node.childNodes].forEach(walk);
        }
      };
      [...root.childNodes].forEach(walk);
      root.dataset.split = "1";
    };

    document
      .querySelectorAll<HTMLElement>('[data-reveal="char"]')
      .forEach(splitChars);

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (ents) => {
        for (const e of ents) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return null;
}

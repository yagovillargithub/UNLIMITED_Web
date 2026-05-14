import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string({ required_error: "Este campo es necesario." })
    .trim()
    .min(2, "Su nombre, por favor.")
    .max(100),
  email: z
    .string({ required_error: "Este campo es necesario." })
    .trim()
    .email("Email no válido."),
  company: z
    .string({ required_error: "Este campo es necesario." })
    .trim()
    .min(2, "El nombre de la empresa, por favor.")
    .max(120),
  interest: z
    .array(z.string().min(1).max(60))
    .min(1, "Seleccione al menos una opción.")
    .max(7),
  message: z
    .string({ required_error: "Este campo es necesario." })
    .trim()
    .min(20, "Cuéntenos un poco más (mín. 20 caracteres).")
    .max(1000, "Máximo 1.000 caracteres."),
  timeline: z
    .enum(["asap", "this-month", "this-quarter", "exploring", ""])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  /** Honeypot — must stay empty. Real users never see this field. */
  website: z.string().max(0, "Bot detectado.").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const TIMELINE_LABELS: Record<NonNullable<ContactInput["timeline"]>, string> = {
  "asap": "Cuanto antes",
  "this-month": "Este mes",
  "this-quarter": "Este trimestre",
  "exploring": "Aún explorando",
};

/* ─────────────────────────────────────────────────────────────
 * Tweaks feedback — submitted from the floating Tweaks panel
 * when the user hits "Me gusta esta configuración".
 * Keeps the shape loose (we only validate types) because the
 * Tweaks schema evolves faster than this API.
 * ───────────────────────────────────────────────────────────── */
export const tweaksFeedbackSchema = z.object({
  name: z.string().trim().max(80).optional().default(""),
  note: z.string().trim().max(500).optional().default(""),
  state: z.record(z.union([z.string(), z.boolean(), z.number()])),
  url: z.string().trim().max(500).optional().default(""),
  /** Honeypot. */
  website: z.string().max(0, "Bot detectado.").optional().default(""),
});

export type TweaksFeedbackInput = z.infer<typeof tweaksFeedbackSchema>;

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
  budget: z
    .enum(["<10k", "10-30k", "30-80k", ">80k", "No definido", ""])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  /** Honeypot — must stay empty. Real users never see this field. */
  website: z.string().max(0, "Bot detectado.").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

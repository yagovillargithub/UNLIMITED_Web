"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { cn, waLink } from "@/lib/utils";

const INTERESTS = [
  { val: "Auditoría de IA", label: "Auditoría" },
  { val: "Agentes autónomos", label: "Agentes" },
  { val: "RAG", label: "RAG" },
  { val: "Automatización", label: "Automatización" },
  { val: "Copilot vertical", label: "Copilot" },
  { val: "Visión por computador", label: "Visión" },
  { val: "No estoy seguro", label: "No estoy seguro" },
];

const TIMELINES = [
  { val: "asap", label: "Cuanto antes" },
  { val: "this-month", label: "Este mes" },
  { val: "this-quarter", label: "Este trimestre" },
  { val: "exploring", label: "Aún explorando" },
] as const;

type Stage = "idle" | "submitting" | "success" | "error";

const WaIconSm = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M17.6 6.3a8 8 0 0 0-12.6 9.6L4 20l4.2-1.1a8 8 0 0 0 11.5-7.1 8 8 0 0 0-2.1-5.5Zm-5.6 12.3a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.5.7.7-2.4-.2-.3a6.6 6.6 0 1 1 5.6 3Zm3.6-5c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5.4 5.4 0 0 1-1.6-1 6 6 0 0 1-1.1-1.4c-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3l-.6-1.4c-.2-.4-.3-.3-.5-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5c0 .9.6 1.7.7 1.8.1.2 1.3 2 3.2 2.7l1 .4a3 3 0 0 0 1.4-.1c.4-.1 1.2-.5 1.4-1l.1-.9c0-.1-.1-.2-.3-.2Z" />
  </svg>
);

export function ContactForm() {
  const [stage, setStage] = useState<Stage>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [ref, setRef] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      interest: [],
      message: "",
      timeline: undefined,
      website: "",
    },
  });

  const watched = watch();

  // Progress bar — counts the 5 required fields with valid content.
  const progress = useMemo(() => {
    const filled = [
      (watched.name ?? "").trim().length >= 2,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((watched.email ?? "").trim()),
      (watched.company ?? "").trim().length >= 2,
      (watched.interest ?? []).length > 0,
      (watched.message ?? "").trim().length >= 20,
    ].filter(Boolean).length;
    return { n: filled, pct: (filled / 5) * 100 };
  }, [watched.name, watched.email, watched.company, watched.interest, watched.message]);

  const messageLen = (watched.message ?? "").length;

  const onSubmit = async (data: ContactInput) => {
    setStage("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: { ok?: boolean; ref?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setServerError(json.error ?? "No hemos podido enviar el mensaje. Inténtelo de nuevo.");
        setStage("error");
        return;
      }
      setRef(json.ref ?? "");
      setStage("success");
    } catch {
      setServerError("Problema de red. Inténtelo de nuevo en un momento.");
      setStage("error");
    }
  };

  if (stage === "success") {
    return (
      <div className="ct-success" id="ctSuccess">
        <div className="ct-success-mark">
          <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
            <circle cx="30" cy="30" r="29" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M18 31 l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="display" style={{ fontSize: "clamp(40px,5vw,72px)", margin: "24px 0 12px" }}>
          Mensaje enviado.
        </h2>
        <p className="lede">
          Hemos recibido su consulta. Le respondemos en menos de 24h laborables — normalmente antes.
        </p>
        {ref && (
          <p className="mono text-faint small" style={{ marginTop: 24 }}>
            Ref: <span>{ref}</span>
          </p>
        )}
        <a href="/" className="btn" style={{ marginTop: 32 }}>
          ← Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <form
      className="ct-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-reveal
      data-reveal-delay="2"
    >
      {/* Honeypot — visually hidden but real */}
      <div className="ct-honeypot" aria-hidden="true">
        <label htmlFor="ctWebsite">Website</label>
        <input
          id="ctWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="ct-progress">
        <div
          className="ct-progress-bar"
          style={{ ["--p" as string]: `${progress.pct}%` } as React.CSSProperties}
        />
        <div className="ct-progress-label mono">
          <span>{progress.n}</span>
          <span className="text-faint"> / 5 completos</span>
        </div>
      </div>

      <Field id="ctName" label="¿Cómo se llama?" num="01" error={touchedFields.name ? errors.name?.message : undefined}>
        <input id="ctName" type="text" autoComplete="name" required {...register("name")} />
      </Field>

      <Field id="ctEmail" label="Su email de trabajo" num="02" error={touchedFields.email ? errors.email?.message : undefined}>
        <input id="ctEmail" type="email" autoComplete="email" required {...register("email")} />
      </Field>

      <Field id="ctCompany" label="Empresa" num="03" error={touchedFields.company ? errors.company?.message : undefined}>
        <input id="ctCompany" type="text" autoComplete="organization" required {...register("company")} />
      </Field>

      <Controller
        control={control}
        name="interest"
        render={({ field }) => (
          <Field
            id="ctInterest"
            label="¿Qué le interesa más?"
            num="04"
            error={errors.interest?.message}
          >
            <div className="ct-chips" role="group" aria-label="Áreas de interés">
              {INTERESTS.map((it) => {
                const on = field.value.includes(it.val);
                return (
                  <button
                    key={it.val}
                    type="button"
                    className={cn("ct-chip", on && "active")}
                    aria-pressed={on}
                    onClick={() => {
                      const next = on
                        ? field.value.filter((v) => v !== it.val)
                        : [...field.value, it.val];
                      field.onChange(next);
                    }}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      />

      <Field
        id="ctMessage"
        label="Cuéntenos un poco más"
        num="05"
        error={touchedFields.message ? errors.message?.message : undefined}
      >
        <textarea
          id="ctMessage"
          rows={5}
          required
          maxLength={1000}
          placeholder="Procesos que le quitan tiempo, datos que tiene sin usar, ideas a medio cocinar..."
          {...register("message")}
        />
        <span className="ct-count mono">
          <span>{messageLen}</span> / 1.000 caracteres
        </span>
      </Field>

      <Controller
        control={control}
        name="timeline"
        render={({ field }) => (
          <div className="ct-field ct-field--radio">
            <label>
              <span className="mono">06</span> ¿Cuándo le gustaría ver algo funcionando?
            </label>
            <div className="ct-chips" role="radiogroup" aria-label="Plazo deseado">
              {TIMELINES.map((b) => {
                const on = field.value === b.val;
                return (
                  <button
                    key={b.val}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={cn("ct-chip", on && "active")}
                    onClick={() => field.onChange(on ? undefined : b.val)}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />

      <div className="ct-actions">
        <button
          type="submit"
          className="btn btn--accent"
          id="ctSubmit"
          disabled={stage === "submitting"}
        >
          {stage === "submitting" ? "Enviando…" : "Enviar mensaje"}
          {stage !== "submitting" && <span className="arrow">→</span>}
        </button>
        <a
          href={waLink("Hola UNLIMITED — vengo del formulario")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          <WaIconSm />
          Whatsapp
        </a>
      </div>

      {serverError && (
        <p role="alert" style={{ color: "#d4654a", fontFamily: "var(--f-mono)", fontSize: 12 }}>
          {serverError}
        </p>
      )}

      <p className="mono text-faint small ct-disclaimer">
        Al enviar acepta nuestra <a href="/privacidad">política de privacidad</a>. No spam, lo prometemos.
      </p>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  num: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, num, error, children }: FieldProps) {
  return (
    <div className={cn("ct-field", error && "has-error")}>
      <label htmlFor={id}>
        <span className="mono">{num}</span> {label}
      </label>
      {children}
      <span className="ct-err" role={error ? "alert" : undefined} data-for={id}>
        {error ?? ""}
      </span>
    </div>
  );
}

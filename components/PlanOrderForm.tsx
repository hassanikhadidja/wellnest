"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getPlanById, type ProgrammePlan } from "@/lib/programmes";

const inputClass =
  "w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30";

export function PlanOrderForm({ plan }: { plan: ProgrammePlan }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Merci d'indiquer votre nom et votre numéro de téléphone.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/email/plan-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          planId: plan.id,
          note: note.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        const raw = data?.error || res.statusText;
        const friendly =
          /self-signed|certificate|CERT|SSL|TLS/i.test(raw)
            ? "Envoi e-mail bloqué par un certificat SSL local (antivirus). Réessayez — la config a été corrigée."
            : raw || "Échec d'envoi. Réessayez.";
        setError(friendly);
        setSending(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Échec d'envoi. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-olive/25 bg-olive/5 p-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">Demande envoyée</h2>
        <p className="mt-2 text-[14px] text-muted">
          Merci {name.trim()}. Nous vous recontactons bientôt au {phone.trim()} pour la formule{" "}
          <strong className="text-ink">{plan.name}</strong>.
        </p>
        <button
          type="button"
          onClick={() => router.push("/programmes")}
          className="mt-6 rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white"
        >
          RETOUR AUX PROGRAMMES
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-olive/25 bg-gradient-to-br from-cream via-white to-olive/[0.06] p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-olive">
          Formule choisie
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{plan.name}</h2>
        <p className="mt-1 text-[14px] text-muted">{plan.duration}</p>
        <p className="mt-3 text-[1.5rem] font-bold text-olive">{plan.priceLabel}</p>
        {plan.perDayLabel ? (
          <p className="text-[12px] text-muted">{plan.perDayLabel}</p>
        ) : null}
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-[13px] text-ink/85">
              <span className="text-olive">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-2xl border border-sand/80 bg-white p-5 shadow-[0_4px_20px_rgba(44,42,38,0.05)]"
      >
        <h3 className="text-[16px] font-bold text-ink">Vos coordonnées</h3>
        <p className="mt-1 text-[12px] text-muted">
          Indiquez votre nom et numéro. Nous vous contactons pour finaliser la formule.
        </p>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">Nom</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">
            Numéro de téléphone / WhatsApp
          </span>
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="Ex. 0555 58 91 18"
            required
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">
            E-mail <span className="font-normal text-muted">(optionnel)</span>
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">
            Message <span className="font-normal text-muted">(optionnel)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </label>

        {error ? <p className="mt-3 text-[13px] font-medium text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={sending}
          className="mt-5 w-full rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white hover:bg-olive-dark disabled:opacity-60"
        >
          {sending ? "ENVOI…" : "ENVOYER MA DEMANDE"}
        </button>

        <Link
          href="/programmes"
          className="mt-3 block text-center text-[12px] font-medium text-muted hover:text-olive"
        >
          Retour aux programmes
        </Link>
      </form>
    </div>
  );
}

export function PlanOrderMissing({ planId }: { planId: string }) {
  const plan = getPlanById(planId);
  return (
    <div className="rounded-2xl border border-sand bg-cream/50 p-6 text-center">
      <h2 className="font-display text-2xl font-semibold text-ink">
        {plan?.isFree ? "Cette formule est gratuite" : "Formule introuvable"}
      </h2>
      <p className="mt-2 text-[13px] text-muted">
        {plan?.isFree
          ? "La journée type gratuite est disponible sur la page Programmes."
          : "Choisissez une formule Complete, Premium ou Suivi."}
      </p>
      <Link
        href="/programmes"
        className="mt-5 inline-flex rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white"
      >
        VOIR LES PROGRAMMES
      </Link>
    </div>
  );
}

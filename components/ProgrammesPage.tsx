"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { programmePlans, type ProgrammePlan } from "@/lib/programmes";
import { isQuestionnaireDone } from "@/lib/questionnaire";

function questionnaireHref(planId?: string) {
  const params = new URLSearchParams({ next: "/programmes" });
  if (planId) params.set("plan", planId);
  return `/questionnaire?${params.toString()}`;
}

export function ProgrammesPage({ initialPlan = null }: { initialPlan?: string | null }) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setDone(isQuestionnaireDone());
    if (initialPlan && programmePlans.some((p) => p.id === initialPlan)) {
      setSelectedId(initialPlan);
    }
    setReady(true);
  }, [initialPlan]);

  function handleChoose(plan: ProgrammePlan) {
    if (!done) return;
    setSelectedId(plan.id);
    if (plan.isFree) {
      setMessage(
        `Votre essai gratuit de ${plan.duration} est prêt. Votre plan sera adapté à vos réponses du questionnaire.`,
      );
      return;
    }
    setMessage(
      `Formule « ${plan.name} » sélectionnée — ${plan.priceLabel}. Le paiement sécurisé sera bientôt disponible.`,
    );
  }

  return (
    <div className="bg-white pb-12 pt-4">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
          <Link href="/" className="inline-flex items-center text-olive hover:underline" aria-label="Accueil">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M3.5 9.5L10 4L16.5 9.5V16.5H12V12H8V16.5H3.5V9.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="text-ink/30">›</span>
          <Link href="/" className="hover:text-olive">
            Accueil
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">Programmes</span>
        </nav>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[1.85rem] font-semibold leading-tight text-olive sm:text-4xl">
              Programmes personnalisés
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted sm:text-[14px]">
              Des plans nutritionnels adaptés à votre profil. Commencez par 3 jours gratuits, puis
              choisissez 1 semaine, 1 mois ou 3 mois.
            </p>
          </div>
          <div className="relative hidden h-16 w-16 shrink-0 sm:block" aria-hidden>
            <Image
              src="/images/features/programmes.png"
              alt=""
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </div>

        <div
          className={`mb-8 rounded-2xl border px-4 py-4 sm:px-5 ${
            ready && done ? "border-olive/25 bg-olive/5" : "border-sand bg-cream/70"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-bold text-ink">
                {ready && done
                  ? "Questionnaire complété — vous pouvez choisir un programme"
                  : "Étape obligatoire : questionnaire gratuit"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                {ready && done
                  ? "Votre plan sera personnalisé selon vos réponses."
                  : "Avant de choisir une formule, passez le test bien-être. C’est gratuit et cela permet d’adapter votre plan nutritionnel."}
              </p>
            </div>
            {(!ready || !done) && (
              <Link
                href={questionnaireHref()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
              >
                FAIRE LE TEST GRATUIT
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {programmePlans.map((plan) => {
            const selected = selectedId === plan.id;
            const locked = !ready || !done;

            return (
              <li
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-5 transition-colors ${
                  plan.highlight
                    ? "border-olive bg-olive/[0.03] shadow-[0_8px_28px_rgba(90,107,56,0.1)]"
                    : "border-sand/80 bg-white"
                } ${selected ? "ring-2 ring-olive/40" : ""}`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                      plan.isFree ? "bg-olive text-white" : "bg-ink text-white"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">{plan.name}</h2>
                    <p className="text-[12px] text-muted">{plan.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.35rem] font-bold text-olive">{plan.priceLabel}</p>
                    {plan.perDayLabel && (
                      <p className="text-[11px] text-muted">{plan.perDayLabel}</p>
                    )}
                  </div>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[12px] text-ink/85">
                      <span className="mt-0.5 text-olive" aria-hidden>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {locked ? (
                  <Link
                    href={questionnaireHref(plan.id)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-olive/30 bg-white px-4 py-3 text-[11px] font-bold tracking-[0.06em] text-olive transition-colors hover:border-olive hover:bg-cream"
                  >
                    QUESTIONNAIRE D&apos;ABORD
                    <span aria-hidden>→</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleChoose(plan)}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] font-bold tracking-[0.06em] transition-colors ${
                      plan.highlight || plan.isFree
                        ? "bg-olive text-white hover:bg-olive-dark"
                        : "border border-olive/35 text-olive hover:bg-cream"
                    }`}
                  >
                    {plan.isFree ? "COMMENCER L'ESSAI" : "CHOISIR CETTE FORMULE"}
                    <span aria-hidden>→</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {message && (
          <div
            className="mt-6 rounded-2xl border border-olive/25 bg-cream px-4 py-4 text-[13px] leading-relaxed text-ink"
            role="status"
          >
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

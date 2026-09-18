"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MealPlanTable } from "@/components/MealPlanTable";
import { NutritionTargetsSummary } from "@/components/NutritionTargetsSummary";
import {
  generateNutritionPackage,
  toClientNutritionPackage,
  PLAN_LOGIC_VERSION,
  type ClientNutritionPackage,
} from "@/lib/nutrition";
import { getClientNutritionPlan, saveClientNutritionPlan } from "@/lib/nutrition/client-storage";
import { programmePlans, type ProgrammePlan } from "@/lib/programmes";
import { getQuestionnaireAnswers, isQuestionnaireDone } from "@/lib/questionnaire";

function questionnaireHref(planId?: string) {
  const params = new URLSearchParams({ next: "/programmes" });
  if (planId) params.set("plan", planId);
  return `/questionnaire?${params.toString()}`;
}

function isStaleClientPlan(plan: ClientNutritionPackage | null) {
  if (!plan?.dayOne?.meals?.length) return true;
  if (plan.planLogicVersion !== PLAN_LOGIC_VERSION) return true;
  if (plan.dayOne.meals.some((meal) => !meal.lines?.length)) return true;
  if (
    plan.dayOne.meals.some(
      (meal) => meal.slot === "Petit-déjeuner" && !String(meal.recipeId).startsWith("BF-")
    )
  ) {
    return true;
  }
  return plan.shoppingDayOne.some(
    (item) =>
      item.category === "Recettes prévues" ||
      /légumes de saison|assida|baklawa/i.test(`${item.name} ${item.category}`)
  );
}

export function ProgrammesPage({ initialPlan = null }: { initialPlan?: string | null }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [dayPlan, setDayPlan] = useState<ClientNutritionPackage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const completed = isQuestionnaireDone();
    setDone(completed);
    if (completed) {
      let plan = getClientNutritionPlan();
      if (isStaleClientPlan(plan)) {
        const answers = getQuestionnaireAnswers();
        if (answers) {
          try {
            const pkg = generateNutritionPackage(answers);
            plan = toClientNutritionPackage(pkg);
            saveClientNutritionPlan(plan);
          } catch {
            plan = plan ?? null;
          }
        }
      }
      setDayPlan(plan);
    }
    if (initialPlan && programmePlans.some((p) => p.id === initialPlan)) {
      setSelectedId(initialPlan);
    }
    setReady(true);
  }, [initialPlan]);

  function handleChoose(plan: ProgrammePlan) {
    if (!done) return;
    setSelectedId(plan.id);

    if (plan.isFree) {
      document.getElementById("journee-type")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    router.push(`/programmes/commande?plan=${encodeURIComponent(plan.id)}`);
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
              Après le questionnaire, votre journée type gratuite s&apos;affiche ici. Choisissez
              ensuite Complete, Premium ou Suivi.
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
                  ? "Questionnaire complété — votre journée type est prête"
                  : "Étape obligatoire : questionnaire gratuit"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                {ready && done
                  ? "Repas, recettes et liste de courses pour 1 jour ci-dessous. Ensuite, choisissez une formule mensuelle."
                  : "Avant de choisir une formule, passez le test Nutri-Profil."}
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

        {ready && done && dayPlan && (
          <section id="journee-type" className="mb-10 scroll-mt-6">
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-olive">
                Gratuit — 1 jour
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                Votre journée type
              </h2>
              <NutritionTargetsSummary targets={dayPlan.targets} className="mt-2" />
            </div>
            <MealPlanTable
              title="JOURNÉE TYPE"
              days={[
                {
                  ...dayPlan.dayOne,
                  label: dayPlan.dayOne.label || "Jour 1",
                },
              ]}
              shopping={dayPlan.shoppingDayOne}
            />
            {dayPlan.targets.clinicalFlags.length > 0 ? (
              <ul className="mt-4 space-y-1 text-[12px] text-olive-dark">
                {dayPlan.targets.clinicalFlags.map((flag) => (
                  <li key={flag}>• {flag}</li>
                ))}
              </ul>
            ) : null}
          </section>
        )}

        {ready && done && !dayPlan && (
          <section className="mb-10 rounded-2xl border border-sand bg-cream/50 px-4 py-5 text-center">
            <p className="text-[14px] font-semibold text-ink">Plan du jour indisponible</p>
            <p className="mt-1 text-[12px] text-muted">
              Refaites le questionnaire pour générer vos repas et votre liste de courses.
            </p>
            <Link
              href={questionnaireHref()}
              className="mt-4 inline-flex rounded-full bg-olive px-5 py-3 text-[11px] font-bold tracking-[0.06em] text-white"
            >
              REFAIRE LE QUESTIONNAIRE
            </Link>
          </section>
        )}

        <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
          Choisissez votre formule
        </h2>

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
                    <h3 className="font-display text-2xl font-semibold text-ink">{plan.name}</h3>
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
                    {plan.isFree ? "VOIR LA JOURNÉE TYPE" : "CHOISIR CETTE FORMULE"}
                    <span aria-hidden>→</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

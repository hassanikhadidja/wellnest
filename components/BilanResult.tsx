"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getClientNutritionPlan,
} from "@/lib/nutrition/client-storage";
import type { ClientNutritionPackage } from "@/lib/nutrition";

export function BilanResult() {
  const [plan, setPlan] = useState<ClientNutritionPackage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlan(getClientNutritionPlan());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-16 text-center text-muted">
        Chargement de votre bilan…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Aucun bilan trouvé</h1>
        <p className="mt-3 text-[14px] text-muted">
          Complétez d&apos;abord le questionnaire Nutri-Profil pour recevoir votre journée type.
        </p>
        <Link
          href="/questionnaire"
          className="mt-6 inline-flex rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white"
        >
          FAIRE LE QUESTIONNAIRE
        </Link>
      </div>
    );
  }

  const { targets, dayOne, shoppingDayOne } = plan;

  return (
    <div className="bg-white pb-12 pt-4">
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-olive">
            Accueil
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">Bilan 1 jour</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-olive">
          Gratuit — après questionnaire
        </p>
        <h1 className="font-display mt-2 text-[1.85rem] font-semibold text-ink sm:text-4xl">
          Votre journée type
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Plan repas, recettes et liste de courses pour <strong>1 jour</strong>, adaptés à vos
          réponses. Les programmes Complete, Premium et Suivi débloquent le mois complet.
        </p>

        <section className="mt-6 rounded-2xl border border-sand/70 bg-cream/40 p-4 sm:p-5">
          <h2 className="text-[15px] font-bold text-ink">Cibles du jour</h2>
          <p className="mt-2 text-[13px] text-ink/80">
            Voie <span className="font-semibold">{targets.pathway}</span> · ~{targets.targetKcal}{" "}
            kcal · Protéines {targets.proteinG} g · Glucides {targets.carbsG} g · Lipides{" "}
            {targets.fatG} g
          </p>
          {targets.clinicalFlags.length > 0 ? (
            <ul className="mt-3 space-y-1 text-[12px] text-olive-dark">
              {targets.clinicalFlags.map((flag) => (
                <li key={flag}>• {flag}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="mt-5 space-y-3">
          <h2 className="text-[15px] font-bold text-ink">Repas & recettes</h2>
          {dayOne.meals.map((meal) => (
            <article
              key={`${meal.slot}-${meal.recipeId}`}
              className="rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-olive">
                {meal.slot}
              </p>
              <h3 className="mt-1 text-[16px] font-semibold text-ink">{meal.nameFr}</h3>
              {meal.nameAr ? (
                <p className="mt-0.5 text-[13px] text-muted" dir="rtl">
                  {meal.nameAr}
                </p>
              ) : null}
              <p className="mt-2 text-[13px] text-ink/80">
                Portion ~{meal.portionG} g · ~{meal.kcal} kcal · {meal.category}
              </p>
              {meal.alternatives.length > 0 ? (
                <p className="mt-2 text-[12px] text-muted">
                  Alternatives : {meal.alternatives.join(" · ")}
                </p>
              ) : null}
            </article>
          ))}
          <p className="text-[12px] text-muted">
            Total estimé ~{dayOne.totalKcal} kcal (cible {dayOne.targetKcal} kcal)
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-[15px] font-bold text-ink">Liste de courses (1 jour)</h2>
          <ul className="mt-3 divide-y divide-sand/60 rounded-2xl border border-sand/70 bg-white">
            {shoppingDayOne.map((item) => (
              <li
                key={`${item.category}-${item.name}`}
                className="flex items-start justify-between gap-3 px-4 py-3 text-[13px]"
              >
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-[11px] text-muted">{item.category}</p>
                </div>
                <span className="shrink-0 text-olive">{item.quantityLabel}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/programmes?result=1"
            className="inline-flex items-center justify-center rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white hover:bg-olive-dark"
          >
            VOIR LES FORMULES
          </Link>
          <Link
            href="/questionnaire"
            className="inline-flex items-center justify-center rounded-full border border-sand px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-ink/80"
          >
            REFAIRE LE QUESTIONNAIRE
          </Link>
        </div>
      </div>
    </div>
  );
}

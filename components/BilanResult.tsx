"use client";

import Link from "next/link";
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
import { getQuestionnaireAnswers } from "@/lib/questionnaire";

function isStalePlan(plan: ClientNutritionPackage | null) {
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

export function BilanResult() {
  const [plan, setPlan] = useState<ClientNutritionPackage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next = getClientNutritionPlan();
    if (isStalePlan(next)) {
      const answers = getQuestionnaireAnswers();
      if (answers) {
        try {
          const pkg = generateNutritionPackage(answers);
          next = toClientNutritionPackage(pkg);
          saveClientNutritionPlan(next);
        } catch {
          // keep whatever we had
        }
      }
    }
    setPlan(next);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-16 text-center text-muted">
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
      <div className="mx-auto max-w-[960px] px-4 sm:px-6">
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
        <NutritionTargetsSummary targets={targets} className="mt-2" />

        <div className="mt-6">
          <MealPlanTable
            title="JOURNÉE TYPE"
            days={[{ ...dayOne, label: dayOne.label || "Jour 1" }]}
            shopping={shoppingDayOne}
          />
        </div>

        {targets.clinicalFlags.length > 0 ? (
          <ul className="mt-4 space-y-1 text-[12px] text-olive-dark">
            {targets.clinicalFlags.map((flag) => (
              <li key={flag}>• {flag}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/programmes"
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

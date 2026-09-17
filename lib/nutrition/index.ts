import type { QuestionnaireAnswers } from "@/lib/questionnaire";
import { computeNutritionTargets } from "@/lib/nutrition/targets";
import {
  buildDayPlan,
  buildMultiDayPlans,
  buildShoppingList,
} from "@/lib/nutrition/plan-builder";
import type { NutritionPackage } from "@/lib/nutrition/types";

export function generateNutritionPackage(
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers
): NutritionPackage {
  const targets = computeNutritionTargets(answers);
  const seedKey = `${answers.email}-${answers.ageRange}-${answers.sex}-${answers.weightGoal}`;
  const dayOne = buildDayPlan(answers, targets, 1, seedKey);
  const plan30 = buildMultiDayPlans(answers, targets, 30, `${seedKey}-30`);
  const plan90 = buildMultiDayPlans(answers, targets, 90, `${seedKey}-90`);

  return {
    targets,
    dayOne,
    shoppingDayOne: buildShoppingList([dayOne]),
    plan30,
    plan90,
    shopping30: buildShoppingList(plan30),
    shopping90: buildShoppingList(plan90),
    generatedAt: new Date().toISOString(),
  };
}

/** Client-safe package without huge 90-day payload in localStorage */
export function toClientNutritionPackage(pkg: NutritionPackage) {
  return {
    targets: pkg.targets,
    dayOne: pkg.dayOne,
    shoppingDayOne: pkg.shoppingDayOne,
    generatedAt: pkg.generatedAt,
  };
}

export type ClientNutritionPackage = ReturnType<typeof toClientNutritionPackage>;

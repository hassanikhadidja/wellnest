import type { QuestionnaireAnswers } from "@/lib/questionnaire";
import { isFemaleSex, isMinorAge } from "@/lib/questionnaire";
import type { NutritionTargets } from "@/lib/nutrition/types";

const AGE_MIDPOINTS: Record<string, number> = {
  "under-3": 2,
  "3-6": 4.5,
  "7-12": 9.5,
  "13-17": 15,
  "18-24": 21,
  "25-34": 29.5,
  "35-44": 39.5,
  "45-54": 49.5,
  "55-plus": 60,
};

const DEFAULT_HEIGHT: Record<string, { f: number; m: number }> = {
  "under-3": { f: 86, m: 88 },
  "3-6": { f: 110, m: 112 },
  "7-12": { f: 140, m: 142 },
  "13-17": { f: 162, m: 170 },
  adult: { f: 162, m: 175 },
};

const DEFAULT_WEIGHT: Record<string, { f: number; m: number }> = {
  "under-3": { f: 12, m: 13 },
  "3-6": { f: 18, m: 19 },
  "7-12": { f: 35, m: 36 },
  "13-17": { f: 55, m: 60 },
  adult: { f: 65, m: 75 },
};

function parseMeasure(value: string, fallback: number) {
  if (!value || value === "unknown") return fallback;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function mapActivity(
  level: string
): NutritionTargets["activity"] {
  if (level === "tres-faible") return "inactive";
  if (level === "leger") return "low";
  if (level === "actif") return "active";
  if (level === "tres-actif" || level === "competition") return "very";
  return "low";
}

function adultEer(
  sex: "female" | "male",
  age: number,
  height: number,
  weight: number,
  activity: NutritionTargets["activity"]
) {
  if (sex === "male") {
    if (activity === "inactive")
      return 753.07 - 10.83 * age + 6.5 * height + 14.1 * weight;
    if (activity === "low")
      return 581.47 - 10.83 * age + 8.3 * height + 14.94 * weight;
    if (activity === "active")
      return 1004.82 - 10.83 * age + 6.52 * height + 15.91 * weight;
    return -517.88 - 10.83 * age + 15.61 * height + 19.11 * weight;
  }
  if (activity === "inactive")
    return 584.9 - 7.01 * age + 5.72 * height + 11.71 * weight;
  if (activity === "low")
    return 575.77 - 7.01 * age + 6.6 * height + 12.14 * weight;
  if (activity === "active")
    return 710.25 - 7.01 * age + 6.54 * height + 12.34 * weight;
  return 511.83 - 7.01 * age + 9.07 * height + 12.56 * weight;
}

/** Simplified pediatric estimate — growth-supportive, not adult deficit. */
function pediatricEer(
  sex: "female" | "male",
  age: number,
  height: number,
  weight: number,
  activity: NutritionTargets["activity"]
) {
  const base =
    sex === "male"
      ? 88.5 - 61.9 * age + 26.7 * weight + 903 * (height / 100) + (age < 9 ? 20 : 25)
      : 135.3 - 30.8 * age + 10 * weight + 934 * (height / 100) + (age < 9 ? 20 : 25);
  const factor =
    activity === "inactive" ? 1 : activity === "low" ? 1.13 : activity === "active" ? 1.26 : 1.42;
  return Math.max(1000, base * factor);
}

export function computeNutritionTargets(
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers
): NutritionTargets {
  const sex: "female" | "male" = isFemaleSex(answers.sex) ? "female" : "male";
  const ageYears = AGE_MIDPOINTS[answers.ageRange] ?? 30;
  const band = isMinorAge(answers.ageRange) ? answers.ageRange : "adult";
  const defaultsH = DEFAULT_HEIGHT[band] ?? DEFAULT_HEIGHT.adult;
  const defaultsW = DEFAULT_WEIGHT[band] ?? DEFAULT_WEIGHT.adult;
  const heightCm = parseMeasure(
    answers.heightCm,
    sex === "female" ? defaultsH.f : defaultsH.m
  );
  const weightKg = parseMeasure(
    answers.weightKg,
    sex === "female" ? defaultsW.f : defaultsW.m
  );
  const activity = mapActivity(answers.activityLevel);
  const clinicalFlags: string[] = [];
  const profileNotes: string[] = [];

  const women = answers.womenSituation ?? [];
  const pregnancy = answers.pregnancyDetail ?? [];
  const isPregnant =
    women.includes("grossesse") ||
    pregnancy.some((p) => p.startsWith("grossesse-")) ||
    answers.goals.includes("accompagner-grossesse");
  const isLactating =
    women.includes("allaitement") ||
    pregnancy.includes("allaitement-exclusif") ||
    pregnancy.includes("allaitement-mixte") ||
    answers.goals.includes("allaitement");
  const pediatric = isMinorAge(answers.ageRange);

  let pathway = "adulte";
  let goal: NutritionTargets["goal"] = "maintenance";
  let eerKcal = 0;

  if (pediatric) {
    pathway = ageYears < 3 ? "nourrisson/toddler" : ageYears < 14 ? "enfant" : "adolescent";
    eerKcal = pediatricEer(sex, ageYears, heightCm, weightKg, activity);
    goal = "growth";
    profileNotes.push("Voie pédiatrique : objectif de croissance, pas de déficit adulte.");
  } else if (isPregnant) {
    pathway = "grossesse";
    eerKcal = adultEer(sex, ageYears, heightCm, weightKg, activity);
    const trimester3 = pregnancy.includes("grossesse-t3");
    const trimester2 = pregnancy.includes("grossesse-t2");
    if (trimester2 || trimester3) eerKcal += trimester3 ? 450 : 340;
    goal = "pregnancy";
    profileNotes.push("Voie grossesse : densité nutritionnelle prioritaire.");
  } else if (isLactating) {
    pathway = "allaitement";
    eerKcal = adultEer(sex, ageYears, heightCm, weightKg, activity) + 400;
    goal = "lactation";
    profileNotes.push("Voie allaitement : +~400 kcal (modèle planification).");
  } else {
    pathway = "adulte";
    eerKcal = adultEer(sex, ageYears, heightCm, weightKg, activity);
    if (
      answers.weightGoal === "perdre" ||
      answers.goals.includes("perdre-poids")
    ) {
      goal = "loss";
    } else if (
      answers.weightGoal === "prendre" ||
      answers.goals.includes("prendre-poids")
    ) {
      goal = "gain";
    } else {
      goal = "maintenance";
    }
  }

  let targetKcal = eerKcal;
  if (goal === "loss") {
    targetKcal = Math.max(1400, eerKcal * 0.85);
    profileNotes.push("Ajustement perte de poids : déficit modéré (~15%).");
  } else if (goal === "gain") {
    targetKcal = eerKcal * 1.1;
    profileNotes.push("Ajustement prise de poids : surplus modéré (~10%).");
  } else if (goal === "maintenance" || goal === "growth") {
    targetKcal = eerKcal;
  }

  targetKcal = Math.round(targetKcal / 10) * 10;
  eerKcal = Math.round(eerKcal / 10) * 10;

  let proteinFactor = 1.0;
  if (goal === "loss") proteinFactor = 1.4;
  else if (goal === "gain") proteinFactor = 1.6;
  else if (goal === "pregnancy" || goal === "lactation") proteinFactor = 1.3;
  else if (goal === "growth") proteinFactor = 1.2;
  if (answers.activityLevel === "tres-actif" || answers.activityLevel === "competition") {
    proteinFactor = Math.max(proteinFactor, 1.6);
  }

  if ((answers.healthConditions ?? []).includes("digestifs")) {
    clinicalFlags.push("Troubles digestifs — prioriser repas simples et fibres adaptées.");
  }
  if ((answers.healthConditions ?? []).includes("diabete")) {
    clinicalFlags.push("Diabète / prédiabète — distribution des glucides à individualiser.");
  }
  if ((answers.healthConditions ?? []).includes("anemie")) {
    clinicalFlags.push("Anémie — favoriser sources de fer + vitamine C.");
  }
  if ((answers.allergies ?? []).some((a) => a !== "aucune")) {
    clinicalFlags.push("Allergies / évictions à respecter strictement.");
  }

  const proteinG = Math.round(weightKg * proteinFactor);
  const fatG = Math.round((targetKcal * 0.28) / 9);
  const carbsG = Math.max(
    80,
    Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4)
  );
  const fiberG = Math.round((targetKcal / 1000) * 14);
  const waterMl = Math.round(weightKg * 33);

  return {
    pathway,
    ageYears,
    sex,
    heightCm,
    weightKg,
    activity,
    goal,
    eerKcal,
    targetKcal,
    proteinG,
    fatG,
    carbsG,
    fiberG,
    waterMl,
    clinicalFlags,
    profileNotes,
  };
}

import { api } from "@/lib/api";

const STORAGE_KEY = "wellnest-questionnaire-done";
const ANSWERS_KEY = "wellnest-questionnaire-answers";

export type QuestionnaireAnswers = {
  beneficiary: string;
  ageRange: string;
  sex: string;
  name: string;
  email: string;
  phone?: string;
  guardianRole?: string;
  heightCm: string;
  weightKg: string;
  weightGoal: string;
  goals: string[];
  mealCount: string;
  breakfastHabit: string;
  cravingMoments: string[];
  fruitVegPlace: string;
  sweetProcessedFreq: string;
  foodRefusal: string[];
  dietMode: string;
  dietModeOther?: string;
  allergies: string[];
  allergyOther?: string;
  likedFoods: string[];
  culturalConstraint: string;
  culturalConstraintDetail?: string;
  digestion: string[];
  energyLevel: string;
  sleepState: string;
  activityLevel: string;
  cookingTime: string;
  mealPlace: string;
  healthConditions: string[];
  healthOther?: string;
  treatment: string;
  treatmentDetail?: string;
  womenSituation?: string[];
  periods?: string[];
  pregnancyDetail?: string[];
  childIssues?: string[];
  schoolInfluence?: string[];
  stressLevel: string;
  accompaniment: string[];
  freeNote?: string;
  completedAt: string;
};

export function isMinorAge(ageRange: string): boolean {
  return ["under-3", "3-6", "7-12", "13-17"].includes(ageRange);
}

export function isChildOrTeenProfile(
  beneficiary: string,
  ageRange: string
): boolean {
  return (
    beneficiary === "enfant" ||
    beneficiary === "fille-ado" ||
    isMinorAge(ageRange)
  );
}

export function isFemaleSex(sex: string): boolean {
  return sex === "fille-femme";
}

export function needsGuardianRole(
  beneficiary: string,
  ageRange: string
): boolean {
  return (
    beneficiary === "enfant" ||
    beneficiary === "fille-ado" ||
    isMinorAge(ageRange)
  );
}

export type ProfileContext = {
  beneficiary: string;
  ageRange: string;
  sex: string;
};

export function relevantAgeRangeIds(beneficiary: string): Set<string> | null {
  if (beneficiary === "enfant") {
    return new Set(["under-3", "3-6", "7-12", "13-17"]);
  }
  if (beneficiary === "fille-ado") {
    return new Set(["7-12", "13-17", "18-24"]);
  }
  // Moi-même / autre membre : toutes les tranches
  return null;
}

export function isTeenAge(ageRange: string): boolean {
  return ageRange === "13-17";
}

export function isAdultAge(ageRange: string): boolean {
  return !isMinorAge(ageRange) && ageRange !== "";
}

export function showWomenPart(ctx: ProfileContext): boolean {
  return isFemaleSex(ctx.sex);
}

export function showChildPart(ctx: ProfileContext): boolean {
  return isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
}

export function showMaternityGoals(ctx: ProfileContext): boolean {
  return isFemaleSex(ctx.sex) && isAdultAge(ctx.ageRange);
}

export function showPregnancyDetailQuestions(ctx: ProfileContext): boolean {
  return isFemaleSex(ctx.sex) && isAdultAge(ctx.ageRange);
}

/** Adult health conditions less relevant for young children */
export function showAdultHealthEmphasis(ctx: ProfileContext): boolean {
  return isAdultAge(ctx.ageRange) || isTeenAge(ctx.ageRange);
}

export function filterByIds<T extends { id: string }>(
  items: readonly T[],
  allowed: Set<string> | null
): T[] {
  if (!allowed) return [...items];
  return items.filter((item) => allowed.has(item.id));
}

export function relevantWeightGoalIds(ctx: ProfileContext): Set<string> {
  const child = isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
  if (child) {
    return new Set(["aucun", "croissance", "prendre", "stabiliser", "qualite", "perdre"]);
  }
  return new Set(["aucun", "prendre", "perdre", "stabiliser", "qualite"]);
}

export function relevantGoalIds(ctx: ProfileContext): Set<string> {
  const child = isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
  const maternity = showMaternityGoals(ctx);
  const ids = new Set([
    "mieux-manger",
    "energie",
    "concentration",
    "digestion",
    "sucre",
    "sommeil",
    "sport",
    "perdre-poids",
    "prendre-poids",
    "famille",
  ]);
  if (child) ids.add("croissance-enfant");
  if (maternity) {
    ids.add("preparer-grossesse");
    ids.add("accompagner-grossesse");
    ids.add("post-partum");
    ids.add("allaitement");
  }
  return ids;
}

export function relevantBreakfastIds(ctx: ProfileContext): Set<string> {
  const child = isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
  if (child) {
    return new Set(["oui", "parfois", "rarement", "selon-age"]);
  }
  return new Set(["oui", "parfois", "rarement"]);
}

export function relevantMealPlaceIds(ctx: ProfileContext): Set<string> {
  const child = isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
  if (child) {
    return new Set(["maison", "ecole", "exterieur", "mixte"]);
  }
  return new Set(["maison", "travail", "exterieur", "mixte"]);
}

export function relevantWomenSituationIds(ctx: ProfileContext): Set<string> {
  if (isMinorAge(ctx.ageRange)) {
    return new Set(["aucune", "adolescence", "non-concernee"]);
  }
  const ids = new Set([
    "aucune",
    "projet-grossesse",
    "grossesse",
    "post-partum",
    "allaitement",
    "non-concernee",
  ]);
  if (["45-54", "55-plus"].includes(ctx.ageRange)) {
    ids.add("menopause");
  }
  if (["18-24", "25-34"].includes(ctx.ageRange)) {
    // young adults may still relate to late adolescence wording less — keep maternity focus
  }
  return ids;
}

export function relevantAccompanimentIds(ctx: ProfileContext): Set<string> {
  const child = isChildOrTeenProfile(ctx.beneficiary, ctx.ageRange);
  const ids = new Set([
    "programme-individuel",
    "recettes-rapides",
    "idees-repas",
    "liste-courses",
    "batch-cooking",
    "suivi",
  ]);
  if (child || ctx.beneficiary === "famille") {
    ids.add("menus-famille");
    ids.add("conseils-enfant");
  } else {
    ids.add("menus-famille");
  }
  return ids;
}

export function relevantHealthConditionIds(ctx: ProfileContext): Set<string> {
  if (!showAdultHealthEmphasis(ctx) && isMinorAge(ctx.ageRange)) {
    return new Set(["aucune", "anemie", "allergies", "digestifs", "autre"]);
  }
  return new Set([
    "aucune",
    "anemie",
    "thyroide",
    "diabete",
    "cholesterol",
    "digestifs",
    "allergies",
    "autre",
  ]);
}

export function isQuestionnaireDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function deriveApiPayload(answers: Omit<QuestionnaireAnswers, "completedAt">) {
  const profile =
    answers.womenSituation?.find((s) =>
      ["grossesse", "allaitement", "post-partum", "projet-grossesse"].includes(s)
    ) ||
    answers.beneficiary ||
    answers.ageRange ||
    "bilan";

  const goal =
    answers.goals.length > 0
      ? answers.goals.slice(0, 3).join(", ")
      : answers.weightGoal || "bilan";

  const trimester =
    answers.pregnancyDetail?.find((d) => d.startsWith("grossesse-")) ||
    answers.pregnancyDetail?.find((d) => d.startsWith("allaitement-")) ||
    "";

  return {
    email: answers.email,
    profile,
    goal,
    trimester,
  };
}

export async function markQuestionnaireDone(
  answers?: Omit<QuestionnaireAnswers, "completedAt">
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
    if (answers) {
      const payload: QuestionnaireAnswers = {
        ...answers,
        completedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(payload));
      try {
        await api("/questionnaire", {
          method: "POST",
          auth: true,
          body: deriveApiPayload(answers),
        });
      } catch {
        // keep local completion even if API is unavailable
      }
    }
  } catch {
    // ignore quota / private mode
  }
}

export function getQuestionnaireAnswers(): QuestionnaireAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuestionnaireAnswers>;
    if (!parsed.beneficiary || !Array.isArray(parsed.goals)) {
      // Ignore legacy questionnaire payloads
      return null;
    }
    return parsed as QuestionnaireAnswers;
  } catch {
    return null;
  }
}

import type { QuestionnaireAnswers } from "@/lib/questionnaire";

export type ProgrammeTrackId =
  | "maman-bebe"
  | "energie-glycemie"
  | "confort-digestif"
  | "express-family";

export type ProgrammeTrack = {
  id: ProgrammeTrackId;
  name: string;
  profileLabel: string;
  description: string;
  focus: string[];
};

export const programmeTracks: ProgrammeTrack[] = [
  {
    id: "maman-bebe",
    name: "Programme Maman & Bébé",
    profileLabel: "Enceinte / Allaitement / Post-partum",
    description:
      "Axé sur la densité nutritionnelle, les micronutriments (fer, oméga-3, folate) et la récupération sans restriction calorique.",
    focus: [
      "Densité nutritionnelle",
      "Fer, oméga-3, folate",
      "Récupération sans restriction calorique",
    ],
  },
  {
    id: "energie-glycemie",
    name: "Programme Énergie & Glycémie",
    profileLabel: "Fatigue + Coup de barre + Fringales à 16h",
    description:
      "Axé sur la régulation du sucre sanguin, les petits-déjeuners protéinés et la recharge du système nerveux.",
    focus: [
      "Régulation du sucre sanguin",
      "Petits-déjeuners protéinés",
      "Recharge du système nerveux",
    ],
  },
  {
    id: "confort-digestif",
    name: "Programme Confort Digestif & Ventre Plat",
    profileLabel: "Ballonnements + Transit lent + Stress",
    description:
      "Axé sur la santé du microbiote, la réduction des aliments inflammatoires et la gestion du stress.",
    focus: [
      "Santé du microbiote",
      "Réduction des aliments inflammatoires",
      "Gestion du stress",
    ],
  },
  {
    id: "express-family",
    name: "Programme Express & Family-Friendly",
    profileLabel: "Manque de temps + Charge mentale élevée",
    description:
      "Menus simples, listes de courses prêtes et recettes en moins de 20 min.",
    focus: [
      "Menus simples",
      "Listes de courses prêtes",
      "Recettes en moins de 20 min",
    ],
  },
];

export type ProgrammeRecommendation = {
  track: ProgrammeTrack;
  score: number;
  matchedSignals: string[];
};

function scoreMamanBebe(answers: QuestionnaireAnswers): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (answers.situation === "enceinte") {
    score += 6;
    signals.push("Situation : enceinte");
  }
  if (answers.situation === "post-partum") {
    score += 6;
    signals.push("Situation : post-partum");
  }
  if (answers.situation === "projet-grossesse") {
    score += 4;
    signals.push("Projet de grossesse");
  }
  if (
    answers.maternityDetail === "enceinte-t1-t2" ||
    answers.maternityDetail === "enceinte-t3"
  ) {
    score += 4;
    signals.push("Grossesse précisée");
  }
  if (
    answers.maternityDetail === "allaitement-exclusif" ||
    answers.maternityDetail === "allaitement-mixte"
  ) {
    score += 5;
    signals.push("Allaitement");
  }
  if (answers.goals.includes("grossesse-allaitement")) {
    score += 4;
    signals.push("Objectif grossesse / allaitement");
  }

  return { score, signals };
}

function scoreEnergie(answers: QuestionnaireAnswers): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (answers.goals.includes("energie")) {
    score += 4;
    signals.push("Objectif énergie / fatigue");
  }
  if (answers.goals.includes("sucre")) {
    score += 4;
    signals.push("Objectif fringales / sucre");
  }
  if (answers.energyLevel === "coup-de-barre") {
    score += 5;
    signals.push("Coup de barre après le déjeuner ou vers 16h");
  }
  if (answers.energyLevel === "fatigue-reveil") {
    score += 4;
    signals.push("Fatigue dès le réveil");
  }
  if (answers.energyLevel === "montagnes-russes") {
    score += 4;
    signals.push("Énergie en montagnes russes");
  }
  if (answers.cravingMoment === "apres-midi") {
    score += 4;
    signals.push("Fringales en fin d'après-midi (16h-18h)");
  }
  if (answers.cravingMoment === "matinee" || answers.cravingMoment === "soir") {
    score += 2;
    signals.push("Envies de sucre / grignotage");
  }

  return { score, signals };
}

function scoreDigestif(answers: QuestionnaireAnswers): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (answers.digestion === "ballonnements") {
    score += 5;
    signals.push("Ballonnements fréquents");
  }
  if (answers.digestion === "transit-lent") {
    score += 5;
    signals.push("Transit lent ou irrégulier");
  }
  if (answers.digestion === "lourdeur") {
    score += 3;
    signals.push("Sensation de lourdeur digestive");
  }
  if (answers.goals.includes("digestion")) {
    score += 4;
    signals.push("Objectif ventre plat / digestion");
  }
  if (answers.stressLevel === "tres-eleve") {
    score += 3;
    signals.push("Stress très élevé");
  }
  if (answers.stressLevel === "modere") {
    score += 2;
    signals.push("Stress modéré");
  }

  return { score, signals };
}

function scoreExpress(answers: QuestionnaireAnswers): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (answers.cookingTime === "super-rapide") {
    score += 5;
    signals.push("Moins de 15-20 minutes pour cuisiner");
  }
  if (answers.stressLevel === "tres-eleve") {
    score += 4;
    signals.push("Charge mentale / stress élevé");
  }
  if (answers.goals.includes("famille")) {
    score += 4;
    signals.push("Objectif alimentation familiale simple");
  }
  if (answers.mealRhythm === "anarchique" || answers.mealRhythm === "saute-dejeuner") {
    score += 2;
    signals.push("Rythme de repas irrégulier");
  }

  return { score, signals };
}

const scorers: Record<
  ProgrammeTrackId,
  (answers: QuestionnaireAnswers) => { score: number; signals: string[] }
> = {
  "maman-bebe": scoreMamanBebe,
  "energie-glycemie": scoreEnergie,
  "confort-digestif": scoreDigestif,
  "express-family": scoreExpress,
};

/** Maternity situations take priority when clearly detected. */
function isMaternityPriority(answers: QuestionnaireAnswers, score: number) {
  const maternitySituation =
    answers.situation === "enceinte" ||
    answers.situation === "post-partum" ||
    answers.maternityDetail === "allaitement-exclusif" ||
    answers.maternityDetail === "allaitement-mixte" ||
    answers.maternityDetail === "enceinte-t1-t2" ||
    answers.maternityDetail === "enceinte-t3";
  return maternitySituation && score >= 4;
}

export function getProgrammeRecommendation(
  answers: QuestionnaireAnswers
): ProgrammeRecommendation {
  const scored = programmeTracks.map((track) => {
    const result = scorers[track.id](answers);
    return {
      track,
      score: result.score,
      matchedSignals: result.signals,
    };
  });

  const maman = scored.find((item) => item.track.id === "maman-bebe");
  if (maman && isMaternityPriority(answers, maman.score)) {
    return maman;
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best.score > 0) return best;

  // Fallback: balanced energy programme when signals are weak
  return {
    track: programmeTracks.find((track) => track.id === "energie-glycemie")!,
    score: 0,
    matchedSignals: ["Bilan global — programme polyvalent recommandé"],
  };
}

export function getTrackById(id: string) {
  return programmeTracks.find((track) => track.id === id);
}

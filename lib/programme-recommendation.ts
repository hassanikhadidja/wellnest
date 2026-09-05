import type { QuestionnaireAnswers } from "@/lib/questionnaire";
import { isChildOrTeenProfile, isFemaleSex } from "@/lib/questionnaire";

export type ProgrammeTrackId =
  | "enfant-croissance"
  | "adolescente"
  | "femme-active"
  | "maman-famille"
  | "grossesse-allaitement"
  | "energie-equilibre"
  | "confort-digestif"
  | "sport-performance"
  | "organisation-familiale";

export type ProgrammeTrack = {
  id: ProgrammeTrackId;
  name: string;
  profileLabel: string;
  description: string;
  focus: string[];
};

export const programmeTracks: ProgrammeTrack[] = [
  {
    id: "enfant-croissance",
    name: "Enfant & Croissance",
    profileLabel: "Enfant / croissance harmonieuse",
    description:
      "Accompagnement adapté à l'âge pour soutenir l'appétit, la diversité alimentaire et une croissance sereine.",
    focus: ["Croissance", "Diversité alimentaire", "Rythme scolaire"],
  },
  {
    id: "adolescente",
    name: "Adolescente",
    profileLabel: "Fille / adolescente",
    description:
      "Soutien nutritionnel pour l'énergie, la concentration, le cycle et les besoins spécifiques de l'adolescence.",
    focus: ["Énergie", "Concentration", "Besoins adolescents"],
  },
  {
    id: "femme-active",
    name: "Femme Active",
    profileLabel: "Femme active / équilibre global",
    description:
      "Programme polyvalent pour mieux manger au quotidien, soutenir l'énergie et le rythme de vie.",
    focus: ["Équilibre quotidien", "Énergie", "Organisation"],
  },
  {
    id: "maman-famille",
    name: "Maman & Famille",
    profileLabel: "Organisation familiale / post-partum",
    description:
      "Menus et conseils pour toute la famille, sans charge mentale inutile.",
    focus: ["Menus familiaux", "Charge mentale", "Repas partagés"],
  },
  {
    id: "grossesse-allaitement",
    name: "Grossesse & Allaitement",
    profileLabel: "Projet / grossesse / allaitement",
    description:
      "Densité nutritionnelle, micronutriments clés et accompagnement sans restriction inadaptée.",
    focus: ["Densité nutritionnelle", "Fer & oméga-3", "Récupération"],
  },
  {
    id: "energie-equilibre",
    name: "Énergie & Équilibre alimentaire",
    profileLabel: "Fatigue / sucre / équilibre",
    description:
      "Stabiliser l'énergie, limiter les coups de barre et les envies de sucre.",
    focus: ["Glycémie", "Énergie stable", "Envies de sucre"],
  },
  {
    id: "confort-digestif",
    name: "Confort Digestif",
    profileLabel: "Digestion / ballonnements / transit",
    description:
      "Approche progressive pour apaiser le transit et améliorer le confort digestif.",
    focus: ["Microbiote", "Confort digestif", "Rythme des repas"],
  },
  {
    id: "sport-performance",
    name: "Sport & Performance",
    profileLabel: "Activité sportive / performance",
    description:
      "Apports adaptés à l'entraînement, la récupération et le niveau d'activité.",
    focus: ["Récupération", "Apports adaptés", "Performance"],
  },
  {
    id: "organisation-familiale",
    name: "Organisation familiale",
    profileLabel: "Temps limité / batch cooking / famille",
    description:
      "Recettes rapides, listes de courses et organisation pour un quotidien plus fluide.",
    focus: ["Recettes rapides", "Listes de courses", "Batch cooking"],
  },
];

export type ProgrammeRecommendation = {
  track: ProgrammeTrack;
  score: number;
  matchedSignals: string[];
};

function hasAny(values: string[] | undefined, ids: string[]) {
  return (values ?? []).some((v) => ids.includes(v));
}

function scoreEnfant(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.beneficiary === "enfant" || ["under-3", "3-6", "7-12"].includes(answers.ageRange)) {
    score += 6;
    signals.push("Profil enfant");
  }
  if (answers.goals.includes("croissance-enfant") || answers.weightGoal === "croissance") {
    score += 4;
    signals.push("Objectif croissance");
  }
  if (hasAny(answers.childIssues, ["selectivite", "refus-legumes", "appetit-faible", "textures"])) {
    score += 3;
    signals.push("Enjeux alimentaires enfant");
  }
  return { score, signals };
}

function scoreAdolescente(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.beneficiary === "fille-ado" || answers.ageRange === "13-17") {
    score += 6;
    signals.push("Profil adolescente");
  }
  if (isFemaleSex(answers.sex) && hasAny(answers.womenSituation, ["adolescence"])) {
    score += 4;
    signals.push("Adolescence / puberté");
  }
  if (answers.goals.includes("concentration")) {
    score += 2;
    signals.push("Concentration / performances");
  }
  return { score, signals };
}

function scoreFemmeActive(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (isFemaleSex(answers.sex) && !isChildOrTeenProfile(answers.beneficiary, answers.ageRange)) {
    score += 2;
    signals.push("Profil femme");
  }
  if (answers.goals.includes("mieux-manger")) {
    score += 3;
    signals.push("Mieux manger au quotidien");
  }
  if (answers.beneficiary === "moi" && !hasAny(answers.womenSituation, ["grossesse", "allaitement", "post-partum", "projet-grossesse"])) {
    score += 2;
  }
  return { score, signals };
}

function scoreMamanFamille(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.goals.includes("famille") || answers.accompaniment.includes("menus-famille")) {
    score += 5;
    signals.push("Organisation familiale");
  }
  if (hasAny(answers.womenSituation, ["post-partum"])) {
    score += 3;
    signals.push("Post-partum");
  }
  if (answers.beneficiary === "enfant" || answers.beneficiary === "fille-ado" || answers.beneficiary === "famille") {
    score += 2;
    signals.push("Bilan pour un proche / enfant");
  }
  return { score, signals };
}

function scoreGrossesse(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (
    hasAny(answers.womenSituation, ["grossesse", "allaitement", "projet-grossesse", "post-partum"]) ||
    hasAny(answers.pregnancyDetail, [
      "grossesse-t1",
      "grossesse-t2",
      "grossesse-t3",
      "allaitement-exclusif",
      "allaitement-mixte",
    ]) ||
    hasAny(answers.goals, ["preparer-grossesse", "accompagner-grossesse", "allaitement", "post-partum"])
  ) {
    score += 8;
    signals.push("Grossesse / allaitement / maternité");
  }
  return { score, signals };
}

function scoreEnergie(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.goals.includes("energie") || answers.goals.includes("sucre")) {
    score += 4;
    signals.push("Objectif énergie / sucre");
  }
  if (["fatigue-matin", "fatigue-apres-midi", "fatigue-frequente", "variable"].includes(answers.energyLevel)) {
    score += 4;
    signals.push("Niveau d'énergie à soutenir");
  }
  if (hasAny(answers.cravingMoments, ["apres-midi", "soir", "stress-ennui"])) {
    score += 3;
    signals.push("Envies de grignotage");
  }
  return { score, signals };
}

function scoreDigestif(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.goals.includes("digestion")) {
    score += 4;
    signals.push("Objectif digestion");
  }
  if (
    hasAny(answers.digestion, ["ballonnements", "constipation", "diarrhee", "reflux", "douleurs"])
  ) {
    score += 5;
    signals.push("Inconfort digestif");
  }
  return { score, signals };
}

function scoreSport(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (answers.goals.includes("sport") || ["tres-actif", "competition"].includes(answers.activityLevel)) {
    score += 6;
    signals.push("Activité sportive");
  }
  if (answers.activityLevel === "actif") {
    score += 2;
    signals.push("Activité régulière");
  }
  return { score, signals };
}

function scoreOrganisation(answers: QuestionnaireAnswers) {
  let score = 0;
  const signals: string[] = [];
  if (
    ["moins-15", "15-30", "batch-cooking"].includes(answers.cookingTime) ||
    hasAny(answers.accompaniment, ["recettes-rapides", "liste-courses", "batch-cooking", "idees-repas"])
  ) {
    score += 4;
    signals.push("Besoin d'organisation / gain de temps");
  }
  if (["eleve", "tres-eleve"].includes(answers.stressLevel)) {
    score += 3;
    signals.push("Charge mentale élevée");
  }
  if (answers.mealCount === "variable") {
    score += 2;
    signals.push("Horaires de repas variables");
  }
  return { score, signals };
}

const scorers: Record<
  ProgrammeTrackId,
  (answers: QuestionnaireAnswers) => { score: number; signals: string[] }
> = {
  "enfant-croissance": scoreEnfant,
  adolescente: scoreAdolescente,
  "femme-active": scoreFemmeActive,
  "maman-famille": scoreMamanFamille,
  "grossesse-allaitement": scoreGrossesse,
  "energie-equilibre": scoreEnergie,
  "confort-digestif": scoreDigestif,
  "sport-performance": scoreSport,
  "organisation-familiale": scoreOrganisation,
};

function isPriorityTrack(answers: QuestionnaireAnswers, id: ProgrammeTrackId, score: number) {
  if (id === "grossesse-allaitement" && score >= 6) return true;
  if (id === "enfant-croissance" && score >= 6) return true;
  if (id === "adolescente" && score >= 6) return true;
  return false;
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

  const priorityOrder: ProgrammeTrackId[] = [
    "grossesse-allaitement",
    "enfant-croissance",
    "adolescente",
  ];
  for (const id of priorityOrder) {
    const item = scored.find((s) => s.track.id === id);
    if (item && isPriorityTrack(answers, id, item.score)) return item;
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best.score > 0) return best;

  return {
    track: programmeTracks.find((t) => t.id === "energie-equilibre")!,
    score: 0,
    matchedSignals: ["Bilan global — profil polyvalent recommandé"],
  };
}

export function getTrackById(id: string) {
  return programmeTracks.find((track) => track.id === id);
}

export type ProgrammePlan = {
  id: string;
  name: string;
  duration: string;
  priceDa: number;
  priceLabel: string;
  perDayLabel?: string;
  badge?: string;
  highlight?: boolean;
  isFree: boolean;
  features: string[];
};

export const programmePlans: ProgrammePlan[] = [
  {
    id: "essai-3j",
    name: "Essai",
    duration: "3 jours",
    priceDa: 0,
    priceLabel: "Gratuit",
    badge: "Test gratuit",
    isFree: true,
    features: [
      "Plan nutritionnel personnalisé",
      "Basé sur votre questionnaire",
      "Menus & conseils du jour",
      "Sans engagement",
    ],
  },
  {
    id: "semaine",
    name: "1 semaine",
    duration: "7 jours",
    priceDa: 1000,
    priceLabel: "1 000 DA",
    perDayLabel: "~143 DA / jour",
    isFree: false,
    features: [
      "Plan adapté à votre profil",
      "Menus quotidiens",
      "Liste de courses",
      "Suivi des objectifs",
    ],
  },
  {
    id: "mois",
    name: "1 mois",
    duration: "30 jours",
    priceDa: 2500,
    priceLabel: "2 500 DA",
    perDayLabel: "~83 DA / jour",
    badge: "Populaire",
    highlight: true,
    isFree: false,
    features: [
      "Programme complet personnalisé",
      "Menus + listes de courses",
      "Ajustements selon vos retours",
      "Articles & recettes associés",
    ],
  },
  {
    id: "trimestre",
    name: "3 mois",
    duration: "90 jours",
    priceDa: 8500,
    priceLabel: "8 500 DA",
    perDayLabel: "~94 DA / jour",
    badge: "Meilleure offre",
    isFree: false,
    features: [
      "Accompagnement longue durée",
      "Plans évolutifs par étape",
      "Listes & recettes incluses",
      "Priorité sur les mises à jour",
    ],
  },
];

export function getPlanById(id: string) {
  return programmePlans.find((plan) => plan.id === id);
}

export function formatDa(amount: number) {
  return `${amount.toLocaleString("fr-DZ")} DA`;
}

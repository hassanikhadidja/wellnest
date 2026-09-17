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
    id: "essai-1j",
    name: "Essai 1 jour",
    duration: "1 jour",
    priceDa: 0,
    priceLabel: "Gratuit",
    badge: "Après questionnaire",
    isFree: true,
    features: [
      "Plan repas d'une journée",
      "Recettes adaptées au profil",
      "Liste de courses du jour",
      "Sans engagement",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    duration: "1 mois",
    priceDa: 3900,
    priceLabel: "3 900 DA",
    perDayLabel: "~130 DA / jour",
    isFree: false,
    features: [
      "Questionnaire + plan 30 jours",
      "Quantités en grammes + calories",
      "Alternatives de repas",
      "Liste de courses",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    duration: "1 mois",
    priceDa: 5900,
    priceLabel: "5 900 DA",
    perDayLabel: "~197 DA / jour",
    badge: "Populaire",
    highlight: true,
    isFree: false,
    features: [
      "Tout Complete inclus",
      "Recettes détaillées",
      "Adaptation plus précise au profil",
      "Ajustements pendant le mois",
    ],
  },
  {
    id: "suivi",
    name: "Suivi",
    duration: "1 mois",
    priceDa: 8900,
    priceLabel: "8 900 DA",
    perDayLabel: "~297 DA / jour",
    badge: "Meilleure offre",
    isFree: false,
    features: [
      "Programme personnalisé",
      "Suivi personnel",
      "Ajustements hebdomadaires",
      "Accompagnement prioritaire",
    ],
  },
];

export function getPlanById(id: string) {
  return programmePlans.find((plan) => plan.id === id);
}

export function formatDa(amount: number) {
  return `${amount.toLocaleString("fr-DZ")} DA`;
}

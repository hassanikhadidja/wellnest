export type NutritionTargets = {
  pathway: string;
  ageYears: number;
  sex: "female" | "male";
  heightCm: number;
  weightKg: number;
  activity: "inactive" | "low" | "active" | "very";
  goal: "maintenance" | "loss" | "gain" | "growth" | "pregnancy" | "lactation";
  eerKcal: number;
  targetKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  fiberG: number;
  waterMl: number;
  clinicalFlags: string[];
  profileNotes: string[];
};

export type PlannedMeal = {
  slot: "Petit-déjeuner" | "Déjeuner" | "Dîner" | "Collation";
  recipeId: string;
  nameFr: string;
  nameAr?: string;
  category: string;
  portionG: number;
  kcal: number;
  alternatives: string[];
};

export type DayPlan = {
  dayIndex: number;
  label: string;
  targetKcal: number;
  meals: PlannedMeal[];
  totalKcal: number;
};

export type ShoppingItem = {
  name: string;
  category: string;
  quantityLabel: string;
};

export type NutritionPackage = {
  targets: NutritionTargets;
  dayOne: DayPlan;
  shoppingDayOne: ShoppingItem[];
  plan30: DayPlan[];
  plan90: DayPlan[];
  shopping30: ShoppingItem[];
  shopping90: ShoppingItem[];
  generatedAt: string;
};

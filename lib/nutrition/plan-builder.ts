import mealsData from "@/data/nutrition/meals.json";
import type { QuestionnaireAnswers } from "@/lib/questionnaire";
import type {
  DayPlan,
  PlannedMeal,
  NutritionTargets,
  ShoppingItem,
} from "@/lib/nutrition/types";

type MealRow = {
  id: string;
  category: string;
  nameFr: string;
  nameAr: string;
  mealSlot: string;
  sweetSavory: string;
  portionG: number;
  kcalServing: number;
  kcalPer100g: number;
};

const meals = mealsData as MealRow[];

const SLOT_SHARES: Record<PlannedMeal["slot"], number> = {
  "Petit-déjeuner": 0.25,
  Déjeuner: 0.35,
  Dîner: 0.3,
  Collation: 0.1,
};

const CATEGORY_STAPLES: Record<string, { name: string; category: string }[]> = {
  Couscous: [
    { name: "Semoule de couscous", category: "Féculents" },
    { name: "Légumes de saison", category: "Légumes" },
    { name: "Pois chiches", category: "Légumineuses" },
    { name: "Viande ou poulet", category: "Protéines" },
    { name: "Huile d'olive", category: "Épicerie" },
  ],
  "Traditional pasta": [
    { name: "Pâtes / rechta / couscous d'orge", category: "Féculents" },
    { name: "Légumes", category: "Légumes" },
    { name: "Sauce tomate", category: "Épicerie" },
  ],
  Soups: [
    { name: "Légumes pour soupe", category: "Légumes" },
    { name: "Vermicelle ou freekeh", category: "Féculents" },
    { name: "Viande pour bouillon", category: "Protéines" },
  ],
  Tajines: [
    { name: "Viande / poulet / poisson", category: "Protéines" },
    { name: "Légumes", category: "Légumes" },
    { name: "Épices (ras el hanout, curcuma)", category: "Épicerie" },
  ],
  "Vegetables & eggs": [
    { name: "Œufs", category: "Protéines" },
    { name: "Légumes frais", category: "Légumes" },
    { name: "Huile d'olive", category: "Épicerie" },
  ],
  "Meat & fish": [
    { name: "Viande ou poisson", category: "Protéines" },
    { name: "Herbes et citron", category: "Épicerie" },
    { name: "Accompagnement féculent", category: "Féculents" },
  ],
  "Breads & street food": [
    { name: "Farine / pain", category: "Féculents" },
    { name: "Garniture (légumes / protéine)", category: "Légumes" },
  ],
  "Regional/Saharan": [
    { name: "Dattes / fruits secs", category: "Fruits" },
    { name: "Céréales locales", category: "Féculents" },
    { name: "Légumes de saison", category: "Légumes" },
  ],
  "Sweet breakfast": [
    { name: "Lait ou alternative", category: "Produits laitiers" },
    { name: "Céréales / pain", category: "Féculents" },
    { name: "Fruits", category: "Fruits" },
    { name: "Miel ou confiture", category: "Épicerie" },
  ],
  "Traditional pastries": [
    { name: "Farine", category: "Féculents" },
    { name: "Beurre ou huile", category: "Épicerie" },
    { name: "Fruits secs", category: "Fruits" },
  ],
  "Home desserts": [
    { name: "Fruits", category: "Fruits" },
    { name: "Lait / yaourt", category: "Produits laitiers" },
    { name: "Sucre / miel", category: "Épicerie" },
  ],
  "WELLNEST adapted": [
    { name: "Protéine maigre", category: "Protéines" },
    { name: "Légumes", category: "Légumes" },
    { name: "Féculent complet", category: "Féculents" },
  ],
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h || 1;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function matchesSlot(meal: MealRow, slot: PlannedMeal["slot"]) {
  const s = meal.mealSlot.toLowerCase();
  if (slot === "Petit-déjeuner") return s.includes("breakfast");
  if (slot === "Collation") return s.includes("snack") || s.includes("dessert");
  return s.includes("lunch") || s.includes("dinner");
}

function isExcluded(
  meal: MealRow,
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers
) {
  const name = `${meal.nameFr} ${meal.category}`.toLowerCase();
  const allergies = answers.allergies ?? [];
  if (allergies.includes("lait") && /(lait|fromage|yaourt|crème)/i.test(name)) return true;
  if (allergies.includes("gluten") && /(blé|semoule|couscous|pain|gâteau|pâtisserie)/i.test(name))
    return true;
  if (allergies.includes("oeuf") && /(œuf|oeuf)/i.test(name)) return true;
  if (allergies.includes("fruits-coque") && /(amande|noix|pistachio|cacahuète)/i.test(name))
    return true;

  if (answers.dietMode === "vegetarien") {
    if (/(viande|agneau|bœuf|boeuf|mouton|kefta|merguez)/i.test(name)) return true;
  }

  if ((answers.foodRefusal ?? []).includes("legumes") && /légume|legume|salade/i.test(name)) {
    return true;
  }

  const budget = answers.foodBudget;
  if (budget === "moins-3000") {
    if (/(safran|fruits de mer|caviar|homard)/i.test(name)) return true;
  }

  return false;
}

function pickMeal(
  pool: MealRow[],
  targetKcal: number,
  rand: () => number,
  usedIds: Set<string>
): MealRow | null {
  if (pool.length === 0) return null;
  const scored = pool
    .map((meal) => {
      const diff = Math.abs(meal.kcalServing - targetKcal);
      const usedPenalty = usedIds.has(meal.id) ? 180 : 0;
      const noise = rand() * 40;
      return { meal, score: diff + usedPenalty + noise };
    })
    .sort((a, b) => a.score - b.score);
  return scored[0]?.meal ?? null;
}

function scaleMeal(
  meal: MealRow,
  slot: PlannedMeal["slot"],
  targetKcal: number,
  alternatives: string[]
): PlannedMeal {
  const baseKcal = meal.kcalServing || 1;
  const factor = Math.min(1.6, Math.max(0.55, targetKcal / baseKcal));
  const portionG = Math.round((meal.portionG || 250) * factor);
  const kcal = Math.round(baseKcal * factor);
  return {
    slot,
    recipeId: meal.id,
    nameFr: meal.nameFr,
    nameAr: meal.nameAr || undefined,
    category: meal.category,
    portionG,
    kcal,
    alternatives: alternatives.slice(0, 3),
  };
}

export function buildDayPlan(
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers,
  targets: NutritionTargets,
  dayIndex: number,
  seedKey: string
): DayPlan {
  const rand = mulberry32(hashSeed(`${seedKey}-${dayIndex}`));
  const eligible = meals.filter((m) => !isExcluded(m, answers));
  const used = new Set<string>();
  const slots = Object.keys(SLOT_SHARES) as PlannedMeal["slot"][];
  const planned: PlannedMeal[] = [];

  const withSnacks =
    answers.mealCount === "3-plus-collations" ||
    answers.breakfastHabit !== "rarement";

  for (const slot of slots) {
    if (slot === "Collation" && !withSnacks) continue;
    if (slot === "Petit-déjeuner" && answers.breakfastHabit === "rarement") continue;

    const share = SLOT_SHARES[slot];
    const slotTarget = Math.round(targets.targetKcal * share);
    const pool = eligible.filter((m) => matchesSlot(m, slot));
    const fallback = eligible.filter((m) =>
      slot === "Petit-déjeuner" || slot === "Collation"
        ? m.mealSlot.toLowerCase().includes("snack") ||
          m.mealSlot.toLowerCase().includes("breakfast")
        : true
    );
    const source = pool.length ? pool : fallback;
    const chosen = pickMeal(source, slotTarget, rand, used);
    if (!chosen) continue;
    used.add(chosen.id);
    const alts = source
      .filter((m) => m.id !== chosen.id && matchesSlot(m, slot))
      .sort(() => rand() - 0.5)
      .slice(0, 3)
      .map((m) => m.nameFr);
    planned.push(scaleMeal(chosen, slot, slotTarget, alts));
  }

  // If breakfast skipped, redistribute remaining calories lightly on lunch/dinner already scaled
  const totalKcal = planned.reduce((sum, m) => sum + m.kcal, 0);
  return {
    dayIndex,
    label: `Jour ${dayIndex}`,
    targetKcal: targets.targetKcal,
    meals: planned,
    totalKcal,
  };
}

export function buildMultiDayPlans(
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers,
  targets: NutritionTargets,
  days: number,
  seedKey: string
) {
  return Array.from({ length: days }, (_, i) =>
    buildDayPlan(answers, targets, i + 1, seedKey)
  );
}

function staplesForMeal(meal: PlannedMeal) {
  const mapped = CATEGORY_STAPLES[meal.category];
  if (mapped?.length) return mapped;
  return [
    { name: meal.nameFr, category: "Plats préparés / recettes" },
    { name: "Légumes de saison", category: "Légumes" },
    { name: "Féculent (pain, riz ou semoule)", category: "Féculents" },
  ];
}

export function buildShoppingList(days: DayPlan[], multiplier = 1): ShoppingItem[] {
  const map = new Map<string, { category: string; count: number; grams: number }>();

  for (const day of days) {
    for (const meal of day.meals) {
      for (const staple of staplesForMeal(meal)) {
        const key = staple.name.toLowerCase();
        const current = map.get(key) ?? {
          category: staple.category,
          count: 0,
          grams: 0,
        };
        current.count += 1;
        current.grams += Math.round(meal.portionG * 0.35 * multiplier);
        map.set(key, current);
      }
      // Always include the dish itself for clarity
      const dishKey = `plat:${meal.nameFr.toLowerCase()}`;
      const dish = map.get(dishKey) ?? {
        category: "Recettes prévues",
        count: 0,
        grams: 0,
      };
      dish.count += 1;
      dish.grams += meal.portionG * multiplier;
      map.set(dishKey, dish);
    }
  }

  const items: ShoppingItem[] = [];
  for (const [key, value] of map.entries()) {
    const name = key.startsWith("plat:")
      ? key.slice(5).replace(/^\w/, (c) => c.toUpperCase())
      : key.replace(/^\w/, (c) => c.toUpperCase());
    const quantityLabel =
      value.category === "Recettes prévues"
        ? `${value.count} portion(s) · ~${Math.round(value.grams)} g`
        : value.grams >= 1000
          ? `~${(value.grams / 1000).toFixed(1)} kg`
          : `~${Math.round(value.grams)} g`;
    items.push({
      name: key.startsWith("plat:") ? name : name,
      category: value.category,
      quantityLabel,
    });
  }

  const order = [
    "Légumes",
    "Fruits",
    "Protéines",
    "Légumineuses",
    "Féculents",
    "Produits laitiers",
    "Épicerie",
    "Recettes prévues",
    "Plats préparés / recettes",
  ];
  items.sort((a, b) => {
    const ai = order.indexOf(a.category);
    const bi = order.indexOf(b.category);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name, "fr");
  });
  return items;
}

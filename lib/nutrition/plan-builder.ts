import breakfastsData from "@/data/nutrition/breakfasts.json";
import mealsData from "@/data/nutrition/meals.json";
import type { QuestionnaireAnswers } from "@/lib/questionnaire";
import {
  budgetTierFromAnswers,
  pickProduct,
  resolveIngredientKey,
  type BudgetTier,
} from "@/lib/nutrition/algerian-market";
import type {
  DayPlan,
  MealLine,
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

type BreakfastRow = {
  id: string;
  nameFr: string;
  composition: string;
  portionG: number;
  kcalServing: number;
  lines: MealLine[];
};

const breakfasts = breakfastsData as BreakfastRow[];
const meals = mealsData as MealRow[];

const SLOT_SHARES: Record<PlannedMeal["slot"], number> = {
  "Petit-déjeuner": 0.25,
  Déjeuner: 0.35,
  Dîner: 0.28,
  Collation: 0.12,
};

const LUNCH_DINNER_CATEGORIES = new Set([
  "Soups",
  "Tajines",
  "Vegetables & eggs",
  "Meat & fish",
  "Traditional pasta",
  "Couscous",
  "WELLNEST adapted",
]);

const BLOCKED_NAME =
  /(baklawa|makroud|zlabia|griwech|basboussa|qalb el louz|chamia|briouates|tamina|assida|baghrir|msemmen|rfiss|dessert|gâteau|gateau|flan|mhalabia|riz au lait|aux dattes$|miel$)/i;

type MealWeight = "heavy" | "medium" | "light";

function mealWeight(meal: MealRow): MealWeight {
  // Starch-heavy plates first (even if name contains "légumes")
  if (
    meal.category === "Couscous" ||
    meal.category === "Traditional pasta" ||
    /chakhchoukha|rechta|tlitli|couscous|aïch|aich|mhamsa|dobara/i.test(meal.nameFr)
  ) {
    return "heavy";
  }
  if (meal.category === "Soups" || meal.category === "Vegetables & eggs") return "light";
  if (
    meal.category === "WELLNEST adapted" &&
    /légère|legere|salade|omelette|œufs|oeufs/i.test(meal.nameFr)
  ) {
    return "light";
  }
  if (meal.category === "Tajines" && /(agneau|pruneaux|coings)/i.test(meal.nameFr)) return "heavy";
  if (meal.category === "Tajines") return "medium";
  if (meal.category === "Meat & fish") return "medium";
  return "medium";
}

function starchFamily(meal: MealRow): "couscous" | "pasta" | "stew" | "other" {
  if (meal.category === "Couscous" || /couscous|aïch|aich|mhamsa/i.test(meal.nameFr)) return "couscous";
  if (
    meal.category === "Traditional pasta" ||
    /rechta|chakhchoukha|tlitli|pâtes|pates/i.test(meal.nameFr)
  ) {
    return "pasta";
  }
  if (meal.category === "Soups" || /chorba|soupe|lentille|dobara/i.test(meal.nameFr)) return "stew";
  return "other";
}

type RecipeBlueprint = {
  lines: { name: string; grams: number }[];
  shoppingHints: string[];
};

function recipeBlueprint(meal: MealRow, portionG: number): RecipeBlueprint {
  const scale = portionG / Math.max(meal.portionG || 300, 1);
  const g = (n: number) => Math.max(10, Math.round(n * scale));

  if (meal.category === "Soups") {
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: "Oignon + tomate + carotte", grams: g(120) },
        { name: meal.nameFr.toLowerCase().includes("lentille") ? "Lentilles" : "Frik / vermicelle", grams: g(40) },
        { name: /poulet|viande/i.test(meal.nameFr) ? "Poulet (petit morceau)" : "Pois chiches", grams: g(60) },
        { name: "Huile d'olive", grams: 8 },
      ],
      shoppingHints: ["onion", "tomato", "carrot", "oil", /lentille/i.test(meal.nameFr) ? "lentils" : "chickpeas", /poulet|viande/i.test(meal.nameFr) ? "chicken" : "chickpeas"],
    };
  }

  if (meal.category === "Couscous") {
    const isVeg = /végétarien|legume|légume|sept légumes/i.test(meal.nameFr);
    const protein = isVeg
      ? null
      : /poisson/i.test(meal.nameFr)
        ? "Poisson du marché (du jour)"
        : "Poulet";
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: "Semoule de couscous", grams: g(80) },
        ...(protein ? [{ name: protein, grams: g(100) }] : []),
        { name: "Carottes + courgettes", grams: g(150) },
        { name: "Pois chiches", grams: g(isVeg ? 90 : 40) },
        { name: "Huile d'olive", grams: 10 },
      ],
      shoppingHints: ["couscous", "carrot", "zucchini", "chickpeas", "oil", ...(protein ? ["chicken"] : [])],
    };
  }

  if (meal.category === "Tajines") {
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: /poulet/i.test(meal.nameFr) ? "Poulet" : "Viande (petite quantité) ou poulet", grams: g(120) },
        { name: "Pommes de terre / légumes du tajine", grams: g(150) },
        { name: "Oignon + tomate", grams: g(80) },
        { name: "Huile d'olive", grams: 10 },
        { name: "Pain (accompagnement)", grams: 60 },
      ],
      shoppingHints: ["chicken", "potato", "onion", "tomato", "oil", "bread"],
    };
  }

  if (meal.category === "Traditional pasta") {
    const name = meal.nameFr;
    const protein = /légume|legume|pois chiche|végétarien/i.test(name)
      ? null
      : /poulet/i.test(name)
        ? "Poulet"
        : "Viande (petite quantité)";

    // Rechta / Trida / sauce blanche : jamais de sauce tomate ni d'huile d'olive en ligne
    if (/rechta|trida|sauce blanche/i.test(name)) {
      const pastaName = /trida/i.test(name) ? "Trida" : "Rechta";
      return {
        lines: [
          { name: meal.nameFr, grams: portionG },
          { name: pastaName, grams: g(90) },
          ...(protein ? [{ name: protein, grams: g(100) }] : []),
          { name: "Navets", grams: g(120) },
          { name: "Pois chiches", grams: g(50) },
          { name: "Oignon", grams: g(40) },
        ],
        shoppingHints: [
          "pasta",
          ...(protein ? ["chicken"] : []),
          "turnip",
          "chickpeas",
          "onion",
        ],
      };
    }

    // Chakhchoukha : marqa rouge + rougag
    if (/chakhchoukha/i.test(name)) {
      return {
        lines: [
          { name: meal.nameFr, grams: portionG },
          { name: "Rougag / galette déchirée", grams: g(90) },
          ...(protein ? [{ name: protein, grams: g(100) }] : [{ name: "Pois chiches", grams: g(80) }]),
          { name: "Marqa tomate (concentré + eau)", grams: g(100) },
          { name: "Pois chiches", grams: g(40) },
          { name: "Oignon + carotte", grams: g(80) },
        ],
        shoppingHints: ["pasta", "chicken", "tomatoPaste", "chickpeas", "onion", "carrot"],
      };
    }

    // Tlitli : petites pâtes, souvent marqa tomate légère
    if (/tlitli/i.test(name)) {
      return {
        lines: [
          { name: meal.nameFr, grams: portionG },
          { name: "Tlitli", grams: g(90) },
          ...(protein ? [{ name: protein, grams: g(90) }] : []),
          { name: "Pois chiches", grams: g(50) },
          { name: "Carottes + courgettes", grams: g(100) },
          { name: "Concentré de tomate (petite quantité)", grams: g(25) },
        ],
        shoppingHints: [
          "pasta",
          ...(protein ? ["chicken"] : []),
          "chickpeas",
          "carrot",
          "zucchini",
          "tomatoPaste",
        ],
      };
    }

    // Mhamsa
    if (/mhamsa/i.test(name)) {
      return {
        lines: [
          { name: meal.nameFr, grams: portionG },
          { name: "Mhamsa", grams: g(90) },
          ...(protein ? [{ name: protein, grams: g(90) }] : []),
          { name: "Pois chiches", grams: g(60) },
          { name: "Légumes (carotte, courgette)", grams: g(100) },
          { name: "Oignon", grams: g(40) },
        ],
        shoppingHints: [
          "pasta",
          ...(protein ? ["chicken"] : []),
          "chickpeas",
          "carrot",
          "zucchini",
          "onion",
        ],
      };
    }

    // Aïch (blé / grain) — pas de lignes « pâtes / rechta »
    if (/aïch|aich/i.test(name)) {
      const white = /blanc/i.test(name);
      return {
        lines: [
          { name: meal.nameFr, grams: portionG },
          { name: "Aïch (blé / grain)", grams: g(90) },
          ...(protein ? [{ name: protein, grams: g(80) }] : []),
          { name: "Pois chiches", grams: g(60) },
          { name: white ? "Navets + oignon" : "Légumes (carotte, courgette, oignon)", grams: g(120) },
          ...(white ? [] : [{ name: "Concentré de tomate (petite quantité)", grams: g(20) }]),
        ],
        shoppingHints: [
          "couscous",
          ...(protein ? ["chicken"] : []),
          "chickpeas",
          "carrot",
          "onion",
          ...(white ? ["turnip"] : ["tomatoPaste", "zucchini"]),
        ],
      };
    }

    // Fallback pâtes traditionnelles
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: "Pâtes traditionnelles", grams: g(90) },
        ...(protein ? [{ name: protein, grams: g(90) }] : [{ name: "Pois chiches", grams: g(70) }]),
        { name: "Légumes du marché", grams: g(100) },
        { name: "Oignon", grams: g(40) },
      ],
      shoppingHints: ["pasta", ...(protein ? ["chicken"] : ["chickpeas"]), "carrot", "onion"],
    };
  }

  if (meal.category === "Vegetables & eggs") {
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: "Œufs", grams: 100 },
        { name: "Poivrons + tomates", grams: g(150) },
        { name: "Huile d'olive", grams: 10 },
        { name: "Pain complet", grams: 60 },
      ],
      shoppingHints: ["eggs", "pepper", "tomato", "oil", "bread"],
    };
  }

  if (meal.category === "Meat & fish") {
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: /sardine|poisson|thon/i.test(meal.nameFr) ? "Poisson / sardines" : "Poulet", grams: g(140) },
        { name: "Salade tomate-concombre", grams: g(120) },
        { name: "Pain", grams: 60 },
        { name: "Huile d'olive", grams: 8 },
      ],
      shoppingHints: [/sardine|poisson|thon/i.test(meal.nameFr) ? "tuna" : "chicken", "tomato", "cucumber", "bread", "oil"],
    };
  }

  // WELLNEST adapted / regional light plates — never invent pasta/couscous lines
  if (meal.category === "WELLNEST adapted" || /aïch|aich|dobara|mhamsa/i.test(meal.nameFr)) {
    return {
      lines: [
        { name: meal.nameFr, grams: portionG },
        { name: "Légumes (tomate, oignon, carotte)", grams: g(140) },
        {
          name: /pois chiche|lentille|légume|legume/i.test(meal.nameFr)
            ? "Pois chiches / légumes"
            : "Poulet (petite quantité)",
          grams: g(80),
        },
        { name: "Pain", grams: 50 },
        { name: "Huile d'olive", grams: 8 },
      ],
      shoppingHints: ["tomato", "onion", "carrot", "chickpeas", "bread", "oil"],
    };
  }

  return {
    lines: [
      { name: meal.nameFr, grams: portionG },
      { name: "Légumes du marché (tomate, oignon)", grams: g(120) },
      { name: "Pain", grams: 60 },
      { name: "Huile d'olive", grams: 8 },
    ],
    shoppingHints: ["tomato", "onion", "bread", "oil"],
  };
}

const SNACK_OPTIONS: { nameFr: string; lines: MealLine[]; kcal: number; portionG: number; shopping: string[] }[] = [
  {
    nameFr: "Yaourt nature + banane",
    lines: [
      { name: "Yaourt nature", quantity: "1 pot (125 g)" },
      { name: "Banane", quantity: "1 pièce (~100 g)" },
    ],
    kcal: 180,
    portionG: 225,
    shopping: ["yogurt", "banana"],
  },
  {
    nameFr: "Pomme + poignée de dattes",
    lines: [
      { name: "Pomme", quantity: "1 pièce (~150 g)" },
      { name: "Dattes Deglet Nour", quantity: "2–3 pièces (~30 g)" },
    ],
    kcal: 160,
    portionG: 180,
    shopping: ["apple", "dates"],
  },
  {
    nameFr: "Pain complet + fromage fondu",
    lines: [
      { name: "Pain complet", quantity: "40 g" },
      { name: "Fromage fondu", quantity: "1 triangle / 20 g" },
    ],
    kcal: 170,
    portionG: 60,
    shopping: ["bread", "cheese"],
  },
  {
    nameFr: "Orange + yaourt",
    lines: [
      { name: "Orange", quantity: "1 pièce" },
      { name: "Yaourt nature", quantity: "1 pot (125 g)" },
    ],
    kcal: 150,
    portionG: 250,
    shopping: ["orange", "yogurt"],
  },
];

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

function isSavoryMain(meal: MealRow) {
  if (!LUNCH_DINNER_CATEGORIES.has(meal.category)) return false;
  if (meal.sweetSavory?.toLowerCase() === "sweet") return false;
  if (BLOCKED_NAME.test(meal.nameFr)) return false;
  if (meal.category === "Couscous" && /datte|miel|sucré|sucre/i.test(meal.nameFr)) return false;
  return true;
}

function isExcludedMain(
  meal: MealRow,
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers,
  tier: BudgetTier
) {
  if (!isSavoryMain(meal)) return true;
  const name = meal.nameFr.toLowerCase();
  const allergies = answers.allergies ?? [];
  if (allergies.includes("lait") && /(fromage|lait|yaourt)/i.test(name)) return true;
  if (allergies.includes("gluten") && /(couscous|rechta|chakhchoukha|tlitli|pain|semoule)/i.test(name))
    return true;
  if (allergies.includes("oeuf") && /(œuf|oeuf|omelette|chakchouka)/i.test(name)) return true;
  if (answers.dietMode === "vegetarien" && /(viande|agneau|bœuf|boeuf|poulet|poisson|sardine|kefta|merguez)/i.test(name))
    return true;
  if (tier === "low" && /(agneau|pruneaux|safran|fruits de mer|coings)/i.test(name)) return true;
  return false;
}

function isExcludedBreakfast(
  bf: BreakfastRow,
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers,
  tier: BudgetTier
) {
  const text = `${bf.nameFr} ${bf.composition}`.toLowerCase();
  const allergies = answers.allergies ?? [];
  if (allergies.includes("lait") && /(lait|yaourt|fromage|ricotta)/i.test(text)) return true;
  if (allergies.includes("gluten") && /(pain|avoine|muesli|granola|crêpe|pancake|muffin|kesra)/i.test(text))
    return true;
  if (allergies.includes("oeuf") && /(œuf|oeuf)/i.test(text)) return true;
  if (allergies.includes("fruits-coque") && /(amande|noix|cacahuète|cacahuete|lin)/i.test(text))
    return true;
  if (tier === "low" && /(amande|granola|ricotta|fruits rouges|beurre d’amande|beurre d'amande|smoothie bowl)/i.test(text))
    return true;
  return false;
}

function pickFrom<T>(list: T[], rand: () => number, score: (item: T) => number): T | null {
  if (!list.length) return null;
  return [...list].sort((a, b) => score(a) - score(b) + (rand() - 0.5) * 30)[0] ?? null;
}

function localizeBreakfastLines(lines: MealLine[], tier: BudgetTier): MealLine[] {
  return lines.map((line) => {
    const key = resolveIngredientKey(line.name);
    if (!key) return line;
    const product = pickProduct(key, tier);
    // Keep original quantity, swap to clearer market name when useful
    if (/pain|avoine|lait|yaourt|fromage|céréales|muesli|granola|thon|huile|miel|banane|pomme|orange|datte/i.test(line.name)) {
      return {
        name: product.name.replace(/\s*\(.*\)\s*$/, "").replace(/ 1 L| x4| \(x4\)/gi, "").trim(),
        quantity: line.quantity,
      };
    }
    return line;
  });
}

function buildMainMeal(
  meal: MealRow,
  slot: PlannedMeal["slot"],
  targetKcal: number,
  alternatives: string[]
): PlannedMeal {
  const baseKcal = meal.kcalServing || 400;
  const factor = Math.min(1.35, Math.max(0.7, targetKcal / baseKcal));
  const portionG = Math.round((meal.portionG || 300) * factor);
  const kcal = Math.round(baseKcal * factor);
  const blueprint = recipeBlueprint(meal, portionG);
  return {
    slot,
    recipeId: meal.id,
    nameFr: meal.nameFr,
    nameAr: meal.nameAr || undefined,
    category: meal.category,
    portionG,
    kcal,
    alternatives: alternatives.slice(0, 2),
    lines: blueprint.lines.map((l) => ({
      name: l.name,
      quantity: `${l.grams} g`,
    })),
  };
}

export function buildDayPlan(
  answers: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers,
  targets: NutritionTargets,
  dayIndex: number,
  seedKey: string
): DayPlan {
  const rand = mulberry32(hashSeed(`${seedKey}-${dayIndex}`));
  const tier = budgetTierFromAnswers(answers.foodBudget || "non-precise");
  const planned: PlannedMeal[] = [];
  const usedIds = new Set<string>();

  const withBreakfast = answers.breakfastHabit !== "rarement";
  const withSnack =
    answers.mealCount === "3-plus-collations" ||
    answers.cravingMoments?.some((c) => c !== "peu") === true;

  if (withBreakfast) {
    const pool = breakfasts.filter((b) => !isExcludedBreakfast(b, answers, tier));
    const slotTarget = Math.round(targets.targetKcal * SLOT_SHARES["Petit-déjeuner"]);
    const chosen = pickFrom(pool.length ? pool : breakfasts, rand, (b) =>
      Math.abs(b.kcalServing - slotTarget)
    );
    if (chosen) {
      usedIds.add(chosen.id);
      const alts = pool
        .filter((b) => b.id !== chosen.id)
        .sort(() => rand() - 0.5)
        .slice(0, 2)
        .map((b) => b.nameFr);
      planned.push({
        slot: "Petit-déjeuner",
        recipeId: chosen.id,
        nameFr: chosen.nameFr,
        category: "Petit-déjeuner",
        portionG: chosen.portionG,
        kcal: chosen.kcalServing || slotTarget,
        alternatives: alts,
        lines: localizeBreakfastLines(
          chosen.lines.length
            ? chosen.lines
            : [{ name: chosen.nameFr, quantity: `${chosen.portionG} g` }],
          tier
        ),
      });
    }
  }

  const mains = meals.filter((m) => !isExcludedMain(m, answers, tier));
  const lunchTarget = Math.round(targets.targetKcal * SLOT_SHARES.Déjeuner);
  const dinnerTarget = Math.round(targets.targetKcal * SLOT_SHARES.Dîner);

  const lunchPool = mains.filter((m) => {
    // Lunch can be rich — prefer real cooked meals
    return mealWeight(m) !== "light" || m.category === "Vegetables & eggs";
  });
  const lunchSource = (lunchPool.length ? lunchPool : mains).filter((m) => !usedIds.has(m.id));
  const lunchMeal = pickFrom(lunchSource, rand, (m) => Math.abs(m.kcalServing - lunchTarget));

  if (lunchMeal) {
    usedIds.add(lunchMeal.id);
    const lunchAlts = lunchSource
      .filter((m) => m.id !== lunchMeal.id && mealWeight(m) === mealWeight(lunchMeal))
      .sort(() => rand() - 0.5)
      .slice(0, 2)
      .map((m) => m.nameFr);
    planned.push(buildMainMeal(lunchMeal, "Déjeuner", lunchTarget, lunchAlts));

    const lunchW = mealWeight(lunchMeal);
    const lunchStarch = starchFamily(lunchMeal);

    // Algerian pattern: often same pot for lunch + dinner, OR rich lunch + light dinner.
    // Never two different heavy starches (ex. pâtes midday + couscous evening).
    const samePot = lunchW === "heavy" || lunchW === "medium" ? rand() < 0.55 : rand() < 0.25;

    if (samePot) {
      const leftoverFactor = lunchW === "heavy" ? 0.55 : 0.65;
      const leftover = buildMainMeal(
        lunchMeal,
        "Dîner",
        Math.round(dinnerTarget * leftoverFactor),
        ["Reste du déjeuner (même plat)", "Salade tomate-concombre + pain"]
      );
      planned.push({
        ...leftover,
        nameFr: `${lunchMeal.nameFr} (reste / même plat)`,
        alternatives: ["Réchauffé du déjeuner", "Salade + pain + yaourt"],
        lines: leftover.lines.map((line, index) =>
          index === 0
            ? { name: `${lunchMeal.nameFr} (portion du soir)`, quantity: line.quantity }
            : line
        ),
      });
    } else {
      const lightPool = mains.filter((m) => {
        if (usedIds.has(m.id)) return false;
        if (mealWeight(m) !== "light") return false;
        // If lunch was pasta/couscous, dinner must not be another heavy starch family
        if (lunchStarch === "pasta" && starchFamily(m) === "couscous") return false;
        if (lunchStarch === "couscous" && starchFamily(m) === "pasta") return false;
        // Soup after pasta/couscous is OK; avoid a second stew-heavy if lunch was already chorba
        if (lunchStarch === "stew" && starchFamily(m) === "stew" && rand() < 0.7) return false;
        return true;
      });

      // Fallback light dinners if pool empty
      const dinnerMeal =
        pickFrom(lightPool, rand, (m) => Math.abs(m.kcalServing - dinnerTarget * 0.8)) ??
        pickFrom(
          mains.filter(
            (m) =>
              !usedIds.has(m.id) &&
              (m.category === "Soups" || m.category === "Vegetables & eggs") &&
              starchFamily(m) !== lunchStarch
          ),
          rand,
          (m) => Math.abs(m.kcalServing - dinnerTarget * 0.8)
        );

      if (dinnerMeal) {
        usedIds.add(dinnerMeal.id);
        // Cap dinner calories when lunch was already heavy
        const cappedTarget =
          lunchW === "heavy"
            ? Math.min(dinnerTarget, Math.round(targets.targetKcal * 0.2))
            : dinnerTarget;
        const dinnerAlts = lightPool
          .filter((m) => m.id !== dinnerMeal.id)
          .slice(0, 2)
          .map((m) => m.nameFr);
        planned.push(
          buildMainMeal(dinnerMeal, "Dîner", cappedTarget, [
            ...dinnerAlts,
            `Petite portion de ${lunchMeal.nameFr}`,
          ])
        );
      } else {
        // Ultimate fallback: light leftover-style dinner of lunch
        const leftover = buildMainMeal(lunchMeal, "Dîner", Math.round(dinnerTarget * 0.5), []);
        planned.push({
          ...leftover,
          nameFr: `${lunchMeal.nameFr} (petite portion du soir)`,
          alternatives: ["Chorba légère", "Œufs + salade + pain"],
        });
      }
    }
  }

  if (withSnack) {
    const snackPool =
      tier === "low"
        ? SNACK_OPTIONS.filter((s) => !/granola|amande/i.test(s.nameFr))
        : SNACK_OPTIONS;
    const snack = snackPool[Math.floor(rand() * snackPool.length)] ?? SNACK_OPTIONS[0];
    planned.push({
      slot: "Collation",
      recipeId: `SNACK-${dayIndex}`,
      nameFr: snack.nameFr,
      category: "Collation",
      portionG: snack.portionG,
      kcal: snack.kcal,
      alternatives: snackPool.filter((s) => s.nameFr !== snack.nameFr).slice(0, 2).map((s) => s.nameFr),
      lines: snack.lines,
    });
  }

  return {
    dayIndex,
    label: `Jour ${dayIndex}`,
    targetKcal: targets.targetKcal,
    meals: planned,
    totalKcal: planned.reduce((sum, m) => sum + m.kcal, 0),
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

export function buildShoppingList(
  days: DayPlan[],
  answers?: Omit<QuestionnaireAnswers, "completedAt"> | QuestionnaireAnswers
): ShoppingItem[] {
  const tier = budgetTierFromAnswers(answers?.foodBudget || "non-precise");
  const map = new Map<string, ShoppingItem>();

  function addHint(hint: string) {
    const key = hint as Parameters<typeof pickProduct>[0];
    try {
      const product = pickProduct(key, tier);
      if (!map.has(product.name)) {
        map.set(product.name, {
          name: product.name,
          category: product.category,
          quantityLabel: product.buyUnit,
        });
      }
    } catch {
      // ignore unknown
    }
  }

  for (const day of days) {
    for (const meal of day.meals) {
      for (const line of meal.lines) {
        const resolved = resolveIngredientKey(line.name);
        if (resolved) {
          addHint(resolved);
          continue;
        }
        // Specific leftover ingredients (keep concise, no recipe titles)
        if (/recette|portion|version/i.test(line.name)) continue;
        if (meal.nameFr === line.name) continue;
        const label = line.name.trim();
        if (label.length < 3) continue;
        if (!map.has(label)) {
          map.set(label, {
            name: label,
            category: "Frais / marché",
            quantityLabel: line.quantity.startsWith("~") ? line.quantity : `~${line.quantity}`,
          });
        }
      }

      // Category-based essentials for mains
      if (meal.slot === "Déjeuner" || meal.slot === "Dîner") {
        const mealRow = meals.find((m) => m.id === meal.recipeId);
        if (mealRow) {
          for (const hint of recipeBlueprint(mealRow, meal.portionG).shoppingHints) {
            addHint(hint);
          }
        }
      }
      if (meal.slot === "Collation") {
        const snack = SNACK_OPTIONS.find((s) => s.nameFr === meal.nameFr);
        snack?.shopping.forEach(addHint);
      }
      if (meal.slot === "Petit-déjeuner") {
        meal.lines.forEach((line) => {
          const key = resolveIngredientKey(line.name);
          if (key) addHint(key);
        });
      }
    }
  }

  // Always useful pantry baseline for cooking day
  addHint("onion");
  addHint("tomato");
  addHint("oil");

  const order = [
    "Légumes",
    "Fruits",
    "Protéines",
    "Légumineuses",
    "Féculents",
    "Produits laitiers",
    "Épicerie",
    "Frais / marché",
  ];

  return [...map.values()].sort(
    (a, b) =>
      (order.indexOf(a.category) === -1 ? 99 : order.indexOf(a.category)) -
        (order.indexOf(b.category) === -1 ? 99 : order.indexOf(b.category)) ||
      a.name.localeCompare(b.name, "fr")
  );
}

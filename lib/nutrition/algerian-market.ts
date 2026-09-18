/** Budget-aware Algerian market product labels */

export type BudgetTier = "low" | "mid" | "high";

export function budgetTierFromAnswers(foodBudget: string): BudgetTier {
  if (foodBudget === "moins-3000") return "low";
  if (foodBudget === "3000-6000" || foodBudget === "non-precise") return "mid";
  return "high";
}

type ProductPick = { name: string; buyUnit: string; category: string };

const PRODUCTS: Record<string, Record<BudgetTier, ProductPick>> = {
  milk: {
    low: { name: "Lait Candia / Soummam 1 L", buyUnit: "1 L", category: "Produits laitiers" },
    mid: { name: "Lait Soummam demi-écrémé 1 L", buyUnit: "1 L", category: "Produits laitiers" },
    high: { name: "Lait Candia / Danone 1 L", buyUnit: "1 L", category: "Produits laitiers" },
  },
  yogurt: {
    low: { name: "Yaourt nature Soummam (x4)", buyUnit: "1 pack", category: "Produits laitiers" },
    mid: { name: "Yaourt nature Soummam / Danone (x4)", buyUnit: "1 pack", category: "Produits laitiers" },
    high: { name: "Yaourt grec / enrichi (x4)", buyUnit: "1 pack", category: "Produits laitiers" },
  },
  cheese: {
    low: { name: "Fromage fondu La Vache qui rit / Kiri (portion)", buyUnit: "1 boîte", category: "Produits laitiers" },
    mid: { name: "Fromage frais / tartinable local", buyUnit: "1 pot 200 g", category: "Produits laitiers" },
    high: { name: "Fromage frais / ricotta", buyUnit: "1 pot", category: "Produits laitiers" },
  },
  bread: {
    low: { name: "Pain de mie / khobz complet (boulangerie)", buyUnit: "1 pain", category: "Féculents" },
    mid: { name: "Pain complet / matlouh (boulangerie)", buyUnit: "1 pain", category: "Féculents" },
    high: { name: "Pain complet / seigle (boulangerie)", buyUnit: "1 pain", category: "Féculents" },
  },
  oats: {
    low: { name: "Flocons d'avoine (marque locale / Eco)", buyUnit: "1 sachet 500 g", category: "Féculents" },
    mid: { name: "Avoine Nestlé / marque locale", buyUnit: "1 sachet 500 g", category: "Féculents" },
    high: { name: "Avoine / muesli complet", buyUnit: "1 sachet 500 g", category: "Féculents" },
  },
  cereal: {
    low: { name: "Céréales de blé (marque économique)", buyUnit: "1 boîte", category: "Féculents" },
    mid: { name: "Céréales Nestlé Fitness / Corn Flakes", buyUnit: "1 boîte", category: "Féculents" },
    high: { name: "Granola / céréales complètes", buyUnit: "1 boîte", category: "Féculents" },
  },
  couscous: {
    low: { name: "Semoule couscous Midou / Randa", buyUnit: "1 kg", category: "Féculents" },
    mid: { name: "Semoule couscous Midou", buyUnit: "1 kg", category: "Féculents" },
    high: { name: "Semoule couscous fine Midou", buyUnit: "1 kg", category: "Féculents" },
  },
  pasta: {
    low: { name: "Pâtes / rechta (marque locale)", buyUnit: "500 g", category: "Féculents" },
    mid: { name: "Pâtes Amor / local", buyUnit: "500 g", category: "Féculents" },
    high: { name: "Pâtes / rechta qualité", buyUnit: "500 g", category: "Féculents" },
  },
  rice: {
    low: { name: "Riz long (sac économique)", buyUnit: "1 kg", category: "Féculents" },
    mid: { name: "Riz basmati / long", buyUnit: "1 kg", category: "Féculents" },
    high: { name: "Riz basmati", buyUnit: "1 kg", category: "Féculents" },
  },
  eggs: {
    low: { name: "Œufs (plateau)", buyUnit: "6 œufs", category: "Protéines" },
    mid: { name: "Œufs (plateau)", buyUnit: "6 œufs", category: "Protéines" },
    high: { name: "Œufs fermiers si dispo", buyUnit: "6 œufs", category: "Protéines" },
  },
  chicken: {
    low: { name: "Poulet (cuisse / filet selon prix du jour)", buyUnit: "300–400 g", category: "Protéines" },
    mid: { name: "Poulet entier ou filet", buyUnit: "400 g", category: "Protéines" },
    high: { name: "Filet de poulet", buyUnit: "400 g", category: "Protéines" },
  },
  tuna: {
    low: { name: "Thon en boîte (marque locale / El Manar)", buyUnit: "1–2 boîtes", category: "Protéines" },
    mid: { name: "Thon en boîte à l'huile / naturel", buyUnit: "1–2 boîtes", category: "Protéines" },
    high: { name: "Thon en boîte qualité", buyUnit: "2 boîtes", category: "Protéines" },
  },
  oil: {
    low: { name: "Huile de table / mélange (usage cuisine)", buyUnit: "petite bouteille", category: "Épicerie" },
    mid: { name: "Huile d'olive algérienne (Chemlal / locale)", buyUnit: "250–500 ml", category: "Épicerie" },
    high: { name: "Huile d'olive extra-vierge locale", buyUnit: "500 ml", category: "Épicerie" },
  },
  tomato: {
    low: { name: "Tomates fraîches (marché)", buyUnit: "300 g", category: "Légumes" },
    mid: { name: "Tomates fraîches", buyUnit: "400 g", category: "Légumes" },
    high: { name: "Tomates fraîches", buyUnit: "500 g", category: "Légumes" },
  },
  onion: {
    low: { name: "Oignons", buyUnit: "250 g", category: "Légumes" },
    mid: { name: "Oignons", buyUnit: "300 g", category: "Légumes" },
    high: { name: "Oignons", buyUnit: "300 g", category: "Légumes" },
  },
  potato: {
    low: { name: "Pommes de terre", buyUnit: "500 g", category: "Légumes" },
    mid: { name: "Pommes de terre", buyUnit: "500 g", category: "Légumes" },
    high: { name: "Pommes de terre", buyUnit: "500 g", category: "Légumes" },
  },
  carrot: {
    low: { name: "Carottes", buyUnit: "300 g", category: "Légumes" },
    mid: { name: "Carottes", buyUnit: "400 g", category: "Légumes" },
    high: { name: "Carottes", buyUnit: "400 g", category: "Légumes" },
  },
  zucchini: {
    low: { name: "Courgettes", buyUnit: "300 g", category: "Légumes" },
    mid: { name: "Courgettes", buyUnit: "350 g", category: "Légumes" },
    high: { name: "Courgettes", buyUnit: "400 g", category: "Légumes" },
  },
  turnip: {
    low: { name: "Navets (marché)", buyUnit: "300–400 g", category: "Légumes" },
    mid: { name: "Navets", buyUnit: "400 g", category: "Légumes" },
    high: { name: "Navets", buyUnit: "500 g", category: "Légumes" },
  },
  pepper: {
    low: { name: "Poivrons", buyUnit: "200 g", category: "Légumes" },
    mid: { name: "Poivrons", buyUnit: "250 g", category: "Légumes" },
    high: { name: "Poivrons", buyUnit: "300 g", category: "Légumes" },
  },
  cucumber: {
    low: { name: "Concombre", buyUnit: "1 pièce", category: "Légumes" },
    mid: { name: "Concombre", buyUnit: "1 pièce", category: "Légumes" },
    high: { name: "Concombre", buyUnit: "1–2 pièces", category: "Légumes" },
  },
  chickpeas: {
    low: { name: "Pois chiches secs ou conserve", buyUnit: "200 g / 1 boîte", category: "Légumineuses" },
    mid: { name: "Pois chiches", buyUnit: "250 g", category: "Légumineuses" },
    high: { name: "Pois chiches", buyUnit: "250 g", category: "Légumineuses" },
  },
  lentils: {
    low: { name: "Lentilles sèches", buyUnit: "250 g", category: "Légumineuses" },
    mid: { name: "Lentilles", buyUnit: "250 g", category: "Légumineuses" },
    high: { name: "Lentilles", buyUnit: "250 g", category: "Légumineuses" },
  },
  banana: {
    low: { name: "Bananes", buyUnit: "2–3 pièces", category: "Fruits" },
    mid: { name: "Bananes", buyUnit: "3 pièces", category: "Fruits" },
    high: { name: "Bananes", buyUnit: "3–4 pièces", category: "Fruits" },
  },
  apple: {
    low: { name: "Pommes (marché)", buyUnit: "2 pièces", category: "Fruits" },
    mid: { name: "Pommes", buyUnit: "2–3 pièces", category: "Fruits" },
    high: { name: "Pommes", buyUnit: "3 pièces", category: "Fruits" },
  },
  orange: {
    low: { name: "Oranges / clémentines (saison)", buyUnit: "2–3 pièces", category: "Fruits" },
    mid: { name: "Oranges", buyUnit: "3 pièces", category: "Fruits" },
    high: { name: "Oranges", buyUnit: "3–4 pièces", category: "Fruits" },
  },
  dates: {
    low: { name: "Dattes Deglet Nour (petite quantité)", buyUnit: "100 g", category: "Fruits" },
    mid: { name: "Dattes Deglet Nour", buyUnit: "150 g", category: "Fruits" },
    high: { name: "Dattes Deglet Nour", buyUnit: "200 g", category: "Fruits" },
  },
  honey: {
    low: { name: "Miel local (petit pot) ou confiture", buyUnit: "1 petit pot", category: "Épicerie" },
    mid: { name: "Miel / confiture locale", buyUnit: "1 pot", category: "Épicerie" },
    high: { name: "Miel de montagne / local", buyUnit: "1 pot", category: "Épicerie" },
  },
  tomatoPaste: {
    low: { name: "Double concentré de tomate (boîte)", buyUnit: "1 boîte", category: "Épicerie" },
    mid: { name: "Double concentré de tomate", buyUnit: "1 boîte", category: "Épicerie" },
    high: { name: "Double concentré de tomate", buyUnit: "1 boîte", category: "Épicerie" },
  },
};

export function pickProduct(key: keyof typeof PRODUCTS, tier: BudgetTier): ProductPick {
  return PRODUCTS[key][tier];
}

/** Map free-text ingredient names to market product keys */
export function resolveIngredientKey(rawName: string): keyof typeof PRODUCTS | null {
  const n = rawName.toLowerCase();
  if (/lait/.test(n)) return "milk";
  if (/yaourt|yogurt/.test(n)) return "yogurt";
  if (/fromage|ricotta/.test(n)) return "cheese";
  if (/pain|kesra|matlouh|toast|tartine|seigle/.test(n)) return "bread";
  if (/avoine|porridge|flocons/.test(n)) return "oats";
  if (/muesli|granola|céréales|cereales/.test(n)) return "cereal";
  if (/semoule|couscous/.test(n)) return "couscous";
  if (/pâtes|pates|rechta|tlitli|chakhchoukha/.test(n)) return "pasta";
  if (/riz/.test(n)) return "rice";
  if (/œuf|oeuf/.test(n)) return "eggs";
  if (/poulet|chicken/.test(n)) return "chicken";
  if (/thon/.test(n)) return "tuna";
  if (/huile|olive/.test(n)) return "oil";
  if (/tomate/.test(n) && !/concentré|concentre|sauce/.test(n)) return "tomato";
  if (/concentré|concentre/.test(n)) return "tomatoPaste";
  if (/oignon/.test(n)) return "onion";
  if (/pomme de terre|patate/.test(n)) return "potato";
  if (/carotte/.test(n)) return "carrot";
  if (/courgette/.test(n)) return "zucchini";
  if (/navet/.test(n)) return "turnip";
  if (/poivron/.test(n)) return "pepper";
  if (/rougag|galette|aïch|aich|mhamsa|trida/.test(n)) return "pasta";
  if (/marqa|concentré de tomate|concentre de tomate|sauce tomate/.test(n)) return "tomatoPaste";
  if (/concombre/.test(n)) return "cucumber";
  if (/pois chiche/.test(n)) return "chickpeas";
  if (/lentille/.test(n)) return "lentils";
  if (/banane/.test(n)) return "banana";
  if (/pomme(?! de terre)/.test(n) || /poire/.test(n)) return "apple";
  if (/orange|clémentine|clementine/.test(n)) return "orange";
  if (/datte/.test(n)) return "dates";
  if (/miel|confiture/.test(n)) return "honey";
  if (/fruit/.test(n)) return "banana";
  return null;
}

import type { ContentLanguage } from "@/lib/content-language";

export type ProductType = "ebook" | "recipe" | "grocery";
export type Pricing = "free" | "paid";

export type SortFilter =
  | "recent"
  | "recipe-free"
  | "recipe-paid"
  | "grocery-free"
  | "grocery-paid"
  | "ebook";

export const sortFilters: { id: SortFilter; label: string }[] = [
  { id: "recent", label: "Plus récentes" },
  { id: "recipe-free", label: "Recettes gratuites" },
  { id: "recipe-paid", label: "Recettes payantes" },
  { id: "grocery-free", label: "Liste de courses gratuite" },
  { id: "grocery-paid", label: "Liste de courses payante" },
  { id: "ebook", label: "Guides Pratiques" },
];

export type Ebook = {
  id: string;
  /** Defaults to French when omitted on legacy static entries */
  language?: ContentLanguage;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  pages: string;
  date: string;
  image: string;
  delivery: string;
  author: {
    name: string;
    role: string;
  };
  highlights: string[];
  introduction: string;
  contents: string[];
  tip: string;
  productType: ProductType;
  pricing: Pricing;
  featured?: boolean;
  label?: string;
  /** Homepage Recettes Healthy cards */
  isRecipe?: boolean;
  meta?: string;
  badge?: string;
  cardAuthor?: string;
};

export const ebookCategories = [
  "Tous",
  "Nutrition Maman",
  "Bébé & Enfant",
  "Santé Globale",
  "Bien-être",
  "Recettes",
  "Guides Pratiques",
] as const;

export const ebooks: Ebook[] = [
  {
    id: "featured",
    category: "Nutrition Maman",
    title: "Le guide complet de l'alimentation pendant la grossesse",
    subtitle: "Toutes les clés pour bien manger, nourrir votre bébé et prendre soin de vous.",
    description: "Toutes les clés pour bien manger, nourrir votre bébé et prendre soin de vous.",
    pages: "45 pages",
    date: "Juin 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    productType: "ebook",
    pricing: "paid",
    featured: true,
    label: "E-BOOK À LA UNE",
    highlights: [
      "Menus adaptés à chaque trimestre",
      "Listes de courses prêtes à utiliser",
      "Conseils pour nausées et fringales",
      "Recettes simples et nutritives",
    ],
    introduction:
      "Ce guide vous accompagne tout au long de la grossesse avec des conseils concrets, des idées de repas et des repères nutritionnels clairs pour vous et votre bébé.",
    contents: [
      "Les besoins nutritionnels par trimestre",
      "Aliments à privilégier et à limiter",
      "Plans de repas hebdomadaires",
      "Recettes express et listes de courses",
      "FAQ grossesse et alimentation",
    ],
    tip: "Téléchargez le guide et gardez-le à portée de main pour vos courses et vos repas de la semaine.",
  },
  {
    id: "1",
    category: "Bébé & Enfant",
    title: "Diversification alimentaire de 0 à 2 ans",
    subtitle: "Un accompagnement étape par étape pour les premières cuillères.",
    description: "Un accompagnement étape par étape pour les premières cuillères.",
    pages: "32 pages",
    date: "Mai 2024",
    image: "/images/article-2.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    productType: "ebook",
    pricing: "paid",
    highlights: [
      "Calendrier de diversification",
      "Textures adaptées à chaque âge",
      "Idées de repas et collations",
      "Conseils pour les refus alimentaires",
    ],
    introduction:
      "Ce e-book vous aide à démarrer la diversification en douceur, avec des repères simples et rassurants pour chaque étape de 0 à 2 ans.",
    contents: [
      "Quand et comment commencer",
      "Premiers aliments recommandés",
      "Progression des textures",
      "Exemples de journées types",
      "Erreurs fréquentes à éviter",
    ],
    tip: "Avancez au rythme de votre bébé et observez ses signes d’appétit et de satiété.",
  },
  {
    id: "2",
    category: "Nutrition Maman",
    title: "Repas sains et équilibrés pour toute la famille",
    subtitle: "Des assiettes simples qui plaisent aux enfants comme aux adultes.",
    description: "Des assiettes simples qui plaisent aux enfants comme aux adultes.",
    pages: "60 pages",
    date: "Avril 2024",
    image: "/images/article-3.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    productType: "ebook",
    pricing: "free",
    highlights: [
      "60 recettes familiales",
      "Batch cooking de la semaine",
      "Versions adaptées enfants",
      "Astuces anti-gaspi",
    ],
    introduction:
      "Un guide pratique pour composer des repas équilibrés sans y passer des heures, avec des recettes modulables pour toute la famille.",
    contents: [
      "La formule de l’assiette équilibrée",
      "Menus de la semaine",
      "Recettes express",
      "Organisation et batch cooking",
      "Astuces pour faire aimer les légumes",
    ],
    tip: "Préparez 2–3 bases le week-end pour simplifier les soirs de semaine.",
  },
  {
    id: "3",
    category: "Bien-être",
    title: "Gérer le stress et retrouver son équilibre",
    subtitle: "Des outils concrets pour apaiser le corps et l’esprit.",
    description: "Des outils concrets pour apaiser le corps et l’esprit.",
    pages: "28 pages",
    date: "Mars 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    productType: "ebook",
    pricing: "paid",
    highlights: [
      "Routines anti-stress",
      "Alimentation et sérénité",
      "Exercices de respiration",
      "Plan d’action sur 7 jours",
    ],
    introduction:
      "Ce guide combine nutrition, routines et gestes simples pour mieux gérer le stress au quotidien et retrouver un rythme plus serein.",
    contents: [
      "Comprendre le stress",
      "Aliments alliés de l’équilibre",
      "Routines matin et soir",
      "Exercices courts à pratiquer",
      "Journal de suivi sur 7 jours",
    ],
    tip: "Commencez par une seule habitude : 5 minutes de respiration ou une marche après le déjeuner.",
  },
  {
    id: "4",
    category: "Santé Globale",
    title: "Booster son immunité naturellement",
    subtitle: "Les leviers alimentaires et lifestyle pour renforcer vos défenses.",
    description: "Les leviers alimentaires et lifestyle pour renforcer vos défenses.",
    pages: "25 pages",
    date: "Février 2024",
    image: "/images/article-2.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    productType: "ebook",
    pricing: "free",
    highlights: [
      "Aliments immunité",
      "Sommeil et récupération",
      "Habitudes quotidiennes",
      "Recettes boost énergie",
    ],
    introduction:
      "Un e-book clair pour soutenir votre immunité avec l’alimentation, le sommeil et des habitudes réalistes au quotidien.",
    contents: [
      "Les nutriments clés de l’immunité",
      "Assiettes types",
      "Sommeil et hydratation",
      "Recettes boost",
      "Checklist hebdomadaire",
    ],
    tip: "La régularité compte plus que la perfection : visez des gestes simples chaque jour.",
  },
  {
    id: "recipe-bowl-verdure",
    category: "Recettes",
    title: "Bowl verdure",
    subtitle: "Un bol frais, coloré et équilibré pour toute la famille.",
    description: "Un bol frais, coloré et équilibré pour toute la famille.",
    pages: "8 pages",
    date: "Juillet 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "WELLNEST", role: "Recette" },
    productType: "recipe",
    pricing: "free",
    isRecipe: true,
    meta: "25 MIN — FACILE — 2 PERS.",
    badge: "VÉGÉ",
    cardAuthor: "WELLNEST",
    highlights: [
      "Recette complète étape par étape",
      "Liste d’ingrédients précise",
      "Astuces de substitution",
      "Valeurs nutritionnelles indicatives",
    ],
    introduction:
      "Ce bowl verdure réunit légumes croquants, protéines végétales et une sauce légère pour un repas rapide, rassasiant et équilibré.",
    contents: [
      "Ingrédients",
      "Préparation étape par étape",
      "Conseils de dressage",
      "Variantes selon la saison",
    ],
    tip: "Préparez la base la veille pour un déjeuner encore plus rapide.",
  },
  {
    id: "recipe-pho-leger",
    category: "Recettes",
    title: "Pho léger",
    subtitle: "Une version légère et nourrissante du classique vietnamien.",
    description: "Une version légère et nourrissante du classique vietnamien.",
    pages: "10 pages",
    date: "Juillet 2024",
    image: "/images/article-2.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Nutrition Maman", role: "Recette" },
    productType: "recipe",
    pricing: "paid",
    isRecipe: true,
    meta: "30 MIN — MOYEN — 1 PERS.",
    cardAuthor: "NUTRITION MAMAN",
    highlights: [
      "Bouillon parfumé allégé",
      "Protéines adaptées",
      "Herbes fraîches et toppings",
      "Version grossesse-friendly",
    ],
    introduction:
      "Un pho réconfortant, plus léger, idéal pour un repas chaud riche en saveurs sans lourdeur.",
    contents: [
      "Bouillon et aromates",
      "Assemblage du bol",
      "Garnitures recommandées",
      "Conseils de conservation",
    ],
    tip: "Préparez le bouillon en avance pour gagner du temps le jour même.",
  },
  {
    id: "recipe-aloha-bowl",
    category: "Recettes",
    title: "Aloha bowl",
    subtitle: "Un bowl tropical, frais et équilibré à partager.",
    description: "Un bowl tropical, frais et équilibré à partager.",
    pages: "8 pages",
    date: "Juin 2024",
    image: "/images/article-3.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Famille", role: "Recette" },
    productType: "recipe",
    pricing: "free",
    isRecipe: true,
    meta: "20 MIN — FACILE — 3 PERS.",
    cardAuthor: "FAMILLE",
    highlights: [
      "Recette familiale rapide",
      "Fruits et légumes colorés",
      "Base de céréales complètes",
      "Sauce maison légère",
    ],
    introduction:
      "L’Aloha bowl apporte fraîcheur, couleurs et satiété pour un repas joyeux adapté à toute la famille.",
    contents: [
      "Ingrédients pour 3 personnes",
      "Assemblage du bowl",
      "Sauce et toppings",
      "Idées pour enfants",
    ],
    tip: "Laissez chacun composer son bol : les enfants mangent plus volontiers.",
  },
  {
    id: "recipe-salade-citronnee",
    category: "Recettes",
    title: "Salade citronnée",
    subtitle: "Une salade vive, légère et pleine de fraîcheur.",
    description: "Une salade vive, légère et pleine de fraîcheur.",
    pages: "6 pages",
    date: "Juin 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Équilibre", role: "Recette" },
    productType: "recipe",
    pricing: "paid",
    isRecipe: true,
    meta: "15 MIN — FACILE — 2 PERS.",
    cardAuthor: "ÉQUILIBRE",
    highlights: [
      "Vinaigrette citron maison",
      "Prête en 15 minutes",
      "Idéale en accompagnement",
      "Options protéines à ajouter",
    ],
    introduction:
      "Une salade citronnée simple pour égayer vos repas, avec une vinaigrette vive et des légumes croquants.",
    contents: [
      "Ingrédients",
      "Vinaigrette citron",
      "Assemblage",
      "Variantes protéines",
    ],
    tip: "Assaisonnez juste avant de servir pour garder le croquant.",
  },
  {
    id: "recipe-wraps-colores",
    category: "Recettes",
    title: "Wraps colorés",
    subtitle: "Des wraps ludiques et nutritifs pour lunch boxes et pique-niques.",
    description: "Des wraps ludiques et nutritifs pour lunch boxes et pique-niques.",
    pages: "9 pages",
    date: "Mai 2024",
    image: "/images/article-2.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Enfant", role: "Recette" },
    productType: "recipe",
    pricing: "free",
    isRecipe: true,
    meta: "20 MIN — FACILE — 4 PERS.",
    cardAuthor: "ENFANT",
    highlights: [
      "Idéal lunch box",
      "Recette pour 4 personnes",
      "Garnitures modulables",
      "Version sans gluten possible",
    ],
    introduction:
      "Ces wraps colorés sont parfaits pour l’école ou un déjeuner rapide, avec des garnitures équilibrées et appétissantes.",
    contents: [
      "Tortillas et garnitures",
      "Techniques de pliage",
      "Idées pour enfants",
      "Conservation",
    ],
    tip: "Roulez fermement et coupez en biais pour une présentation plus gourmande.",
  },
  {
    id: "recipe-buddha-protein",
    category: "Recettes",
    title: "Buddha protein",
    subtitle: "Un buddha bowl riche en protéines pour soutenir énergie et récupération.",
    description: "Un buddha bowl riche en protéines pour soutenir énergie et récupération.",
    pages: "10 pages",
    date: "Mai 2024",
    image: "/images/article-3.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Sport", role: "Recette" },
    productType: "recipe",
    pricing: "paid",
    isRecipe: true,
    meta: "35 MIN — MOYEN — 2 PERS.",
    cardAuthor: "SPORT",
    highlights: [
      "Riche en protéines",
      "Équilibre glucides / lipides",
      "Sauce tahini légère",
      "Adapté post-entraînement",
    ],
    introduction:
      "Ce buddha bowl protéiné combine céréales, légumineuses et légumes rôtis pour un repas complet et rassasiant.",
    contents: [
      "Ingrédients sportifs",
      "Cuisson des bases",
      "Assemblage du bowl",
      "Timing post-entraînement",
    ],
    tip: "Ajoutez une source de protéines froides pour un repas prêt à emporter.",
  },
  {
    id: "grocery-semaine-famille",
    category: "Nutrition Maman",
    title: "Liste de courses — semaine famille",
    subtitle: "Une liste gratuite pour organiser vos courses de la semaine.",
    description: "Une liste gratuite pour organiser vos courses de la semaine.",
    pages: "4 pages",
    date: "Juillet 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "WELLNEST", role: "Liste de courses" },
    productType: "grocery",
    pricing: "free",
    highlights: [
      "Liste classée par rayon",
      "Quantités pour 4 personnes",
      "Options économiques",
      "Checklist imprimable",
    ],
    introduction:
      "Cette liste de courses gratuite vous aide à préparer une semaine de repas familiaux sans oubli ni gaspillage.",
    contents: [
      "Fruits et légumes",
      "Protéines et produits frais",
      "Épicerie sèche",
      "Produits surgelés",
    ],
    tip: "Cochez les articles déjà chez vous avant d’imprimer la liste.",
  },
  {
    id: "grocery-grossesse",
    category: "Nutrition Maman",
    title: "Liste de courses — grossesse équilibrée",
    subtitle: "Une liste premium pour bien manger pendant la grossesse.",
    description: "Une liste premium pour bien manger pendant la grossesse.",
    pages: "6 pages",
    date: "Juin 2024",
    image: "/images/article-2.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "Dr. Leila Benyamina", role: "Liste de courses" },
    productType: "grocery",
    pricing: "paid",
    highlights: [
      "Aliments prioritaires grossesse",
      "Repères par trimestre",
      "Alternatives en cas de nausées",
      "Version premium détaillée",
    ],
    introduction:
      "Une liste de courses payante, pensée pour couvrir les besoins nutritionnels de la grossesse avec clarté et simplicité.",
    contents: [
      "Essentiels folates et fer",
      "Snacks adaptés",
      "Produits à limiter",
      "Planning de courses 7 jours",
    ],
    tip: "Combinez cette liste avec le guide grossesse pour des menus cohérents.",
  },
  {
    id: "grocery-lunchbox",
    category: "Bébé & Enfant",
    title: "Liste de courses — lunch box enfants",
    subtitle: "Les indispensables gratuits pour des lunchs variés.",
    description: "Les indispensables gratuits pour des lunchs variés.",
    pages: "3 pages",
    date: "Mai 2024",
    image: "/images/article-3.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "WELLNEST", role: "Liste de courses" },
    productType: "grocery",
    pricing: "free",
    highlights: [
      "Idées lunch box",
      "Produits anti-gaspi",
      "Snacks scolaires",
      "Checklist rapide",
    ],
    introduction:
      "Une liste gratuite pour remplir le panier avec des aliments pratiques et adaptés aux lunch boxes des enfants.",
    contents: [
      "Bases féculents",
      "Protéines faciles",
      "Fruits et légumes prêts",
      "Collations saines",
    ],
    tip: "Préparez 2 bases le dimanche pour simplifier toute la semaine.",
  },
  {
    id: "grocery-sport",
    category: "Santé Globale",
    title: "Liste de courses — énergie & sport",
    subtitle: "Liste payante pour soutenir entraînement et récupération.",
    description: "Liste payante pour soutenir entraînement et récupération.",
    pages: "5 pages",
    date: "Avril 2024",
    image: "/images/article-1.jpg",
    delivery: "Téléchargement immédiat",
    author: { name: "WELLNEST", role: "Liste de courses" },
    productType: "grocery",
    pricing: "paid",
    highlights: [
      "Protéines de qualité",
      "Collations pré/post sport",
      "Hydratation",
      "Plan courses 2 semaines",
    ],
    introduction:
      "Cette liste payante regroupe les produits utiles pour l’énergie, la récupération et des repas sportifs simples.",
    contents: [
      "Protéines et légumineuses",
      "Glucides complexes",
      "Snacks performance",
      "Compléments alimentaires courants",
    ],
    tip: "Priorisez les protéines et les féculents complets avant les snacks.",
  },
  {
    id: "ar-1",
    language: "ar",
    category: "Nutrition Maman",
    title: "الدليل الكامل لتغذية الحمل",
    subtitle: "كل ما تحتاجينه لتغذية صحية، ودعم جنينك، والعناية بنفسك.",
    description: "كل ما تحتاجينه لتغذية صحية، ودعم جنينك، والعناية بنفسك.",
    pages: "45 صفحات",
    date: "أوت 2026",
    image: "/images/article-1.jpg",
    delivery: "تحميل فوري",
    author: { name: "د. ليلى بنيامنة", role: "أخصائية تغذية" },
    productType: "ebook",
    pricing: "paid",
    highlights: [
      "قوائم وجبات حسب كل فصل من الحمل",
      "قوائم تسوق جاهزة للاستخدام",
      "نصائح للغثيان والرغبة الشديدة في الأكل",
      "وصفات بسيطة ومغذية",
    ],
    introduction:
      "يرافقك هذا الدليل طوال فترة الحمل بنصائح عملية، وأفكار وجبات، ومراجع غذائية واضحة لكِ ولجنينك.",
    contents: [
      "الاحتياجات الغذائية حسب الفصل",
      "أطعمة يُفضَّل التركيز عليها وأخرى للتقليل",
      "خطط وجبات أسبوعية",
      "وصفات سريعة وقوائم تسوق",
      "أسئلة شائعة حول الحمل والتغذية",
    ],
    tip: "حمّلي الدليل واحتفظي به قريباً أثناء التسوق وتحضير وجبات الأسبوع.",
  },
];

export const featuredEbook = ebooks.find((ebook) => ebook.featured)!;

export const healthyRecipes = ebooks.filter((ebook) => ebook.isRecipe);

export function getEbookById(id: string) {
  return ebooks.find((ebook) => ebook.id === id);
}

export async function resolveEbooks() {
  const { fetchEbooksFromApi } = await import("@/lib/content-api");
  const fromApi = await fetchEbooksFromApi();
  if (!fromApi.length) return ebooks;
  const apiIds = new Set(fromApi.map((e) => e.id));
  return [...fromApi, ...ebooks.filter((e) => !apiIds.has(e.id))];
}

export async function resolveEbookById(id: string) {
  const { fetchEbookFromApi } = await import("@/lib/content-api");
  const fromApi = await fetchEbookFromApi(id);
  if (fromApi) return fromApi;
  return getEbookById(id) ?? null;
}

export async function resolveFeaturedEbook() {
  const list = await resolveEbooks();
  return list.find((ebook) => ebook.featured) ?? list[0] ?? featuredEbook;
}

export async function resolveHealthyRecipes() {
  const list = await resolveEbooks();
  const recipes = list.filter((ebook) => ebook.isRecipe);
  return recipes.length ? recipes : healthyRecipes;
}

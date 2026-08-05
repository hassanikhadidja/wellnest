import type { ContentLanguage } from "@/lib/content-language";

export type Article = {
  id: string;
  /** Defaults to French when omitted on legacy static entries */
  language?: ContentLanguage;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
  };
  keyPoints: string[];
  introduction: string;
  sections: {
    title: string;
    subtitle?: string;
    body: string;
    image?: string;
  }[];
  tip: string;
};

export const articleCategories = [
  "Tous",
  "Nutrition Maman",
  "Bébé & Enfant",
  "Santé Globale",
  "Bien-être",
] as const;

export const articles: Article[] = [
  {
    id: "1",
    category: "Nutrition Maman",
    title: "Alimentation pendant la grossesse : les clés essentielles",
    subtitle: "Guide complet pour bien manger pour vous et votre bébé.",
    excerpt:
      "Découvrez les nutriments prioritaires, les aliments à privilégier et les habitudes simples pour soutenir votre grossesse au quotidien.",
    date: "22 Mai 2024",
    readTime: "6 min de lecture",
    image: "/images/article-1.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Privilégiez les aliments riches en folates, fer et calcium.",
      "Hydratez-vous régulièrement tout au long de la journée.",
      "Évitez les aliments crus à risque et les excès de caféine.",
      "Écoutez votre corps et adaptez vos portions progressivement.",
    ],
    introduction:
      "Bien manger pendant la grossesse n’est pas une contrainte, c’est un accompagnement. Une alimentation équilibrée soutient votre énergie, le développement de votre bébé et votre confort au quotidien. Voici les bases à connaître pour chaque étape.",
    sections: [
      {
        title: "1. Les nutriments essentiels pour chaque trimestre",
        subtitle: "Premier trimestre",
        body: "Au début de la grossesse, les besoins en folates sont particulièrement importants. Intégrez des légumes verts, des légumineuses, des produits laitiers et des sources de protéines de qualité. Des collations légères aident aussi à gérer les nausées.",
        image: "/images/article-2.jpg",
      },
      {
        title: "2. Construire des assiettes simples et nutritives",
        body: "Visez une assiette colorée : légumes, protéines, féculents complets et un peu de matières grasses de qualité. Ce format facilite la satiété, stabilise l’énergie et reste facile à adapter selon vos envies.",
        image: "/images/article-3.jpg",
      },
    ],
    tip: "Consultez toujours votre professionnel de santé pour un suivi personnalisé.",
  },
  {
    id: "2",
    category: "Bébé & Enfant",
    title: "Diversification alimentaire : par où commencer ?",
    subtitle: "Un guide serein pour les premières cuillères.",
    excerpt:
      "Un guide pratique pour introduire les premiers aliments en douceur, sans stress, avec des idées adaptées à chaque âge.",
    date: "18 Mai 2024",
    readTime: "5 min de lecture",
    image: "/images/article-2.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Commencez vers 4–6 mois selon les recommandations de votre pédiatre.",
      "Introduisez un aliment à la fois pour observer les réactions.",
      "Privilégiez des textures adaptées et des portions progressives.",
      "Gardez le lait comme base alimentaire principale au début.",
    ],
    introduction:
      "La diversification est une étape excitante… et parfois stressante. L’objectif n’est pas la perfection, mais d’accompagner votre bébé avec douceur, curiosité et régularité.",
    sections: [
      {
        title: "1. Les premiers aliments à proposer",
        subtitle: "Légumes et fruits doux",
        body: "Les purées de carotte, courgette, patate douce ou pomme sont d’excellents débuts. Proposez-les à la cuillère, en petites quantités, et laissez votre bébé explorer les goûts à son rythme.",
        image: "/images/article-1.jpg",
      },
    ],
    tip: "Chaque bébé progresse à son rythme : observez ses signes d’appétit et de satiété.",
  },
  {
    id: "3",
    category: "Santé Globale",
    title: "Assiettes équilibrées pour toute la famille",
    subtitle: "Des repas simples qui plaisent à tous.",
    excerpt:
      "Composez des repas colorés et nutritifs qui plaisent aux enfants comme aux adultes, sans passer des heures en cuisine.",
    date: "10 Mai 2024",
    readTime: "4 min de lecture",
    image: "/images/article-3.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Composez autour de légumes, protéines et féculents.",
      "Variez les couleurs pour couvrir plus de nutriments.",
      "Préparez des bases communes, puis adaptez les portions.",
      "Impliquez les enfants pour faciliter l’acceptation.",
    ],
    introduction:
      "Une assiette familiale réussie est souvent la plus simple : colorée, rassasiante et flexible. Voici une méthode claire pour composer sans stress.",
    sections: [
      {
        title: "1. La formule de l’assiette équilibrée",
        body: "Remplissez la moitié de l’assiette de légumes, un quart de protéines et un quart de féculents. Ajoutez une matière grasse de qualité et un fruit en dessert si besoin.",
        image: "/images/article-1.jpg",
      },
    ],
    tip: "Préparez des légumes en batch pour gagner du temps en semaine.",
  },
  {
    id: "4",
    category: "Bien-être",
    title: "Hydratation et énergie au quotidien",
    subtitle: "Les gestes simples pour rester en forme.",
    excerpt:
      "Comment boire assez, reconnaître les signes de fatigue et garder une énergie stable tout au long de la journée.",
    date: "2 Mai 2024",
    readTime: "3 min de lecture",
    image: "/images/article-1.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Visez une hydratation régulière plutôt que de grandes quantités d’un coup.",
      "L’eau, les infusions et les fruits juteux comptent.",
      "La fatigue peut signaler un manque d’eau ou de repas structurés.",
      "Associez hydratation et collations équilibrées.",
    ],
    introduction:
      "L’hydratation est l’un des leviers les plus simples pour soutenir l’énergie, la concentration et le confort digestif au quotidien.",
    sections: [
      {
        title: "1. Créer une routine d’hydratation",
        body: "Commencez la journée par un grand verre d’eau, gardez une bouteille visible et associez chaque repas à un moment de boisson. Les infusions non sucrées sont aussi une belle option.",
        image: "/images/article-2.jpg",
      },
    ],
    tip: "Si vous avez soif, votre corps demande déjà de l’eau : anticipez.",
  },
  {
    id: "5",
    category: "Nutrition Maman",
    title: "Snacks sains pour toute la grossesse",
    subtitle: "Des collations simples et rassasiantes.",
    excerpt:
      "Des collations simples, rassasiantes et nutritives pour les petites faims entre les repas.",
    date: "28 Avril 2024",
    readTime: "4 min de lecture",
    image: "/images/article-2.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Associez protéine + fibre pour une satiété durable.",
      "Préparez 2–3 options à l’avance.",
      "Évitez les collations ultra-sucrées qui fatiguent.",
      "Écoutez vos fringales sans culpabilité.",
    ],
    introduction:
      "Les collations font partie de l’équilibre pendant la grossesse. Bien choisies, elles stabilisent l’énergie et aident à mieux traverser la journée.",
    sections: [
      {
        title: "1. Idées de snacks prêts en 5 minutes",
        body: "Yaourt et fruits, pain complet et beurre d’amande, houmous et légumes croquants, ou une poignée de noix avec une pomme : simples, rapides et efficaces.",
        image: "/images/article-3.jpg",
      },
    ],
    tip: "Gardez toujours une option saine dans votre sac ou au bureau.",
  },
  {
    id: "6",
    category: "Bébé & Enfant",
    title: "Lunch box équilibrée pour l'école",
    subtitle: "Des idées concrètes pour la semaine.",
    excerpt:
      "Idées concrètes pour préparer des lunchs variés, attrayants et adaptés aux besoins des enfants.",
    date: "20 Avril 2024",
    readTime: "5 min de lecture",
    image: "/images/article-3.jpg",
    author: { name: "Dr. Leila Benyamina", role: "Nutritionniste" },
    keyPoints: [
      "Variez les couleurs pour stimuler l’appétit.",
      "Incluez une source de protéines et un féculent.",
      "Ajoutez un fruit ou un produit laitier.",
      "Préparez les bases la veille pour gagner du temps.",
    ],
    introduction:
      "Une lunch box réussie est nourrissante, appétissante et réaliste à préparer. Voici une méthode simple pour composer sans stress.",
    sections: [
      {
        title: "1. La structure d’une lunch box réussie",
        body: "Base : féculent + protéine + légumes + fruit. Alternez wraps, salades composées, mini-omelettes ou restes du dîner adaptés.",
        image: "/images/article-1.jpg",
      },
    ],
    tip: "Laissez votre enfant choisir un élément : il mangera plus volontiers.",
  },
  {
    id: "ar-1",
    language: "ar",
    category: "Nutrition Maman",
    title: "التغذية أثناء الحمل: الأساسيات المهمة",
    subtitle: "دليل عملي لتغذية صحية لكِ ولجنينك.",
    excerpt:
      "اكتشفِ أهم العناصر الغذائية، الأطعمة الموصى بها، وعادات يومية بسيطة لدعم حملك براحة وثقة.",
    date: "5 أوت 2026",
    readTime: "6 دقائق قراءة",
    image: "/images/article-1.jpg",
    author: { name: "د. ليلى بنيامنة", role: "أخصائية تغذية" },
    keyPoints: [
      "اهتمي بالأطعمة الغنية بحمض الفوليك والحديد والكالسيوم.",
      "اشربي الماء بانتظام طوال اليوم.",
      "تجنبي الأطعمة النيئة عالية الخطورة والإفراط في الكافيين.",
      "استمعي لجسمك وعدّلي الكميات تدريجياً.",
    ],
    introduction:
      "الأكل الصحي أثناء الحمل ليس قيداً، بل مرافقة يومية. التغذية المتوازنة تدعم طاقتك، وتساعد على نمو جنينك، وتمنحك راحة أكبر في كل مرحلة.",
    sections: [
      {
        title: "1. العناصر الأساسية في كل فصل من الحمل",
        subtitle: "الفصل الأول",
        body: "في بداية الحمل تكون الحاجة إلى حمض الفوليك مهمة جداً. أدخلي الخضروات الورقية، البقوليات، منتجات الألبان، ومصادر البروتين الجيدة. الوجبات الخفيفة الخفيفة تساعد أيضاً على تهدئة الغثيان.",
        image: "/images/article-2.jpg",
      },
      {
        title: "2. كيف تركّبين طبقاً بسيطاً ومغذياً",
        body: "اختاري طبقاً ملوناً: خضار، بروتين، نشويات كاملة، وقليل من الدهون الجيدة. هذا النموذج يسهّل الشبع، يثبت الطاقة، ويبقى سهل التكييف حسب رغباتك.",
        image: "/images/article-3.jpg",
      },
    ],
    tip: "استشيري دائماً مختصاً في الصحة لمتابعة شخصية تناسب وضعك.",
  },
];

export function getArticleById(id: string) {
  return articles.find((article) => article.id === id);
}

export async function resolveArticles() {
  const { fetchArticlesFromApi } = await import("@/lib/content-api");
  const fromApi = await fetchArticlesFromApi();
  if (!fromApi.length) return articles;
  const staticIds = new Set(fromApi.map((a) => a.id));
  return [...fromApi, ...articles.filter((a) => !staticIds.has(a.id))];
}

export async function resolveArticleById(id: string) {
  const { fetchArticleFromApi } = await import("@/lib/content-api");
  const fromApi = await fetchArticleFromApi(id);
  if (fromApi) return fromApi;
  return getArticleById(id) ?? null;
}

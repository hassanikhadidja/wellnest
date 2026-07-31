import Image from "next/image";
import Link from "next/link";

const marqueeText = "MANGER SAIN • VIVRE MIEUX • RECETTES ÉQUILIBRÉES";

const recipes = [
  {
    author: "WELLNEST",
    title: "Bowl verdure",
    meta: "25 MIN — FACILE — 2 PERS.",
    image: "/images/article-1.jpg",
    badge: "VÉGÉ",
  },
  {
    author: "NUTRITION MAMAN",
    title: "Pho léger",
    meta: "30 MIN — MOYEN — 1 PERS.",
    image: "/images/article-2.jpg",
  },
  {
    author: "FAMILLE",
    title: "Aloha bowl",
    meta: "20 MIN — FACILE — 3 PERS.",
    image: "/images/article-3.jpg",
  },
  {
    author: "ÉQUILIBRE",
    title: "Salade citronnée",
    meta: "15 MIN — FACILE — 2 PERS.",
    image: "/images/article-1.jpg",
  },
  {
    author: "ENFANT",
    title: "Wraps colorés",
    meta: "20 MIN — FACILE — 4 PERS.",
    image: "/images/article-2.jpg",
  },
  {
    author: "SPORT",
    title: "Buddha protein",
    meta: "35 MIN — MOYEN — 2 PERS.",
    image: "/images/article-3.jpg",
  },
];

export function HealthyRecipes() {
  return (
    <section id="recettes" className="recipes-section bg-white py-10 sm:py-14">
      <div className="recipes-marquee mb-6 overflow-hidden bg-olive py-2.5 text-white sm:mb-8" aria-hidden>
        <div className="recipes-marquee-track flex w-max whitespace-nowrap text-[11px] font-semibold tracking-[0.18em]">
          {[0, 1].map((group) => (
            <div key={group} className="flex gap-10 pr-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={`${group}-${i}`}>{marqueeText}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 max-[999px]:px-4">
        <h2 className="font-display mb-8 text-center text-2xl font-semibold text-ink sm:mb-10 sm:text-3xl max-[999px]:mb-6 max-[999px]:text-xl">
          Recettes Healthy
        </h2>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <ul className="recipes-scroll flex gap-4 overflow-x-auto pb-3 [scrollbar-color:#5a6b38_#c8d6bc] [scrollbar-width:thin] sm:gap-5">
          {recipes.map((recipe) => (
            <li
              key={`${recipe.title}-${recipe.author}`}
              className="w-[220px] shrink-0 rounded-[1.75rem] bg-cream p-3 shadow-[0_8px_24px_rgba(44,42,38,0.08)] sm:w-[240px] sm:p-3.5"
            >
              <div className="relative mb-3 aspect-square overflow-hidden rounded-[1.35rem]">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
                {recipe.badge && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-olive px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
                    {recipe.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {recipe.author}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold uppercase leading-tight tracking-wide text-ink">
                {recipe.title}
              </h3>
              <div className="mt-4 flex items-center justify-between gap-2">
                <p className="text-[9px] font-medium uppercase tracking-wide text-muted">
                  {recipe.meta}
                </p>
                <Link
                  href="#recettes"
                  className="shrink-0 rounded-full border border-ink/80 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  Voir
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="#recettes"
            className="inline-flex items-center gap-2 rounded-full bg-olive px-7 py-3.5 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
          >
            Découvrir des recettes équilibrées
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

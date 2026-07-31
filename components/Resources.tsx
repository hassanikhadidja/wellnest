import Image from "next/image";

const resources = [
  {
    title: "Recettes Saines",
    description: "Idées de repas pour toute la famille",
    icon: "/images/resources/recettes.png",
  },
  {
    title: "Guides Pratiques",
    description: "Conseils concrets étape par étape",
    icon: "/images/resources/guides.png",
  },
  {
    title: "Calculateurs",
    description: "Outils pour vos besoins nutritionnels",
    icon: "/images/resources/calculateurs.png",
  },
  {
    title: "Communauté",
    description: "Échangez avec d'autres familles",
    icon: "/images/resources/communaute.png",
  },
  {
    title: "Boutique",
    description: "Produits sélectionnés pour vous",
    icon: "/images/resources/boutique.png",
  },
];

export function Resources() {
  return (
    <section id="ressources" className="bg-white pt-4 pb-10 sm:pt-6 sm:pb-12 max-[999px]:pb-6">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 max-[999px]:px-4">
        <h2 className="font-display mb-10 text-center text-2xl font-semibold text-ink sm:text-3xl max-[999px]:mb-6 max-[999px]:text-xl">
          Des ressources pour toute la famille
        </h2>
        <ul className="resources-grid grid grid-cols-1 gap-6 sm:grid-cols-2 min-[1000px]:grid-cols-2 min-[1051px]:grid-cols-5 min-[1051px]:gap-5 max-[999px]:grid-cols-5">
          {resources.map((resource) => (
            <li
              key={resource.title}
              className="resource-item flex items-center gap-3 text-left"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16">
                <Image
                  src={resource.icon}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-snug text-ink">{resource.title}</p>
                <p className="mt-1 text-[12px] leading-snug text-muted max-[999px]:line-clamp-2">
                  {resource.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

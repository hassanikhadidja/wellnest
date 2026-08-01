"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const resources = [
  {
    title: "Recettes Saines",
    description: "Idées de repas pour toute la famille",
    icon: "/images/resources/recettes.png",
    href: "/ebooks?sort=recipe-free&tag=Recettes%20gratuites",
  },
  {
    title: "Guides Pratiques",
    description: "Conseils concrets étape par étape",
    icon: "/images/resources/guides.png",
    href: "/ebooks?category=Guides%20Pratiques&tag=Guides%20Pratiques",
  },
  {
    title: "Calculateurs",
    description: "Outils pour vos besoins nutritionnels",
    icon: "/images/resources/calculateurs.png",
    href: "/questionnaire",
  },
  {
    title: "Communauté",
    description: "Échangez avec d'autres familles",
    icon: "/images/resources/communaute.png",
    action: "copy" as const,
  },
  {
    title: "Boutique",
    description: "Produits sélectionnés pour vous",
    icon: "/images/resources/boutique.png",
    href: "/ebooks?type=grocery&tag=shopping%20list",
  },
];

export function Resources() {
  const [copied, setCopied] = useState(false);

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section id="ressources" className="bg-white pt-4 pb-10 sm:pt-6 sm:pb-12 max-[999px]:pb-2">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 max-[999px]:px-4">
        <h2 className="font-display mb-10 text-center text-2xl font-semibold text-ink sm:text-3xl max-[999px]:mb-6 max-[999px]:text-xl">
          Des ressources pour toute la famille
        </h2>
        <ul className="resources-grid grid grid-cols-1 gap-6 sm:grid-cols-2 min-[1000px]:grid-cols-2 min-[1051px]:grid-cols-5 min-[1051px]:gap-5 max-[999px]:grid-cols-5">
          {resources.map((resource) => {
            const content = (
              <>
                <span className="resource-icon relative h-14 w-14 shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16">
                  <Image
                    src={resource.icon}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </span>
                <div className="resource-copy min-w-0">
                  <p className="text-[14px] font-bold leading-snug text-ink">{resource.title}</p>
                  <p className="mt-1 text-[12px] leading-snug text-muted max-[999px]:line-clamp-2">
                    {resource.action === "copy" && copied
                      ? "Lien copié !"
                      : resource.description}
                  </p>
                </div>
              </>
            );

            const itemClass =
              "resource-link flex w-full items-center gap-3 text-left transition-opacity hover:opacity-85 max-[999px]:flex-col max-[999px]:items-center max-[999px]:gap-1.5 max-[999px]:text-center";

            return (
              <li key={resource.title} className="resource-item min-w-0">
                {resource.href ? (
                  <Link href={resource.href} className={itemClass}>
                    {content}
                  </Link>
                ) : resource.action === "copy" ? (
                  <button type="button" onClick={copyPageLink} className={itemClass}>
                    {content}
                  </button>
                ) : (
                  <div className={itemClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

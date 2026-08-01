"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { healthyRecipes as defaultRecipes, resolveHealthyRecipes, type Ebook } from "@/lib/ebooks";

const marqueeText = "MANGER SAIN • VIVRE MIEUX • RECETTES ÉQUILIBRÉES";

export function HealthyRecipes() {
  const [healthyRecipes, setHealthyRecipes] = useState<Ebook[]>(defaultRecipes);

  useEffect(() => {
    void resolveHealthyRecipes().then(setHealthyRecipes);
  }, []);

  return (
    <section id="recettes" className="recipes-section bg-white py-10 sm:py-14 max-[999px]:pt-0 max-[999px]:pb-8">
      <div className="recipes-marquee mb-6 overflow-hidden bg-olive py-2.5 text-white sm:mb-8 max-[999px]:mb-5" aria-hidden>
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
          {healthyRecipes.map((recipe) => (
            <li
              key={recipe.id}
              className="w-[220px] shrink-0 snap-start sm:w-[240px] max-[999px]:w-[200px]"
            >
              <Link
                href={`/ebooks/${recipe.id}`}
                className="group block overflow-hidden rounded-2xl border border-sand/60 bg-cream/30 transition-transform hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="240px"
                  />
                  {recipe.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-olive">
                      {recipe.badge}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-olive">
                    {recipe.cardAuthor || recipe.author.name}
                  </p>
                  <h3 className="mt-1 font-display text-[17px] font-semibold leading-snug text-ink">
                    {recipe.title}
                  </h3>
                  {recipe.meta && (
                    <p className="mt-1 text-[11px] font-medium text-muted">{recipe.meta}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

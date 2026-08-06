"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { resolveArticles, type Article } from "@/lib/articles";

const metrics = [
  { label: "Nutrition", value: 85, color: "#5a6b38", icon: "/images/metrics/nutrition.png" },
  { label: "Activité Physique", value: 70, color: "#8B9A5C", icon: "/images/metrics/activite.png" },
  { label: "Sommeil", value: 75, color: "#C9B896", icon: "/images/metrics/sommeil.png" },
  { label: "Hydratation", value: 80, color: "#6b7d45", icon: "/images/metrics/hydratation.png" },
];

const groceries = [
  { label: "Fruits & Légumes", count: "12 articles", icon: "/images/groceries/fruits.png" },
  { label: "Protéines saines", count: "8 articles", icon: "/images/groceries/proteines.png" },
  { label: "Céréales complètes", count: "6 articles", icon: "/images/groceries/cereales.png" },
  { label: "Produits sains", count: "10 articles", icon: "/images/groceries/produits.png" },
];

const cardClass =
  "flex h-full flex-col rounded-xl bg-[rgb(232_223_208/42%)] p-5 sm:p-6";

export function DashboardPreview({
  initialArticles = [],
}: {
  initialArticles?: Article[];
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const circumference = 2 * Math.PI * 36;
  const progress = 0.78;
  const offset = circumference * (1 - progress);

  useEffect(() => {
    void resolveArticles().then(setArticles);
  }, []);

  return (
    <section id="blog" className="bg-white pt-14 pb-6 sm:pt-16 sm:pb-8 max-[999px]:pt-6 max-[999px]:pb-4">
      <div className="dashboard-grid mx-auto grid max-w-[1200px] gap-6 px-6 min-[1000px]:grid-cols-3 min-[1000px]:gap-6 min-[1000px]:px-8 max-[999px]:gap-0 max-[999px]:px-4">
        {/* Articles — scrollable on desktop; list style under 1000px */}
        <div className={`${cardClass} max-[999px]:rounded-none max-[999px]:bg-transparent max-[999px]:p-0 max-[999px]:shadow-none`}>
          <div className="mb-4 flex shrink-0 items-baseline justify-between gap-3 max-[999px]:mb-3">
            <h2 className="font-display text-2xl font-semibold text-ink max-[999px]:text-xl">Articles Récents</h2>
            <Link href="/articles" className="text-[12px] font-semibold text-olive hover:underline">
              Voir tout
            </Link>
          </div>
          <ul className="max-h-[340px] space-y-4 overflow-y-auto pr-1 [scrollbar-color:#5a6b38_#f7f4ee] [scrollbar-width:thin] max-[999px]:max-h-none max-[999px]:space-y-3 max-[999px]:overflow-visible max-[999px]:pr-0">
            {articles.map((article, index) => (
              <li
                key={article.id}
                className={index > 0 ? "max-[999px]:hidden" : undefined}
              >
                <Link href={`/articles/${article.id}`} className="group flex gap-3">
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md max-[999px]:h-16 max-[999px]:w-16 max-[999px]:rounded-xl">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="72px"
                    />
                  </div>
                  <div className="min-w-0 py-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-olive">
                      {article.category}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold leading-snug text-ink group-hover:text-olive max-[999px]:font-display max-[999px]:text-[15px] max-[999px]:font-semibold">
                      {article.title}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">{article.date}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Analysis — desktop only */}
        <div className={`${cardClass} max-[999px]:hidden`}>
          <h2 className="font-display text-2xl font-semibold text-ink">Analyse de votre programme</h2>
          <p className="mt-1 text-[13px] text-muted">Exemple de rapport personnalisé.</p>

          <div className="mt-6 flex flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-[140px] w-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#ffffff" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke="#5a6b38"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="donut-ring"
                  style={{ strokeDashoffset: offset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-2xl font-bold text-olive">78%</span>
                <span className="text-[10px] font-medium leading-tight text-muted">
                  Équilibre
                  <br />
                  Global
                </span>
              </div>
            </div>

            <ul className="w-full flex-1 space-y-3">
              {metrics.map((metric) => (
                <li key={metric.label}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
                    <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
                      <span className="relative h-6 w-6 shrink-0">
                        <Image
                          src={metric.icon}
                          alt=""
                          fill
                          className="object-contain"
                          sizes="24px"
                        />
                      </span>
                      <span className="truncate">{metric.label}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-olive">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/questionnaire"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-olive px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.05em] text-white transition-colors hover:bg-olive-dark"
          >
            VOIR UN EXEMPLE D&apos;ANALYSE
          </Link>
        </div>

        {/* Grocery list — desktop only */}
        <div className={`${cardClass} max-[999px]:hidden`}>
          <h2 className="font-display text-2xl font-semibold text-ink">Liste de courses personnalisée</h2>
          <p className="mt-1 text-[13px] text-muted">Exemple pour votre semaine.</p>

          <ul className="mt-6 flex-1 space-y-3">
            {groceries.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-md bg-white/80 px-3 py-2.5"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={item.icon}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{item.label}</p>
                  <p className="text-[11px] text-muted">{item.count}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/ebooks?type=grocery&tag=shopping%20list"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-sand-dark px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.05em] text-ink transition-colors hover:bg-[#d4c4a8]"
          >
            VOIR MA LISTE PERSONNALISEE
          </Link>
        </div>
      </div>
    </section>
  );
}

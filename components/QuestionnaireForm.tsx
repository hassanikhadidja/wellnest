"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { markQuestionnaireDone } from "@/lib/questionnaire";

const TOTAL_STEPS = 6;

const profiles = [
  { id: "enceinte", label: "Je suis enceinte", icon: "pregnant" },
  { id: "allaite", label: "J'allaite", icon: "feed" },
  { id: "autre", label: "Je ne suis pas enceinte / J'allaite pas", icon: "person" },
] as const;

const trimesters = [
  { id: "t1", label: "1er trimestre (1 à 12 SA)", icon: "seed" },
  { id: "t2", label: "2e trimestre (13 à 27 SA)", icon: "grow" },
  { id: "t3", label: "3e trimestre (28 à 40 SA)", icon: "baby" },
  { id: "unknown", label: "Je ne sais pas", icon: "help" },
] as const;

const goals = [
  { id: "equilibre", label: "Avoir une alimentation saine et équilibrée", icon: "heart" },
  { id: "bebe", label: "Favoriser le développement de mon bébé", icon: "child" },
  { id: "prevention", label: "Prévenir les carences et complications", icon: "shield" },
  { id: "energie", label: "Gérer mon poids et mon énergie", icon: "bolt" },
  { id: "autre", label: "Autre objectif", icon: "lotus" },
] as const;

function CardIcon({ type }: { type: string }) {
  const common = "h-7 w-7 text-olive";
  if (type === "pregnant") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="12" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 21V14.5C9 12.5 10.3 11 12 11C13.7 11 15 12.5 15 14.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 11C14.2 11 16 12.8 16 15.2C16 16.5 15.3 17.5 14.2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "feed") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="9" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 20V13.5C6.5 11.5 7.8 10 9.5 10H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 14.5C14 16.5 15 18 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "person") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 19C6.4 16 9 14.5 12 14.5C15 14.5 17.6 16 18.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "seed" || type === "grow" || type === "baby") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <ellipse cx="12" cy="13" rx="5.5" ry="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r={type === "seed" ? 1.5 : type === "grow" ? 2.2 : 2.8} stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (type === "help") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 9.5C9.5 8.1 10.6 7 12 7C13.4 7 14.5 8.1 14.5 9.5C14.5 10.6 13.8 11.3 12.8 11.7C12.3 11.9 12 12.3 12 12.8V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  if (type === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-olive" fill="none" aria-hidden>
        <path d="M12 19C12 19 4.5 14.5 4.5 9.2C4.5 6.5 6.6 4.5 9.2 4.5C10.7 4.5 12 5.3 12.5 6.5C13 5.3 14.3 4.5 15.8 4.5C18.4 4.5 20.5 6.5 20.5 9.2C20.5 14.5 13 19 13 19H12Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "child") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-olive" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 19C7.8 16.2 9.6 14.5 12 14.5C14.4 14.5 16.2 16.2 17 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-olive" fill="none" aria-hidden>
        <path d="M12 3.5L19 6.5V11C19 15.5 16.2 19.2 12 20.5C7.8 19.2 5 15.5 5 11V6.5L12 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 9V15M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-olive" fill="none" aria-hidden>
        <path d="M13 3L5.5 13H11L10 21L18.5 11H13L13 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-olive" fill="none" aria-hidden>
      <path d="M12 19C12 19 6 14.5 6 10C6 7.8 7.8 6 10 6C11.1 6 12.1 6.5 12.7 7.3C13.3 6.5 14.3 6 15.4 6C17.6 6 19.4 7.8 19.4 10C19.4 14.5 13.4 19 13.4 19H12Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SelectCard({
  selected,
  label,
  icon,
  onClick,
}: {
  selected: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        selected ? "border-olive bg-olive/5" : "border-sand/80 bg-white hover:border-olive/40"
      }`}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-olive text-white" aria-hidden>
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      )}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream">
        <CardIcon type={icon} />
      </span>
      <span className="pr-4 text-[13px] font-semibold leading-snug text-ink">{label}</span>
    </button>
  );
}

export function QuestionnaireForm({
  nextPath = null,
  planId = null,
}: {
  nextPath?: string | null;
  planId?: string | null;
}) {
  const router = useRouter();
  const [step] = useState(1);
  const [profile, setProfile] = useState("enceinte");
  const [trimester, setTrimester] = useState("t2");
  const [goal, setGoal] = useState("equilibre");

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  async function handleNext() {
    await markQuestionnaireDone({
      profile,
      trimester: profile === "enceinte" ? trimester : undefined,
      goal,
    });

    if (nextPath && nextPath.startsWith("/")) {
      const url = planId ? `${nextPath}?plan=${encodeURIComponent(planId)}` : nextPath;
      router.push(url);
      return;
    }
    router.push("/programmes");
  }

  return (
    <div className="bg-white pb-10 pt-4">
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
          <Link href="/" className="inline-flex items-center text-olive hover:underline" aria-label="Accueil">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M3.5 9.5L10 4L16.5 9.5V16.5H12V12H8V16.5H3.5V9.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="text-ink/30">›</span>
          <Link href="/" className="hover:text-olive">
            Accueil
          </Link>
          <span className="text-ink/30">›</span>
          <span className="font-medium text-ink">Questionnaire</span>
        </nav>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[1.85rem] font-semibold leading-tight text-ink sm:text-4xl">
              Questionnaire bien-être
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
              Répondez à quelques questions pour recevoir des recommandations nutritionnelles personnalisées adaptées à vos besoins.
            </p>
          </div>
          <div className="relative h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]" aria-hidden>
            <Image src="/images/cta/clipboard.png" alt="" fill className="object-contain" sizes="72px" />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-[12px] font-semibold">
            <span className="text-ink">
              Étape {step} sur {TOTAL_STEPS}
            </span>
            <span className="text-olive">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-olive transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)]">
          <h2 className="text-[16px] font-bold text-ink">Quel est votre profil ?</h2>
          <p className="mt-1 text-[12px] text-muted">Sélectionnez votre situation actuelle.</p>
          <div className="mt-3 space-y-2.5">
            {profiles.map((item) => (
              <SelectCard
                key={item.id}
                selected={profile === item.id}
                label={item.label}
                icon={item.icon}
                onClick={() => setProfile(item.id)}
              />
            ))}
          </div>
        </section>

        {profile === "enceinte" && (
          <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)]">
            <h2 className="text-[16px] font-bold text-ink">À quel trimestre de grossesse êtes-vous ?</h2>
            <p className="mt-1 text-[12px] text-muted">Cette information nous aide à adapter nos recommandations.</p>
            <div className="mt-3 space-y-2.5">
              {trimesters.map((item) => (
                <SelectCard
                  key={item.id}
                  selected={trimester === item.id}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => setTrimester(item.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)]">
          <h2 className="text-[16px] font-bold text-ink">Quel est votre objectif principal ?</h2>
          <p className="mt-1 text-[12px] text-muted">Choisissez l&apos;objectif qui vous correspond le mieux.</p>
          <ul className="mt-3 space-y-2">
            {goals.map((item) => {
              const selected = goal === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                      selected ? "border-olive bg-olive/5" : "border-sand/70 bg-white hover:border-olive/40"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-olive bg-olive" : "border-sand"
                      }`}
                      aria-hidden
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <CardIcon type={item.icon} />
                    <span className="text-[13px] font-medium text-ink">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive px-6 py-3.5 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
        >
          SUIVANT
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

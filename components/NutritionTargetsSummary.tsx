import type { NutritionTargets } from "@/lib/nutrition/types";

const PATHWAY_LABELS: Record<string, string> = {
  adulte: "Profil adulte",
  adolescent: "Profil adolescent",
  enfant: "Profil enfant",
  "nourrisson/toddler": "Profil tout-petit",
  grossesse: "Profil grossesse",
  allaitement: "Profil allaitement",
};

type Props = {
  targets: Pick<
    NutritionTargets,
    "pathway" | "targetKcal" | "proteinG" | "carbsG" | "fatG"
  >;
  className?: string;
};

/** Plain-language daily targets so users understand kcal / P / G / L */
export function NutritionTargetsSummary({ targets, className = "" }: Props) {
  const profile = PATHWAY_LABELS[targets.pathway] ?? `Profil ${targets.pathway}`;

  return (
    <div className={`text-[13px] leading-relaxed text-muted ${className}`.trim()}>
      <p>
        {profile} · objectif ≈ <strong className="font-semibold text-ink">{targets.targetKcal} kcal</strong>{" "}
        par jour
      </p>
      <p className="mt-1">
        Protéines <strong className="font-medium text-ink">{targets.proteinG} g</strong>
        <span className="mx-1.5 text-ink/25" aria-hidden>
          ·
        </span>
        Glucides <strong className="font-medium text-ink">{targets.carbsG} g</strong>
        <span className="mx-1.5 text-ink/25" aria-hidden>
          ·
        </span>
        Lipides <strong className="font-medium text-ink">{targets.fatG} g</strong>
      </p>
      <p className="mt-1.5 text-[12px] text-muted/90">
        Cibles estimées d’après votre questionnaire : l’énergie (calories) et la répartition
        protéines / glucides / lipides pour équilibrer la journée.
      </p>
    </div>
  );
}

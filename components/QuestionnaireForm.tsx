"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { requestEmail } from "@/lib/email-client";
import {
  filterByIds,
  markQuestionnaireDone,
  needsGuardianRole,
  relevantAccompanimentIds,
  relevantAgeRangeIds,
  relevantBreakfastIds,
  relevantGoalIds,
  relevantHealthConditionIds,
  relevantMealPlaceIds,
  relevantWeightGoalIds,
  relevantWomenSituationIds,
  showChildPart,
  showPregnancyDetailQuestions,
  showWomenPart,
} from "@/lib/questionnaire";
import {
  accompanimentTypes,
  activityLevels,
  ageRanges,
  allergies,
  beneficiaries,
  breakfastHabits,
  childIssues,
  cookingTimes,
  cravingMoments,
  culturalConstraints,
  dietModes,
  digestionOptions,
  energyLevels,
  foodRefusals,
  fruitVegPlaces,
  guardianRoles,
  healthConditions,
  likedFoods,
  mainGoals,
  mealCounts,
  mealPlaces,
  MEDICAL_REMARK,
  periodOptions,
  pregnancyDetails,
  PROFILE_ORIENTATION,
  schoolInfluences,
  sexes,
  sleepStates,
  stressLevels,
  sweetProcessedFreqs,
  treatmentOptions,
  weightGoals,
  womenSituations,
} from "@/lib/questionnaire-options";

type StepId =
  | "profile"
  | "identity"
  | "body"
  | "goals"
  | "habits"
  | "prefs"
  | "digest"
  | "lifestyle"
  | "health"
  | "women"
  | "child"
  | "support";

const inputClass =
  "w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30";

function OptionButton({
  selected,
  label,
  onClick,
  multi = false,
  disabled = false,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  multi?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        selected ? "border-olive bg-olive/5" : "border-sand/70 bg-white hover:border-olive/40"
      } ${disabled ? "cursor-not-allowed opacity-50 hover:border-sand/70" : ""}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
          multi ? "rounded-[5px]" : "rounded-full"
        } ${selected ? "border-olive bg-olive" : "border-sand"}`}
        aria-hidden
      >
        {selected &&
          (multi ? (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <span className="h-2 w-2 rounded-full bg-white" />
          ))}
      </span>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </button>
  );
}

function PartHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      {description ? (
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{description}</p>
      ) : null}
    </section>
  );
}

function QuestionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
      <h3 className="text-[15px] font-bold text-ink">{title}</h3>
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

function toggleExclusive(
  current: string[],
  id: string,
  exclusiveIds: string[],
  max?: number
): string[] {
  if (current.includes(id)) return current.filter((item) => item !== id);
  if (exclusiveIds.includes(id)) return [id];
  const withoutExclusive = current.filter((item) => !exclusiveIds.includes(item));
  if (max && withoutExclusive.length >= max) return withoutExclusive;
  return [...withoutExclusive, id];
}

export function QuestionnaireForm({
  nextPath = null,
  planId = null,
}: {
  nextPath?: string | null;
  planId?: string | null;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const [beneficiary, setBeneficiary] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianRole, setGuardianRole] = useState("");

  const [heightCm, setHeightCm] = useState("");
  const [heightUnknown, setHeightUnknown] = useState(false);
  const [weightKg, setWeightKg] = useState("");
  const [weightUnknown, setWeightUnknown] = useState(false);
  const [weightGoal, setWeightGoal] = useState("");

  const [goals, setGoals] = useState<string[]>([]);
  const [mealCount, setMealCount] = useState("");
  const [breakfastHabit, setBreakfastHabit] = useState("");
  const [cravingMomentsSelected, setCravingMomentsSelected] = useState<string[]>([]);
  const [fruitVegPlace, setFruitVegPlace] = useState("");
  const [sweetProcessedFreq, setSweetProcessedFreq] = useState("");
  const [foodRefusal, setFoodRefusal] = useState<string[]>([]);

  const [dietMode, setDietMode] = useState("");
  const [dietModeOther, setDietModeOther] = useState("");
  const [allergiesSelected, setAllergiesSelected] = useState<string[]>([]);
  const [allergyOther, setAllergyOther] = useState("");
  const [likedFoodsSelected, setLikedFoodsSelected] = useState<string[]>([]);
  const [culturalConstraint, setCulturalConstraint] = useState("");
  const [culturalConstraintDetail, setCulturalConstraintDetail] = useState("");

  const [digestion, setDigestion] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState("");
  const [sleepState, setSleepState] = useState("");

  const [activityLevel, setActivityLevel] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [mealPlace, setMealPlace] = useState("");

  const [healthConditionsSelected, setHealthConditionsSelected] = useState<string[]>([]);
  const [healthOther, setHealthOther] = useState("");
  const [treatment, setTreatment] = useState("");
  const [treatmentDetail, setTreatmentDetail] = useState("");

  const [womenSituation, setWomenSituation] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [pregnancyDetail, setPregnancyDetail] = useState<string[]>([]);

  const [childIssuesSelected, setChildIssuesSelected] = useState<string[]>([]);
  const [schoolInfluence, setSchoolInfluence] = useState<string[]>([]);

  const [stressLevel, setStressLevel] = useState("");
  const [accompaniment, setAccompaniment] = useState<string[]>([]);
  const [freeNote, setFreeNote] = useState("");

  const profileReady = Boolean(beneficiary && ageRange);
  const profileCtx = { beneficiary, ageRange, sex };
  const showGuardian = needsGuardianRole(beneficiary, ageRange);
  const showWomen = showWomenPart(profileCtx);
  const showChild = showChildPart(profileCtx);
  const showPregnancyDetail = showPregnancyDetailQuestions(profileCtx);

  const visibleAgeRanges = useMemo(
    () => filterByIds(ageRanges, relevantAgeRangeIds(beneficiary)),
    [beneficiary]
  );
  const visibleWeightGoals = useMemo(
    () =>
      profileReady
        ? filterByIds(weightGoals, relevantWeightGoalIds(profileCtx))
        : [...weightGoals],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleGoals = useMemo(
    () =>
      profileReady ? filterByIds(mainGoals, relevantGoalIds(profileCtx)) : [...mainGoals],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleBreakfast = useMemo(
    () =>
      profileReady
        ? filterByIds(breakfastHabits, relevantBreakfastIds(profileCtx))
        : [...breakfastHabits],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleMealPlaces = useMemo(
    () =>
      profileReady
        ? filterByIds(mealPlaces, relevantMealPlaceIds(profileCtx))
        : [...mealPlaces],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleWomenSituations = useMemo(
    () =>
      profileReady
        ? filterByIds(womenSituations, relevantWomenSituationIds(profileCtx))
        : [...womenSituations],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleAccompaniment = useMemo(
    () =>
      profileReady
        ? filterByIds(accompanimentTypes, relevantAccompanimentIds(profileCtx))
        : [...accompanimentTypes],
    [beneficiary, ageRange, sex, profileReady]
  );
  const visibleHealthConditions = useMemo(
    () =>
      profileReady
        ? filterByIds(healthConditions, relevantHealthConditionIds(profileCtx))
        : [...healthConditions],
    [beneficiary, ageRange, sex, profileReady]
  );

  const steps = useMemo(() => {
    const list: StepId[] = [
      "profile",
      "identity",
      "body",
      "goals",
      "habits",
      "prefs",
      "digest",
      "lifestyle",
      "health",
    ];
    if (showWomen) list.push("women");
    if (showChild) list.push("child");
    list.push("support");
    return list;
  }, [showWomen, showChild]);

  const totalSteps = steps.length;
  const step = steps[Math.min(stepIndex, totalSteps - 1)] ?? "profile";
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [stepIndex]);

  useEffect(() => {
    setStepIndex((current) => Math.min(current, steps.length - 1));
  }, [steps.length]);

  // When profil change, drop answers that are no longer relevant
  useEffect(() => {
    if (!profileReady) return;
    const goalIds = relevantGoalIds(profileCtx);
    const weightIds = relevantWeightGoalIds(profileCtx);
    const breakfastIds = relevantBreakfastIds(profileCtx);
    const mealPlaceIds = relevantMealPlaceIds(profileCtx);
    const womenIds = relevantWomenSituationIds(profileCtx);
    const accompIds = relevantAccompanimentIds(profileCtx);
    const healthIds = relevantHealthConditionIds(profileCtx);

    setGoals((current) => current.filter((id) => goalIds.has(id)));
    setWeightGoal((current) => (current && !weightIds.has(current) ? "" : current));
    setBreakfastHabit((current) =>
      current && !breakfastIds.has(current) ? "" : current
    );
    setMealPlace((current) => (current && !mealPlaceIds.has(current) ? "" : current));
    setWomenSituation((current) => current.filter((id) => womenIds.has(id)));
    setAccompaniment((current) => current.filter((id) => accompIds.has(id)));
    setHealthConditionsSelected((current) => current.filter((id) => healthIds.has(id)));

    if (!showWomen) {
      setWomenSituation([]);
      setPeriods([]);
      setPregnancyDetail([]);
    }
    if (!showChild) {
      setChildIssuesSelected([]);
      setSchoolInfluence([]);
    }
    if (!showPregnancyDetail) {
      setPregnancyDetail((current) =>
        current.length === 0 ? current : ["non-concernee"]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prune when profile fields change
  }, [beneficiary, ageRange, sex]);

  function handleBeneficiaryChange(id: string) {
    setBeneficiary(id);
    if (id === "fille-ado") {
      setSex("fille-femme");
    }
    const allowedAges = relevantAgeRangeIds(id);
    if (allowedAges && ageRange && !allowedAges.has(ageRange)) {
      setAgeRange("");
    }
  }

  function toggleGoal(id: string) {
    setGoals((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  }

  function validateCurrent(): boolean {
    switch (step) {
      case "profile":
        if (!beneficiary) {
          setError("Merci d'indiquer qui souhaite bénéficier du bilan.");
          return false;
        }
        if (!ageRange) {
          setError("Merci de sélectionner l'âge de la personne concernée.");
          return false;
        }
        break;
      case "identity":
        if (!sex) {
          setError("Merci d'indiquer le sexe.");
          return false;
        }
        if (!name.trim() || !email.trim()) {
          setError("Merci de renseigner le nom et l'e-mail.");
          return false;
        }
        if (showGuardian && !guardianRole) {
          setError("Merci de préciser votre rôle (parent, tuteur…).");
          return false;
        }
        break;
      case "body":
        if (!heightUnknown && !heightCm.trim()) {
          setError("Merci d'indiquer la taille ou de sélectionner « Je ne connais pas encore ».");
          return false;
        }
        if (!weightUnknown && !weightKg.trim()) {
          setError("Merci d'indiquer le poids ou de sélectionner « Je ne connais pas encore ».");
          return false;
        }
        if (!weightGoal) {
          setError("Merci de sélectionner l'objectif principal concernant le poids / la croissance.");
          return false;
        }
        break;
      case "goals":
        if (goals.length === 0) {
          setError("Merci de sélectionner au moins un objectif (maximum 3).");
          return false;
        }
        break;
      case "habits":
        if (!mealCount || !breakfastHabit || cravingMomentsSelected.length === 0 || !fruitVegPlace || !sweetProcessedFreq || foodRefusal.length === 0) {
          setError("Merci de répondre à toutes les questions sur les habitudes alimentaires.");
          return false;
        }
        break;
      case "prefs":
        if (!dietMode || allergiesSelected.length === 0 || likedFoodsSelected.length === 0 || !culturalConstraint) {
          setError("Merci de répondre à toutes les questions sur les préférences et contraintes.");
          return false;
        }
        if (dietMode === "autre" && !dietModeOther.trim()) {
          setError("Merci de préciser le mode alimentaire.");
          return false;
        }
        if (allergiesSelected.includes("autre") && !allergyOther.trim()) {
          setError("Merci de préciser l'allergie ou l'éviction.");
          return false;
        }
        if (culturalConstraint === "oui" && !culturalConstraintDetail.trim()) {
          setError("Merci de préciser la contrainte à prendre en compte.");
          return false;
        }
        break;
      case "digest":
        if (digestion.length === 0 || !energyLevel || !sleepState) {
          setError("Merci de répondre aux questions sur la digestion, l'énergie et le sommeil.");
          return false;
        }
        break;
      case "lifestyle":
        if (!activityLevel || !cookingTime || !mealPlace) {
          setError("Merci de répondre aux questions sur l'activité et le rythme de vie.");
          return false;
        }
        break;
      case "health":
        if (healthConditionsSelected.length === 0 || !treatment) {
          setError("Merci de répondre aux questions de santé.");
          return false;
        }
        if (healthConditionsSelected.includes("autre") && !healthOther.trim()) {
          setError("Merci de préciser la condition de santé.");
          return false;
        }
        if (treatment === "oui" && !treatmentDetail.trim()) {
          setError("Merci de préciser le traitement ou complément.");
          return false;
        }
        break;
      case "women":
        if (womenSituation.length === 0 || periods.length === 0) {
          setError("Merci de répondre aux questions spécifiques filles & femmes.");
          return false;
        }
        if (showPregnancyDetail && pregnancyDetail.length === 0) {
          setError("Merci de préciser la situation grossesse / allaitement ou « Non concernée ».");
          return false;
        }
        break;
      case "child":
        if (childIssuesSelected.length === 0 || schoolInfluence.length === 0) {
          setError("Merci de répondre aux questions spécifiques enfant / adolescente.");
          return false;
        }
        break;
      case "support":
        if (!stressLevel || accompaniment.length === 0) {
          setError("Merci d'indiquer le niveau de stress et le type d'accompagnement souhaité.");
          return false;
        }
        break;
    }
    setError("");
    return true;
  }

  async function handleNext() {
    if (!validateCurrent()) return;

    if (stepIndex < totalSteps - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    const answers = {
      beneficiary,
      ageRange,
      sex,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      guardianRole: showGuardian ? guardianRole : undefined,
      heightCm: heightUnknown ? "unknown" : heightCm.trim(),
      weightKg: weightUnknown ? "unknown" : weightKg.trim(),
      weightGoal,
      goals,
      mealCount,
      breakfastHabit,
      cravingMoments: cravingMomentsSelected,
      fruitVegPlace,
      sweetProcessedFreq,
      foodRefusal,
      dietMode,
      dietModeOther: dietMode === "autre" ? dietModeOther.trim() : undefined,
      allergies: allergiesSelected,
      allergyOther: allergiesSelected.includes("autre") ? allergyOther.trim() : undefined,
      likedFoods: likedFoodsSelected,
      culturalConstraint,
      culturalConstraintDetail:
        culturalConstraint === "oui" ? culturalConstraintDetail.trim() : undefined,
      digestion,
      energyLevel,
      sleepState,
      activityLevel,
      cookingTime,
      mealPlace,
      healthConditions: healthConditionsSelected,
      healthOther: healthConditionsSelected.includes("autre") ? healthOther.trim() : undefined,
      treatment,
      treatmentDetail: treatment === "oui" ? treatmentDetail.trim() : undefined,
      womenSituation: showWomen ? womenSituation : undefined,
      periods: showWomen ? periods : undefined,
      pregnancyDetail: showWomen && showPregnancyDetail ? pregnancyDetail : undefined,
      childIssues: showChild ? childIssuesSelected : undefined,
      schoolInfluence: showChild ? schoolInfluence : undefined,
      stressLevel,
      accompaniment,
      freeNote: freeNote.trim() || undefined,
    };

    await markQuestionnaireDone(answers);
    await requestEmail("/api/email/questionnaire", answers);

    if (nextPath && nextPath.startsWith("/")) {
      const params = new URLSearchParams({ result: "1" });
      if (planId) params.set("plan", planId);
      router.push(`${nextPath}?${params.toString()}`);
      return;
    }
    router.push("/programmes?result=1");
  }

  function handleBack() {
    setError("");
    setStepIndex((current) => Math.max(0, current - 1));
  }

  return (
    <div className="bg-white pb-10 pt-4">
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-1.5 text-[12px] text-muted" aria-label="Fil d'Ariane">
          <Link href="/" className="inline-flex items-center text-olive hover:underline" aria-label="Accueil">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M3.5 9.5L10 4L16.5 9.5V16.5H12V12H8V16.5H3.5V9.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
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
              Questionnaire Diététique & Nutri-Profil
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              Un questionnaire simple et personnalisé pour les enfants, adolescentes, femmes et
              mamans. Commencez par indiquer qui est concerné(e) et l&apos;âge : seules les questions
              pertinentes s&apos;afficheront ensuite.
            </p>
          </div>
          <div className="relative h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]" aria-hidden>
            <Image src="/images/cta/clipboard.png" alt="" fill className="object-contain" sizes="72px" />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-[12px] font-semibold">
            <span className="text-ink">
              Étape {stepIndex + 1} sur {totalSteps}
            </span>
            <span className="text-olive">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream">
            <div className="h-full rounded-full bg-olive transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {step === "profile" && (
          <>
            <PartHeader
              title="PARTIE 0 — Qui souhaite bénéficier du bilan ?"
              description="Cette première étape permet d'adapter automatiquement les questions et les recommandations au profil."
            />
            <QuestionCard title="1. Le bilan concerne :">
              {beneficiaries.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={beneficiary === item.id}
                  label={item.label}
                  onClick={() => handleBeneficiaryChange(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="2. Âge de la personne concernée :">
              {(beneficiary ? visibleAgeRanges : ageRanges).map((item) => (
                <OptionButton
                  key={item.id}
                  selected={ageRange === item.id}
                  label={item.label}
                  onClick={() => setAgeRange(item.id)}
                />
              ))}
            </QuestionCard>
            {profileReady ? (
              <p className="mb-5 rounded-xl border border-olive/20 bg-olive/5 px-4 py-3 text-[12px] leading-relaxed text-ink/80">
                Profil détecté :{" "}
                <span className="font-semibold">
                  {beneficiary === "moi"
                    ? "Moi-même"
                    : beneficiary === "enfant"
                      ? "Mon enfant"
                      : beneficiary === "fille-ado"
                        ? "Ma fille / adolescente"
                        : "Un autre membre de ma famille"}
                  {" · "}
                  {ageRanges.find((a) => a.id === ageRange)?.label}
                </span>
                . Les prochaines questions seront adaptées à ce profil.
              </p>
            ) : null}
          </>
        )}

        {step === "identity" && (
          <>
            <PartHeader
              title="Coordonnées & profil"
              description="Ces informations personnalisent le bilan et permettent de vous recontacter."
            />
            <QuestionCard title="3. Sexe :">
              {sexes.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={sex === item.id}
                  label={item.label}
                  onClick={() => setSex(item.id)}
                />
              ))}
            </QuestionCard>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">4. Coordonnées</h3>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">Nom</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">E-mail</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">
                  Téléphone / WhatsApp <span className="font-normal text-muted">(optionnel)</span>
                </span>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </label>
            </section>
            {showGuardian && (
              <QuestionCard title="5. Pour un enfant ou une personne mineure, êtes-vous :">
                {guardianRoles.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={guardianRole === item.id}
                    label={item.label}
                    onClick={() => setGuardianRole(item.id)}
                  />
                ))}
              </QuestionCard>
            )}
          </>
        )}

        {step === "who" && null}

        {step === "body" && (
          <>
            <PartHeader
              title="PARTIE 1 — Données corporelles & évolution"
              description="Informations indicatives permettant d'adapter les recommandations au profil."
            />
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">6. Taille :</h3>
              <div className="mt-4 space-y-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Taille (cm)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={40}
                    max={250}
                    value={heightCm}
                    onFocus={() => setHeightUnknown(false)}
                    onChange={(e) => {
                      setHeightUnknown(false);
                      setHeightCm(e.target.value);
                    }}
                    className={inputClass}
                  />
                </label>
                <OptionButton
                  selected={heightUnknown}
                  label="Je ne connais pas encore"
                  onClick={() => {
                    setHeightUnknown(true);
                    setHeightCm("");
                  }}
                />
              </div>
            </section>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">7. Poids actuel :</h3>
              <div className="mt-4 space-y-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Poids (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={3}
                    max={300}
                    step="0.1"
                    value={weightKg}
                    onFocus={() => setWeightUnknown(false)}
                    onChange={(e) => {
                      setWeightUnknown(false);
                      setWeightKg(e.target.value);
                    }}
                    className={inputClass}
                  />
                </label>
                <OptionButton
                  selected={weightUnknown}
                  label="Je ne connais pas encore"
                  onClick={() => {
                    setWeightUnknown(true);
                    setWeightKg("");
                  }}
                />
              </div>
            </section>
            <QuestionCard title="8. Objectif ou besoin principal concernant le poids / la croissance :">
              {visibleWeightGoals.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={weightGoal === item.id}
                  label={item.label}
                  onClick={() => setWeightGoal(item.id)}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "goals" && (
          <>
            <PartHeader
              title="PARTIE 2 — Objectifs principaux"
              description="Choisissez jusqu'à 3 objectifs."
            />
            <QuestionCard title="9. Que souhaitez-vous améliorer en priorité ?">
              {visibleGoals.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={goals.includes(item.id)}
                  label={item.label}
                  disabled={!goals.includes(item.id) && goals.length >= 3}
                  onClick={() => toggleGoal(item.id)}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "habits" && (
          <>
            <PartHeader
              title="PARTIE 3 — Habitudes alimentaires"
              description="Identifier les habitudes réelles, sans jugement, afin de proposer un programme faisable."
            />
            <QuestionCard title="10. Combien de repas sont généralement pris par jour ?">
              {mealCounts.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={mealCount === item.id}
                  label={item.label}
                  onClick={() => setMealCount(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="11. Le petit-déjeuner est-il habituellement pris ?">
              {visibleBreakfast.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={breakfastHabit === item.id}
                  label={item.label}
                  onClick={() => setBreakfastHabit(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="12. À quels moments surviennent surtout les envies de grignotage ?">
              {cravingMoments.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={cravingMomentsSelected.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setCravingMomentsSelected((current) =>
                      toggleExclusive(current, item.id, ["peu"])
                    )
                  }
                />
              ))}
            </QuestionCard>
            <QuestionCard title="13. Quelle place occupent les fruits et légumes ?">
              {fruitVegPlaces.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={fruitVegPlace === item.id}
                  label={item.label}
                  onClick={() => setFruitVegPlace(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="14. Quelle est la fréquence des aliments très sucrés / ultra-transformés ?">
              {sweetProcessedFreqs.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={sweetProcessedFreq === item.id}
                  label={item.label}
                  onClick={() => setSweetProcessedFreq(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="15. Y a-t-il des aliments refusés ou difficiles à faire accepter ?">
              {foodRefusals.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={foodRefusal.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setFoodRefusal((current) => toggleExclusive(current, item.id, ["non"]))
                  }
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "prefs" && (
          <>
            <PartHeader title="PARTIE 4 — Préférences, allergies & contraintes alimentaires" />
            <QuestionCard title="16. Quel est le mode alimentaire actuel ?">
              {dietModes.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={dietMode === item.id}
                  label={item.label}
                  onClick={() => setDietMode(item.id)}
                />
              ))}
              {dietMode === "autre" && (
                <input
                  type="text"
                  value={dietModeOther}
                  onChange={(e) => setDietModeOther(e.target.value)}
                  placeholder="Précisez"
                  className={`${inputClass} mt-2`}
                />
              )}
            </QuestionCard>
            <QuestionCard title="17. Existe-t-il une allergie, intolérance ou éviction alimentaire connue ?">
              {allergies.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={allergiesSelected.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setAllergiesSelected((current) => toggleExclusive(current, item.id, ["aucune"]))
                  }
                />
              ))}
              {allergiesSelected.includes("autre") && (
                <input
                  type="text"
                  value={allergyOther}
                  onChange={(e) => setAllergyOther(e.target.value)}
                  placeholder="Précisez"
                  className={`${inputClass} mt-2`}
                />
              )}
            </QuestionCard>
            <QuestionCard title="18. Quels aliments sont particulièrement appréciés ?">
              {likedFoods.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={likedFoodsSelected.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setLikedFoodsSelected((current) =>
                      current.includes(item.id)
                        ? current.filter((x) => x !== item.id)
                        : [...current, item.id]
                    )
                  }
                />
              ))}
            </QuestionCard>
            <QuestionCard title="19. Y a-t-il des contraintes culturelles, familiales, scolaires ou professionnelles à prendre en compte ?">
              {culturalConstraints.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={culturalConstraint === item.id}
                  label={item.label}
                  onClick={() => setCulturalConstraint(item.id)}
                />
              ))}
              {culturalConstraint === "oui" && (
                <input
                  type="text"
                  value={culturalConstraintDetail}
                  onChange={(e) => setCulturalConstraintDetail(e.target.value)}
                  placeholder="Précisez"
                  className={`${inputClass} mt-2`}
                />
              )}
            </QuestionCard>
          </>
        )}

        {step === "digest" && (
          <>
            <PartHeader title="PARTIE 5 — Digestion, énergie & sommeil" />
            <QuestionCard title="20. Comment est la digestion ?">
              {digestionOptions.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={digestion.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setDigestion((current) => toggleExclusive(current, item.id, ["bonne"]))
                  }
                />
              ))}
            </QuestionCard>
            <QuestionCard title="21. Niveau d'énergie habituel :">
              {energyLevels.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={energyLevel === item.id}
                  label={item.label}
                  onClick={() => setEnergyLevel(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="22. Sommeil :">
              {sleepStates.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={sleepState === item.id}
                  label={item.label}
                  onClick={() => setSleepState(item.id)}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "lifestyle" && (
          <>
            <PartHeader title="PARTIE 6 — Activité physique & rythme de vie" />
            <QuestionCard title="23. Niveau d'activité physique :">
              {activityLevels.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={activityLevel === item.id}
                  label={item.label}
                  onClick={() => setActivityLevel(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="24. Temps disponible pour préparer les repas :">
              {cookingTimes.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={cookingTime === item.id}
                  label={item.label}
                  onClick={() => setCookingTime(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="25. Où les repas sont-ils principalement pris ?">
              {visibleMealPlaces.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={mealPlace === item.id}
                  label={item.label}
                  onClick={() => setMealPlace(item.id)}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "health" && (
          <>
            <PartHeader
              title="PARTIE 7 — Santé : uniquement si concerné(e)"
              description="Cette partie permet de repérer les éléments nécessitant une adaptation ou un avis médical. Elle ne remplace pas un diagnostic médical."
            />
            <QuestionCard title="26. Existe-t-il une condition de santé connue ?">
              {visibleHealthConditions.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={healthConditionsSelected.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setHealthConditionsSelected((current) =>
                      toggleExclusive(current, item.id, ["aucune"])
                    )
                  }
                />
              ))}
              {healthConditionsSelected.includes("autre") && (
                <input
                  type="text"
                  value={healthOther}
                  onChange={(e) => setHealthOther(e.target.value)}
                  placeholder="Précisez"
                  className={`${inputClass} mt-2`}
                />
              )}
            </QuestionCard>
            <QuestionCard title="27. Y a-t-il un traitement ou complément pris régulièrement ?">
              {treatmentOptions.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={treatment === item.id}
                  label={item.label}
                  onClick={() => setTreatment(item.id)}
                />
              ))}
              {treatment === "oui" && (
                <input
                  type="text"
                  value={treatmentDetail}
                  onChange={(e) => setTreatmentDetail(e.target.value)}
                  placeholder="Précisez"
                  className={`${inputClass} mt-2`}
                />
              )}
            </QuestionCard>
          </>
        )}

        {step === "women" && (
          <>
            <PartHeader
              title="PARTIE 8 — Questions spécifiques filles & femmes"
              description="À remplir uniquement si la personne concernée est une fille ou une femme."
            />
            <QuestionCard title="28. Situation actuelle :">
              {visibleWomenSituations.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={womenSituation.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setWomenSituation((current) =>
                      toggleExclusive(current, item.id, ["aucune", "non-concernee"])
                    )
                  }
                />
              ))}
            </QuestionCard>
            <QuestionCard title="29. Si vous avez vos règles, sont-elles :">
              {periodOptions.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={periods.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setPeriods((current) =>
                      toggleExclusive(current, item.id, ["non-concernee", "regulieres"])
                    )
                  }
                />
              ))}
            </QuestionCard>
            {showPregnancyDetail && (
              <QuestionCard title="30. Si vous êtes enceinte ou allaitez, précisez :">
                {pregnancyDetails.map((item) => (
                  <OptionButton
                    key={item.id}
                    multi
                    selected={pregnancyDetail.includes(item.id)}
                    label={item.label}
                    onClick={() =>
                      setPregnancyDetail((current) =>
                        toggleExclusive(current, item.id, ["non-concernee"])
                      )
                    }
                  />
                ))}
              </QuestionCard>
            )}
          </>
        )}

        {step === "child" && (
          <>
            <PartHeader
              title="PARTIE 9 — Enfant & adolescente : questions spécifiques"
              description="À remplir uniquement si le bilan concerne un enfant ou une adolescente."
            />
            <QuestionCard title="31. Concernant l'enfant / l'adolescente, y a-t-il :">
              {childIssues.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={childIssuesSelected.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setChildIssuesSelected((current) =>
                      toggleExclusive(current, item.id, ["aucun"])
                    )
                  }
                />
              ))}
            </QuestionCard>
            <QuestionCard title="32. Le rythme scolaire / activités influence-t-il les repas ?">
              {schoolInfluences.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={schoolInfluence.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setSchoolInfluence((current) => toggleExclusive(current, item.id, ["non"]))
                  }
                />
              ))}
            </QuestionCard>
          </>
        )}

        {step === "support" && (
          <>
            <PartHeader title="PARTIE 10 — Stress, environnement & accompagnement" />
            <QuestionCard title="33. Niveau de stress / charge mentale :">
              {stressLevels.map((item) => (
                <OptionButton
                  key={item.id}
                  selected={stressLevel === item.id}
                  label={item.label}
                  onClick={() => setStressLevel(item.id)}
                />
              ))}
            </QuestionCard>
            <QuestionCard title="34. Quel type d'accompagnement vous conviendrait le mieux ?">
              {visibleAccompaniment.map((item) => (
                <OptionButton
                  key={item.id}
                  multi
                  selected={accompaniment.includes(item.id)}
                  label={item.label}
                  onClick={() =>
                    setAccompaniment((current) =>
                      current.includes(item.id)
                        ? current.filter((x) => x !== item.id)
                        : [...current, item.id]
                    )
                  }
                />
              ))}
            </QuestionCard>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                35. Y a-t-il quelque chose d&apos;important que vous souhaitez nous préciser ?
              </h3>
              <textarea
                value={freeNote}
                onChange={(e) => setFreeNote(e.target.value)}
                rows={4}
                className={`${inputClass} mt-4 resize-y`}
                placeholder="Votre message (optionnel)"
              />
            </section>
            <div className="mb-6 space-y-3 rounded-2xl border border-olive/20 bg-olive/5 p-4 text-[12px] leading-relaxed text-ink/80">
              <p>{PROFILE_ORIENTATION}</p>
              <p className="text-muted">{MEDICAL_REMARK}</p>
            </div>
          </>
        )}

        {error ? <p className="mb-4 text-[13px] font-medium text-red-700">{error}</p> : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="rounded-full border border-sand px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-ink/80 transition-colors hover:border-olive/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            RETOUR
          </button>
          <button
            type="button"
            onClick={() => void handleNext()}
            className="rounded-full bg-olive px-6 py-3 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
          >
            {stepIndex === totalSteps - 1 ? "VOIR MON BILAN" : "CONTINUER"}
          </button>
        </div>
      </div>
    </div>
  );
}

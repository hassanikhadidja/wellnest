"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { requestEmail } from "@/lib/email-client";
import { markQuestionnaireDone } from "@/lib/questionnaire";

const TOTAL_STEPS = 7;

const inputClass =
  "w-full rounded-xl border border-sand bg-cream/40 px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-olive focus:ring-1 focus:ring-olive/30";

const ageRanges = [
  { id: "under-25", label: "Moins de 25 ans" },
  { id: "25-34", label: "25-34 ans" },
  { id: "35-44", label: "35-44 ans" },
  { id: "45-plus", label: "45 ans et plus" },
] as const;

const situations = [
  { id: "active", label: "Femme active (souhait de bilan global)" },
  { id: "projet-grossesse", label: "En projet de grossesse (désir d'enfant)" },
  { id: "enceinte", label: "Enceinte" },
  { id: "post-partum", label: "Jeune maman en post-partum (bébé a moins de 1 an)" },
  { id: "maman", label: "Maman d'enfant(s) (plus de 1 an)" },
  { id: "menopause", label: "En période de péri-ménopause / ménopause" },
] as const;

const maternityDetails = [
  { id: "enceinte-t1-t2", label: "Enceinte : 1er ou 2ème trimestre" },
  { id: "enceinte-t3", label: "Enceinte : 3ème trimestre" },
  { id: "allaitement-exclusif", label: "Allaitement exclusif au sein" },
  { id: "allaitement-mixte", label: "Allaitement mixte / Biberon" },
  { id: "non-concernee", label: "Pas d'allaitement / Non concernée" },
] as const;

const mainGoals = [
  { id: "energie", label: "Retrouver de l'énergie et éliminer la fatigue chronique" },
  { id: "poids", label: "Perdre du poids / Perdre le poids de grossesse" },
  { id: "digestion", label: "Retrouver un ventre plat et améliorer la digestion" },
  { id: "famille", label: "Équilibrer l'alimentation de toute la famille sans me prendre la tête" },
  { id: "sucre", label: "Gérer les fringales, le grignotage et la dépendance au sucre" },
  { id: "grossesse-allaitement", label: "Préparer mon corps à la grossesse / Soutenir l'allaitement" },
] as const;

const mealRhythms = [
  { id: "3-repas", label: "3 repas réguliers par jour" },
  { id: "saute-petit-dejeuner", label: "Je saute souvent le petit-déjeuner" },
  { id: "saute-dejeuner", label: "Je saute souvent le déjeuner ou mange sur le pouce" },
  { id: "anarchique", label: "Repas très anarchiques / Décalés selon les enfants ou le travail" },
] as const;

const cravingMoments = [
  { id: "matinee", label: "En milieu de matinée (10h-11h)" },
  { id: "apres-midi", label: "En fin d'après-midi / Au retour du travail (16h-18h)" },
  { id: "soir", label: "Le soir après le dîner ou devant la télévision" },
  { id: "aucune", label: "Pas d'envies particulières / Je ne grignote pas" },
] as const;

const vegetablePlaces = [
  { id: "chaque-repas", label: "À chaque repas (légumes crus/cuits + fruits)" },
  { id: "une-fois", label: "Une fois par jour seulement" },
  { id: "rares", label: "Très rares (moins de 2 fois par semaine)" },
] as const;

const dietTypes = [
  { id: "omnivore", label: "Aucun régime particulier (omnivore)" },
  { id: "vegetarienne", label: "Végétarienne / Flexitarienne" },
  { id: "sans-gluten-lactose", label: "Sans gluten et/ou Sans lactose" },
  { id: "hypocalorique", label: "Régime hypocalorique strict en cours ou récent" },
] as const;

const digestionLevels = [
  { id: "excellente", label: "Excellente, aucun souci" },
  { id: "ballonnements", label: "Ballonnements fréquents en fin de journée / Ventre gonflé" },
  { id: "transit-lent", label: "Transit lent (constipation) ou irrégulier" },
  { id: "lourdeur", label: "Sensation de lourdeur / Digestion très lente" },
] as const;

const energyLevels = [
  { id: "stable", label: "Stable du matin au soir" },
  { id: "coup-de-barre", label: "Gros coup de barre après le déjeuner ou vers 16h" },
  { id: "fatigue-reveil", label: "Fatiguée dès le réveil, même après une nuit de sommeil" },
  { id: "montagnes-russes", label: "Énergie en « montagnes russes »" },
] as const;

const waterIntakes = [
  { id: "moins-1l", label: "Moins d'1 litre par jour (j'oublie souvent de boire)" },
  { id: "1-1.5l", label: "Entre 1L et 1,5L par jour" },
  { id: "plus-1.5l", label: "Plus de 1,5L par jour" },
] as const;

const cookingTimes = [
  { id: "super-rapide", label: "Moins de 15-20 minutes (il me faut du super rapide)" },
  { id: "30-45", label: "30 à 45 minutes" },
  { id: "batch-cooking", label: "J'aime cuisiner et j'ai du temps le week-end (batch cooking)" },
] as const;

const stressLevels = [
  { id: "tres-eleve", label: "Très élevé (souvent débordée / stress intense)" },
  { id: "modere", label: "Modéré (gestion du quotidien parfois difficile)" },
  { id: "faible", label: "Faible / Sous contrôle" },
] as const;

const sleepStates = [
  { id: "bon", label: "Bon et réparateur" },
  { id: "perturbe", label: "Sommeil perturbé par les enfants / Réveils fréquents" },
  { id: "insomnies", label: "Difficultés à m'endormir / Insomnies (réflexion, stress)" },
] as const;

const contraceptionTypes = [
  { id: "pilule", label: "Pilule contraceptive œstroprogestative ou progestative" },
  { id: "sterilet-cuivre", label: "Stérilet en cuivre (non hormonal)" },
  { id: "sterilet-hormonal", label: "Stérilet hormonal (Mirena, Jaydess, etc.)" },
  { id: "implant-anneau-patch", label: "Implant / Anneau / Patch" },
  { id: "arret-pilule", label: "Arrêt récent de la pilule (moins de 12 mois)" },
  { id: "aucune", label: "Aucune contraception hormonale" },
] as const;

const postPillSymptoms = [
  { id: "amenorrhee", label: "Absence ou irrégularité des règles (aménorrhée / oligoménorrhée)" },
  { id: "acne", label: "Poussée d'acné ou peau plus grasse" },
  { id: "chute-cheveux", label: "Chute de cheveux inhabituelle" },
  { id: "humeur", label: "Sautes d'humeur / Anxiété accrue" },
  { id: "aucun", label: "Aucun symptôme particulier / Non concernée" },
] as const;

const hormonalTroubles = [
  { id: "sopk", label: "SOPK (Syndrome des Ovaires Polykystiques)" },
  { id: "endometriose", label: "Endométriose ou adénomyose" },
  { id: "thyroide", label: "Hypothyroïdie ou déséquilibre thyroïdien (Hashimoto...)" },
  { id: "insuline", label: "Résistance à l'insuline / Pré-diabète / Diabète gestationnel" },
  { id: "cycle", label: "Dérèglement du cycle (règles très douloureuses, très abondantes ou irrégulières)" },
  { id: "aucun", label: "Aucun trouble hormonal diagnostiqué" },
] as const;

const pmsSymptoms = [
  { id: "sucre-retention", label: "Fortes envies de sucre et rétention d'eau (gonflements)" },
  { id: "irritabilite", label: "Irritabilité, anxiété, baisse de moral" },
  { id: "douleurs-mammaires", label: "Douleurs mammaires (poitrine tendue/douloureuse)" },
  { id: "migraines", label: "Migraines ou maux de tête" },
  { id: "aucun", label: "Peu ou pas de symptômes prémenstruels" },
] as const;

const healthConditions = [
  { id: "anemie", label: "Anémie récurrente (carence en fer / ferritine basse)" },
  { id: "hypertension", label: "Hypertension artérielle" },
  { id: "cholesterol", label: "Cholestérol ou triglycérides élevés" },
  { id: "medicaments", label: "Prise de médicaments au quotidien (ex: Levothyrox, Metformine...)" },
  { id: "aucune", label: "Aucune condition particulière" },
] as const;

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

export function QuestionnaireForm({
  nextPath = null,
  planId = null,
}: {
  nextPath?: string | null;
  planId?: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [situation, setSituation] = useState("");
  const [maternityDetail, setMaternityDetail] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [mealRhythm, setMealRhythm] = useState("");
  const [cravingMoment, setCravingMoment] = useState("");
  const [vegetablePlace, setVegetablePlace] = useState("");
  const [dietType, setDietType] = useState("");
  const [digestion, setDigestion] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [sleepState, setSleepState] = useState("");
  const [contraception, setContraception] = useState("");
  const [postPillSymptom, setPostPillSymptom] = useState("");
  const [hormonalTrouble, setHormonalTrouble] = useState("");
  const [pmsSymptom, setPmsSymptom] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);
  const needsMaternityDetail = situation === "enceinte" || situation === "post-partum";

  function toggleGoal(id: string) {
    setGoals((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  }

  function validateStep1() {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Merci de renseigner votre prénom, nom et e-mail.");
      return false;
    }
    if (!heightCm.trim() || !weightKg.trim() || !targetWeightKg.trim()) {
      setError("Merci de renseigner votre taille, poids actuel et poids objectif.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep2() {
    if (!ageRange) {
      setError("Merci de sélectionner votre tranche d'âge.");
      return false;
    }
    if (!situation) {
      setError("Merci de sélectionner votre situation physiologique.");
      return false;
    }
    if (needsMaternityDetail && !maternityDetail) {
      setError("Merci de préciser votre situation de maternité.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep3() {
    if (goals.length === 0) {
      setError("Merci de sélectionner au moins un objectif prioritaire.");
      return false;
    }
    if (goals.length > 2) {
      setError("Merci de sélectionner maximum 2 objectifs.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep4() {
    if (!mealRhythm) {
      setError("Merci de sélectionner votre rythme de repas.");
      return false;
    }
    if (!cravingMoment) {
      setError("Merci de sélectionner le moment de vos envies de sucre ou grignotage.");
      return false;
    }
    if (!vegetablePlace) {
      setError("Merci d'indiquer la place des végétaux dans vos repas.");
      return false;
    }
    if (!dietType) {
      setError("Merci d'indiquer si vous suivez un régime particulier.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep5() {
    if (!digestion) {
      setError("Merci de qualifier votre digestion.");
      return false;
    }
    if (!energyLevel) {
      setError("Merci d'indiquer l'évolution de votre énergie.");
      return false;
    }
    if (!waterIntake) {
      setError("Merci d'indiquer votre consommation d'eau quotidienne.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep6() {
    if (!cookingTime) {
      setError("Merci d'indiquer le temps disponible pour cuisiner.");
      return false;
    }
    if (!stressLevel) {
      setError("Merci d'évaluer votre niveau de stress.");
      return false;
    }
    if (!sleepState) {
      setError("Merci d'indiquer l'état actuel de votre sommeil.");
      return false;
    }
    setError("");
    return true;
  }

  function validateStep7() {
    if (!contraception) {
      setError("Merci d'indiquer votre contraception actuelle ou récente.");
      return false;
    }
    if (!postPillSymptom) {
      setError("Merci de répondre à la question sur les symptômes post-pilule.");
      return false;
    }
    if (!hormonalTrouble) {
      setError("Merci d'indiquer si vous avez un trouble hormonal.");
      return false;
    }
    if (!pmsSymptom) {
      setError("Merci d'indiquer vos symptômes prémenstruels.");
      return false;
    }
    if (!healthCondition) {
      setError("Merci d'indiquer vos conditions de santé éventuelles.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    if (step === 5 && !validateStep5()) return;
    if (step === 6 && !validateStep6()) return;
    if (step === 7 && !validateStep7()) return;

    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      return;
    }

    const answers = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      heightCm: heightCm.trim(),
      weightKg: weightKg.trim(),
      targetWeightKg: targetWeightKg.trim(),
      ageRange,
      situation,
      maternityDetail: maternityDetail || undefined,
      goals,
      mealRhythm,
      cravingMoment,
      vegetablePlace,
      dietType,
      digestion,
      energyLevel,
      waterIntake,
      cookingTime,
      stressLevel,
      sleepState,
      contraception,
      postPillSymptom,
      hormonalTrouble,
      pmsSymptom,
      healthCondition,
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
    setStep((current) => Math.max(1, current - 1));
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
              Questionnaire Diététique & Analyse Nutri-Profil
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
              Répondez à ce questionnaire en 3 minutes pour obtenir votre bilan nutritionnel personnalisé et découvrir le programme le plus adapté à vos besoins et votre rythme de maman !
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

        {step === 1 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 0 : Identification & Coordonnées</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Personnaliser le bilan et pouvoir envoyer les résultats et le programme directement par e-mail ou WhatsApp.
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">1. Vos informations personnelles</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Prénom</span>
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prénom"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Nom</span>
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Votre nom"
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">Adresse e-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Pour recevoir votre bilan complet"
                  className={inputClass}
                />
                <span className="mt-1 block text-[11px] text-muted">Pour recevoir votre bilan complet</span>
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">
                  Numéro de téléphone / WhatsApp{" "}
                  <span className="font-normal text-muted">(optionnel)</span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Pour le suivi"
                  className={inputClass}
                />
                <span className="mt-1 block text-[11px] text-muted">Optionnel — pour le suivi</span>
              </label>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">2. Données morphologiques simples (indicatives)</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Taille (cm)</span>
                  <input
                    type="number"
                    name="heightCm"
                    inputMode="decimal"
                    min={100}
                    max={250}
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="cm"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Poids actuel (kg)</span>
                  <input
                    type="number"
                    name="weightKg"
                    inputMode="decimal"
                    min={30}
                    max={300}
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="kg"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-ink">Poids de forme / objectif (kg)</span>
                  <input
                    type="number"
                    name="targetWeightKg"
                    inputMode="decimal"
                    min={30}
                    max={300}
                    step="0.1"
                    required
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    placeholder="kg"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>
          </>
        )}

        {step === 2 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 1 : Profil & Situation Hormonale / Maternité</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Déterminer le cadre physiologique et les besoins caloriques/micronutritionnels de base.
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">1. Dans quelle tranche d&apos;âge vous situez-vous ?</h3>
              <div className="mt-3 space-y-2">
                {ageRanges.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={ageRange === item.id}
                    label={item.label}
                    onClick={() => setAgeRange(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">2. Quelle est votre situation physiologique actuelle ?</h3>
              <div className="mt-3 space-y-2">
                {situations.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={situation === item.id}
                    label={item.label}
                    onClick={() => {
                      setSituation(item.id);
                      if (item.id !== "enceinte" && item.id !== "post-partum") {
                        setMaternityDetail("");
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                3. Si vous êtes enceinte ou jeune maman, précisez votre situation
              </h3>
              <p className="mt-1 text-[12px] text-muted">
                {needsMaternityDetail
                  ? "Sélectionnez l'option qui vous correspond."
                  : "Optionnel si vous n'êtes pas concernée — vous pouvez choisir « Non concernée »."}
              </p>
              <div className="mt-3 space-y-2">
                {maternityDetails.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={maternityDetail === item.id}
                    label={item.label}
                    onClick={() => setMaternityDetail(item.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {step === 3 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 2 : Objectifs Principaux</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Cibler l&apos;offre ou le programme à recommander en priorité.
              </p>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">4. Quel est votre objectif prioritaire aujourd&apos;hui ?</h3>
              <p className="mt-1 text-[12px] text-muted">
                Maximum 2 choix — {goals.length}/2 sélectionné{goals.length > 1 ? "s" : ""}
              </p>
              <div className="mt-3 space-y-2">
                {mainGoals.map((item) => {
                  const selected = goals.includes(item.id);
                  return (
                    <OptionButton
                      key={item.id}
                      multi
                      selected={selected}
                      disabled={!selected && goals.length >= 2}
                      label={item.label}
                      onClick={() => toggleGoal(item.id)}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {step === 4 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 3 : Analyse des Habitudes Alimentaires & Pulsions</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Identifier les erreurs nutritionnelles majeures et la qualité de l&apos;assiette.
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">5. Quel est votre rythme de repas habituel ?</h3>
              <div className="mt-3 space-y-2">
                {mealRhythms.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={mealRhythm === item.id}
                    label={item.label}
                    onClick={() => setMealRhythm(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                6. À quel moment de la journée ressentez-vous le plus d&apos;envies de sucre ou de grignotage ?
              </h3>
              <div className="mt-3 space-y-2">
                {cravingMoments.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={cravingMoment === item.id}
                    label={item.label}
                    onClick={() => setCravingMoment(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">7. Quelle place occupent les végétaux dans vos repas ?</h3>
              <div className="mt-3 space-y-2">
                {vegetablePlaces.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={vegetablePlace === item.id}
                    label={item.label}
                    onClick={() => setVegetablePlace(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                8. Suivez-vous un régime particulier ou avez-vous des évictions ?
              </h3>
              <div className="mt-3 space-y-2">
                {dietTypes.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={dietType === item.id}
                    label={item.label}
                    onClick={() => setDietType(item.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {step === 5 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 4 : Métabolisme, Digestion & Énergie</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Détecter les déséquilibres microbiotiques, la glycémie ou les carences.
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">9. Comment qualifiez-vous votre digestion au quotidien ?</h3>
              <div className="mt-3 space-y-2">
                {digestionLevels.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={digestion === item.id}
                    label={item.label}
                    onClick={() => setDigestion(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                10. Comment évolue votre niveau d&apos;énergie dans la journée ?
              </h3>
              <div className="mt-3 space-y-2">
                {energyLevels.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={energyLevel === item.id}
                    label={item.label}
                    onClick={() => setEnergyLevel(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">11. Quelle est votre consommation d&apos;eau quotidienne ?</h3>
              <div className="mt-3 space-y-2">
                {waterIntakes.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={waterIntake === item.id}
                    label={item.label}
                    onClick={() => setWaterIntake(item.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {step === 6 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 5 : Mode de vie, Stress & Temps disponible</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Adapter le programme à la faisabilité réelle (recettes express, batch cooking, etc.).
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                12. Combien de temps pouvez-vous accorder à la préparation des repas par jour ?
              </h3>
              <div className="mt-3 space-y-2">
                {cookingTimes.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={cookingTime === item.id}
                    label={item.label}
                    onClick={() => setCookingTime(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                13. Comment évaluez-vous votre niveau de stress et de charge mentale ?
              </h3>
              <div className="mt-3 space-y-2">
                {stressLevels.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={stressLevel === item.id}
                    label={item.label}
                    onClick={() => setStressLevel(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">14. Quel est l&apos;état actuel de votre sommeil ?</h3>
              <div className="mt-3 space-y-2">
                {sleepStates.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={sleepState === item.id}
                    label={item.label}
                    onClick={() => setSleepState(item.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {step === 7 && (
          <>
            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h2 className="text-[16px] font-bold text-ink">PARTIE 6 : État de Santé, Hormones & Contraception</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Objectif : Détecter les blocages hormonaux et adapter les recommandations micronutritionnelles.
              </p>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                15. Quelle est votre contraception actuelle (ou récente) ?
              </h3>
              <div className="mt-3 space-y-2">
                {contraceptionTypes.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={contraception === item.id}
                    label={item.label}
                    onClick={() => setContraception(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                16. Si vous avez arrêté la pilule récemment, observez-vous l&apos;un de ces symptômes ? (Post-pilule)
              </h3>
              <div className="mt-3 space-y-2">
                {postPillSymptoms.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={postPillSymptom === item.id}
                    label={item.label}
                    onClick={() => setPostPillSymptom(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                17. Avez-vous été diagnostiquée ou suspectez-vous l&apos;un des troubles hormonaux suivants ?
              </h3>
              <div className="mt-3 space-y-2">
                {hormonalTroubles.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={hormonalTrouble === item.id}
                    label={item.label}
                    onClick={() => setHormonalTrouble(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-5 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                18. Ressentez-vous des symptômes liés au Syndrome Prémenstruel (SPM) avant vos règles ?
              </h3>
              <div className="mt-3 space-y-2">
                {pmsSymptoms.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={pmsSymptom === item.id}
                    label={item.label}
                    onClick={() => setPmsSymptom(item.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-sand/70 bg-white p-4 shadow-[0_2px_12px_rgba(44,42,38,0.04)] sm:p-5">
              <h3 className="text-[15px] font-bold text-ink">
                19. Avez-vous d&apos;autres conditions de santé ou prises en charge médicales à déclarer ?
              </h3>
              <div className="mt-3 space-y-2">
                {healthConditions.map((item) => (
                  <OptionButton
                    key={item.id}
                    selected={healthCondition === item.id}
                    label={item.label}
                    onClick={() => setHealthCondition(item.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {error && <p className="mb-3 text-[12px] font-medium text-red-700">{error}</p>}

        <div className="flex flex-col gap-2.5 sm:flex-row">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sand bg-white px-6 py-3.5 text-[12px] font-bold tracking-[0.06em] text-ink transition-colors hover:border-olive/40 sm:w-auto sm:min-w-[140px]"
            >
              <span aria-hidden>←</span>
              RETOUR
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-full bg-olive px-6 py-3.5 text-[12px] font-bold tracking-[0.06em] text-white transition-colors hover:bg-olive-dark"
          >
            {step === TOTAL_STEPS ? "TERMINER" : "SUIVANT"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  escapeHtml,
  isValidEmail,
  sendTemplateEmail,
} from "@/lib/mail";
import { generateNutritionPackage } from "@/lib/nutrition";
import { buildAdminPlansHtml } from "@/lib/nutrition/admin-html";
import type { QuestionnaireAnswers } from "@/lib/questionnaire";

type QuestionnaireBody = Record<string, unknown>;

const LABELS: { key: string; label: string }[] = [
  { key: "beneficiary", label: "Le bilan concerne" },
  { key: "ageRange", label: "Âge" },
  { key: "sex", label: "Sexe" },
  { key: "name", label: "Nom" },
  { key: "guardianRole", label: "Rôle (mineur)" },
  { key: "heightCm", label: "Taille (cm)" },
  { key: "weightKg", label: "Poids (kg)" },
  { key: "weightGoal", label: "Objectif poids / croissance" },
  { key: "goals", label: "Objectifs prioritaires" },
  { key: "mealCount", label: "Nombre de repas" },
  { key: "breakfastHabit", label: "Petit-déjeuner" },
  { key: "cravingMoments", label: "Moments de grignotage" },
  { key: "fruitVegPlace", label: "Fruits & légumes" },
  { key: "sweetProcessedFreq", label: "Aliments sucrés / ultra-transformés" },
  { key: "foodRefusal", label: "Aliments refusés" },
  { key: "dietMode", label: "Mode alimentaire" },
  { key: "dietModeOther", label: "Mode alimentaire (autre)" },
  { key: "allergies", label: "Allergies / évictions" },
  { key: "allergyOther", label: "Allergie (autre)" },
  { key: "likedFoods", label: "Aliments appréciés" },
  { key: "culturalConstraint", label: "Contraintes culturelles / familiales" },
  { key: "culturalConstraintDetail", label: "Détail contrainte" },
  { key: "digestion", label: "Digestion" },
  { key: "energyLevel", label: "Niveau d'énergie" },
  { key: "sleepState", label: "Sommeil" },
  { key: "activityLevel", label: "Activité physique" },
  { key: "cookingTime", label: "Temps de préparation" },
  { key: "mealPlace", label: "Lieu des repas" },
  { key: "foodBudget", label: "Budget alimentaire hebdomadaire" },
  { key: "healthConditions", label: "Conditions de santé" },
  { key: "healthOther", label: "Santé (autre)" },
  { key: "treatment", label: "Traitement / complément" },
  { key: "treatmentDetail", label: "Détail traitement" },
  { key: "womenSituation", label: "Situation filles & femmes" },
  { key: "periods", label: "Règles" },
  { key: "pregnancyDetail", label: "Grossesse / allaitement" },
  { key: "childIssues", label: "Enjeux enfant / ado" },
  { key: "schoolInfluence", label: "Rythme scolaire" },
  { key: "stressLevel", label: "Niveau de stress" },
  { key: "accompaniment", label: "Type d'accompagnement" },
  { key: "freeNote", label: "Précision libre" },
];

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value == null || value === "") return "—";
  return String(value);
}

function buildAnswersHtml(body: QuestionnaireBody): string {
  const rows = LABELS.map(({ key, label }) => {
    const raw = body[key];
    if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) {
      return "";
    }
    const value = escapeHtml(formatValue(raw));
    return `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#8A857C;width:42%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;vertical-align:top;">${value}</td>
    </tr>`;
  })
    .filter(Boolean)
    .join("");

  return `<table width="100%" style="border-collapse:collapse;font-size:13px;">${rows}</table>`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuestionnaireBody;

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim() || "—";

    if (!name || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Nom et email valides requis." },
        { status: 400 }
      );
    }

    let plansHtml = "";
    try {
      const pkg = generateNutritionPackage(body as unknown as QuestionnaireAnswers);
      plansHtml = buildAdminPlansHtml(pkg);
    } catch (planErr) {
      console.error("Nutrition plan generation error:", planErr);
      plansHtml =
        "<p style='color:#a15c2d;font-size:13px;'>Échec de génération automatique des plans 30/90 jours — vérifier les réponses.</p>";
    }

    const answersHtml = `${buildAnswersHtml(body)}${plansHtml}`;

    await Promise.all([
      sendTemplateEmail({
        templateId: "questionnaire-confirm",
        to: email,
        params: {
          to_email: email,
          first_name: name,
          last_name: "",
          email,
        },
      }),
      sendTemplateEmail({
        templateId: "questionnaire-notify",
        to: ADMIN_EMAIL,
        params: {
          to_email: ADMIN_EMAIL,
          first_name: name,
          last_name: "",
          email,
          phone,
          answers_html: answersHtml,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Questionnaire email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec d'envoi." },
      { status: 500 }
    );
  }
}

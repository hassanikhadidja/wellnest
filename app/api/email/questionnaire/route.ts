import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  escapeHtml,
  isValidEmail,
  sendTemplateEmail,
} from "@/lib/mail";

type QuestionnaireBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  heightCm?: string;
  weightKg?: string;
  targetWeightKg?: string;
  ageRange?: string;
  situation?: string;
  maternityDetail?: string;
  goals?: string[];
  mealRhythm?: string;
  cravingMoment?: string;
  vegetablePlace?: string;
  dietType?: string;
  digestion?: string;
  energyLevel?: string;
  waterIntake?: string;
  cookingTime?: string;
  stressLevel?: string;
  sleepState?: string;
  contraception?: string;
  postPillSymptom?: string;
  hormonalTrouble?: string;
  pmsSymptom?: string;
  healthCondition?: string;
};

const LABELS: { key: keyof QuestionnaireBody; label: string }[] = [
  { key: "heightCm", label: "Taille (cm)" },
  { key: "weightKg", label: "Poids (kg)" },
  { key: "targetWeightKg", label: "Poids cible (kg)" },
  { key: "ageRange", label: "Tranche d'âge" },
  { key: "situation", label: "Situation" },
  { key: "maternityDetail", label: "Détail maternité" },
  { key: "goals", label: "Objectifs" },
  { key: "mealRhythm", label: "Rythme des repas" },
  { key: "cravingMoment", label: "Moment des envies" },
  { key: "vegetablePlace", label: "Place des légumes" },
  { key: "dietType", label: "Type d'alimentation" },
  { key: "digestion", label: "Digestion" },
  { key: "energyLevel", label: "Niveau d'énergie" },
  { key: "waterIntake", label: "Hydratation" },
  { key: "cookingTime", label: "Temps de cuisine" },
  { key: "stressLevel", label: "Niveau de stress" },
  { key: "sleepState", label: "Sommeil" },
  { key: "contraception", label: "Contraception" },
  { key: "postPillSymptom", label: "Symptôme post-pilule" },
  { key: "hormonalTrouble", label: "Trouble hormonal" },
  { key: "pmsSymptom", label: "Symptôme SPM" },
  { key: "healthCondition", label: "Condition de santé" },
];

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value == null || value === "") return "—";
  return String(value);
}

function buildAnswersHtml(body: QuestionnaireBody): string {
  const rows = LABELS.map(({ key, label }) => {
    const value = escapeHtml(formatValue(body[key]));
    return `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#8A857C;width:42%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;vertical-align:top;">${value}</td>
    </tr>`;
  }).join("");

  return `<table width="100%" style="border-collapse:collapse;font-size:13px;">${rows}</table>`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuestionnaireBody;

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() || "—";

    if (!firstName || !lastName || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Nom, prénom et email valides requis." },
        { status: 400 }
      );
    }

    const answersHtml = buildAnswersHtml(body);

    await Promise.all([
      sendTemplateEmail({
        templateId: "questionnaire-confirm",
        to: email,
        params: {
          to_email: email,
          first_name: firstName,
          last_name: lastName,
          email,
        },
      }),
      sendTemplateEmail({
        templateId: "questionnaire-notify",
        to: ADMIN_EMAIL,
        params: {
          to_email: ADMIN_EMAIL,
          first_name: firstName,
          last_name: lastName,
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

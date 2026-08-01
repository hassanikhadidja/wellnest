import { api } from "@/lib/api";

const STORAGE_KEY = "wellnest-questionnaire-done";
const ANSWERS_KEY = "wellnest-questionnaire-answers";

export type QuestionnaireAnswers = {
  profile: string;
  trimester?: string;
  goal: string;
  completedAt: string;
};

export function isQuestionnaireDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export async function markQuestionnaireDone(
  answers?: Omit<QuestionnaireAnswers, "completedAt">
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
    if (answers) {
      const payload: QuestionnaireAnswers = {
        ...answers,
        completedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(payload));
      try {
        await api("/questionnaire", {
          method: "POST",
          auth: true,
          body: answers,
        });
      } catch {
        // keep local completion even if API is unavailable
      }
    }
  } catch {
    // ignore quota / private mode
  }
}

export function getQuestionnaireAnswers(): QuestionnaireAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuestionnaireAnswers;
  } catch {
    return null;
  }
}

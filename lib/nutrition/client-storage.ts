import type { ClientNutritionPackage } from "@/lib/nutrition";

const PLAN_KEY = "wellnest-nutrition-plan";

export function saveClientNutritionPlan(plan: ClientNutritionPackage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  } catch {
    // ignore
  }
}

export function getClientNutritionPlan(): ClientNutritionPackage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClientNutritionPackage;
  } catch {
    return null;
  }
}

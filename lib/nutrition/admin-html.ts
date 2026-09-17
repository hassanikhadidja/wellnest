import { escapeHtml } from "@/lib/mail";
import type { NutritionPackage } from "@/lib/nutrition/types";

function mealsRowsHtml(days: NutritionPackage["plan30"], limit?: number) {
  const list = typeof limit === "number" ? days.slice(0, limit) : days;
  return list
    .map((day) => {
      const meals = day.meals
        .map(
          (m) =>
            `${escapeHtml(m.slot)}: ${escapeHtml(m.nameFr)} (${m.portionG} g, ${m.kcal} kcal)`
        )
        .join("<br/>");
      return `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #eee;vertical-align:top;width:70px;">${escapeHtml(day.label)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;vertical-align:top;">${meals}<div style="color:#8A857C;font-size:12px;margin-top:4px;">Total ~${day.totalKcal} kcal / cible ${day.targetKcal}</div></td>
      </tr>`;
    })
    .join("");
}

function shoppingHtml(items: NutritionPackage["shopping30"]) {
  return items
    .slice(0, 80)
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 0;border-bottom:1px solid #f0f0f0;">${escapeHtml(item.category)}</td>
          <td style="padding:4px 0;border-bottom:1px solid #f0f0f0;">${escapeHtml(item.name)}</td>
          <td style="padding:4px 0;border-bottom:1px solid #f0f0f0;">${escapeHtml(item.quantityLabel)}</td>
        </tr>`
    )
    .join("");
}

export function buildAdminPlansHtml(pkg: NutritionPackage): string {
  const t = pkg.targets;
  return `
  <div style="margin-top:18px;padding-top:12px;border-top:1px solid #ddd;">
    <h3 style="margin:0 0 8px;font-size:15px;">Cibles nutritionnelles calculées</h3>
    <p style="margin:0 0 8px;font-size:13px;color:#555;">
      Voie : <strong>${escapeHtml(t.pathway)}</strong> · Objectif : <strong>${escapeHtml(t.goal)}</strong><br/>
      EER ~${t.eerKcal} kcal · Cible ~${t.targetKcal} kcal · P ${t.proteinG}g · G ${t.carbsG}g · L ${t.fatG}g<br/>
      Fibres ~${t.fiberG}g · Eau ~${t.waterMl} ml
    </p>
    ${
      t.profileNotes.length
        ? `<p style="font-size:12px;color:#8A857C;">${t.profileNotes.map(escapeHtml).join(" · ")}</p>`
        : ""
    }
    ${
      t.clinicalFlags.length
        ? `<p style="font-size:12px;color:#a15c2d;"><strong>Alertes :</strong> ${t.clinicalFlags.map(escapeHtml).join(" · ")}</p>`
        : ""
    }

    <h3 style="margin:16px 0 8px;font-size:15px;">Plan 30 jours</h3>
    <table width="100%" style="border-collapse:collapse;font-size:12px;">${mealsRowsHtml(pkg.plan30)}</table>

    <h3 style="margin:16px 0 8px;font-size:15px;">Liste de courses — 30 jours</h3>
    <table width="100%" style="border-collapse:collapse;font-size:12px;">
      <tr><td style="color:#8A857C;">Catégorie</td><td style="color:#8A857C;">Article</td><td style="color:#8A857C;">Quantité</td></tr>
      ${shoppingHtml(pkg.shopping30)}
    </table>

    <h3 style="margin:16px 0 8px;font-size:15px;">Plan 90 jours (aperçu jours 1–14)</h3>
    <p style="font-size:12px;color:#555;">Rotation générée sur 90 jours (${pkg.plan90.length} jours). Courses 90 jours : ${pkg.shopping90.length} lignes.</p>
    <table width="100%" style="border-collapse:collapse;font-size:12px;">${mealsRowsHtml(pkg.plan90, 14)}</table>

    <h3 style="margin:16px 0 8px;font-size:15px;">Liste de courses — 90 jours (extrait)</h3>
    <table width="100%" style="border-collapse:collapse;font-size:12px;">
      <tr><td style="color:#8A857C;">Catégorie</td><td style="color:#8A857C;">Article</td><td style="color:#8A857C;">Quantité</td></tr>
      ${shoppingHtml(pkg.shopping90)}
    </table>
  </div>`;
}

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const outDir = path.join("data", "nutrition");
fs.mkdirSync(outDir, { recursive: true });

const wb = XLSX.readFile("tableau_petits_dejeuners_nutrition.xlsx");
const rows = XLSX.utils.sheet_to_json(wb.Sheets["Petits-déjeuners"], { defval: "" });

function parseWeight(text) {
  const raw = String(text || "");
  const m = raw.match(/(\d+(?:[.,]\d+)?)\s*g/i);
  if (m) return Math.round(Number(m[1].replace(",", ".")));
  return 200;
}

function parseLines(composition) {
  return String(composition || "")
    .split(/\s*\+\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const qtyMatch = part.match(/(\d+(?:[.,]\d+)?)\s*(g|ml|œufs?|oeufs?)/i);
      let quantity = "1 portion";
      let name = part;
      if (qtyMatch) {
        const n = qtyMatch[1].replace(",", ".");
        const unit = qtyMatch[2].toLowerCase();
        quantity = `${n} ${unit}`;
        name = part.replace(qtyMatch[0], "").replace(/[()≈~]/g, "").trim() || part;
      } else if (/œufs?|oeufs?/i.test(part)) {
        const n = part.match(/(\d+)/);
        quantity = n ? `${n[1]} œufs` : "2 œufs";
        name = "Œufs";
      }
      name = name.replace(/^[,:\-\s]+|[,:\-\s]+$/g, "").trim() || part;
      return { name, quantity };
    });
}

const breakfasts = rows
  .map((r, index) => {
    const name = String(r["Idée de petit-déjeuner"] || "").trim();
    const composition = String(r["Composition / portions estimées"] || "").trim();
    if (!name) return null;
    return {
      id: `BF-${String(index + 1).padStart(3, "0")}`,
      nameFr: name,
      composition,
      portionG: parseWeight(r["Poids portion (approx.)"]),
      kcalServing: Number(r["Énergie (kcal/portion)"]) || 0,
      protein: Number(r["Protéines (g/portion)"]) || 0,
      carbs: Number(r["Glucides (g/portion)"]) || 0,
      fat: Number(r["Lipides (g/portion)"]) || 0,
      fiber: Number(r["Fibres (g/portion)"]) || 0,
      lines: parseLines(composition),
    };
  })
  .filter(Boolean);

fs.writeFileSync(path.join(outDir, "breakfasts.json"), JSON.stringify(breakfasts, null, 2));
console.log("exported", breakfasts.length, "breakfasts");

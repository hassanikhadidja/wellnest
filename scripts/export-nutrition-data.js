const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const outDir = path.join("data", "nutrition");
fs.mkdirSync(outDir, { recursive: true });

const mealsWb = XLSX.readFile("WELLNEST_Algerian_Meal_Database_With_Calories.xlsx");
const mealRows = XLSX.utils.sheet_to_json(mealsWb.Sheets["Algerian Meals"], { defval: "" });

const meals = mealRows
  .map((r) => ({
    id: String(r["Recipe ID"] || "").trim(),
    category: String(r.Category || "").trim(),
    nameFr: String(r["French Name"] || "").trim(),
    nameAr: String(r["Arabic Name"] || "").trim(),
    mealSlot: String(r["Meal Slot"] || "").trim(),
    sweetSavory: String(r["Sweet/Savoury"] || "").trim(),
    portionG: Number(r["Reference Portion g"]) || 0,
    kcalServing: Number(r["Estimated kcal / serving"]) || 0,
    kcalPer100g: Number(r["Estimated kcal / 100 g"]) || 0,
  }))
  .filter((m) => m.id && m.nameFr && m.kcalServing > 0);

const foodWb = XLSX.readFile("WELLNEST_Master_Food_Database_v2.xlsx");
const foodRows = XLSX.utils.sheet_to_json(foodWb.Sheets["Food Database"], { defval: "" });

const foods = foodRows
  .map((r) => ({
    category: String(r.Category || r["Food Group"] || "").trim(),
    name: String(r.Food || "").trim(),
    nameFr: String(r["French Name"] || r.Food || "").trim(),
    form: String(r["Form / variant"] || r["Raw/Cooked"] || "").trim(),
    kcal100: Number(r["kcal/100g"]) || 0,
    protein: Number(r["Protein g"]) || 0,
    carbs: Number(r["Carbohydrate g"]) || 0,
    fat: Number(r["Fat g"]) || 0,
    fiber: Number(r["Fiber g"]) || 0,
    allergen: String(r["Allergen Tag"] || "").trim(),
    vegetarian: String(r["Vegetarian Tag"] || "").trim().toLowerCase() === "yes",
    vegan: String(r["Vegan Tag"] || "").trim().toLowerCase() === "yes",
    tags: {
      diabetes: String(r["Diabetes Tag"] || "").trim(),
      weightLoss: String(r["Weight-Loss Tag"] || "").trim(),
      pregnancy: String(r["Pregnancy Tag"] || "").trim(),
      child: String(r["Child Tag"] || "").trim(),
      highProtein: String(r["High-Protein Tag"] || "").trim().toLowerCase() === "yes",
      highFiber: String(r["High-Fiber Tag"] || "").trim().toLowerCase() === "yes",
    },
  }))
  .filter((f) => f.name && f.kcal100 > 0);

fs.writeFileSync(path.join(outDir, "meals.json"), JSON.stringify(meals, null, 2));
fs.writeFileSync(path.join(outDir, "foods.json"), JSON.stringify(foods, null, 2));

const slots = {};
for (const m of meals) slots[m.mealSlot] = (slots[m.mealSlot] || 0) + 1;
console.log("meals", meals.length, "foods", foods.length);
console.log("slots", slots);
console.log("wrote", outDir);

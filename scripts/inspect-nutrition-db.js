const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function sheetToJson(file, sheetName) {
  const wb = XLSX.readFile(file);
  const name = sheetName || wb.SheetNames[0];
  const sheet = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return { sheetNames: wb.SheetNames, rows, sample: rows.slice(0, 3) };
}

const mealsFile = "WELLNEST_Algerian_Meal_Database_With_Calories.xlsx";
const foodFile = "WELLNEST_Master_Food_Database_v2.xlsx";

const mealsWb = XLSX.readFile(mealsFile);
console.log("MEALS sheets:", mealsWb.SheetNames);
for (const name of mealsWb.SheetNames.slice(0, 4)) {
  const rows = XLSX.utils.sheet_to_json(mealsWb.Sheets[name], { defval: "" });
  console.log(`\n=== ${name} (${rows.length}) ===`);
  console.log("keys:", rows[0] ? Object.keys(rows[0]) : []);
  console.log(JSON.stringify(rows.slice(0, 2), null, 2).slice(0, 1500));
}

const foodWb = XLSX.readFile(foodFile);
console.log("\nFOOD sheets:", foodWb.SheetNames);
for (const name of foodWb.SheetNames.slice(0, 5)) {
  const rows = XLSX.utils.sheet_to_json(foodWb.Sheets[name], { defval: "" });
  console.log(`\n=== ${name} (${rows.length}) ===`);
  console.log("keys:", rows[0] ? Object.keys(rows[0]) : []);
  console.log(JSON.stringify(rows.slice(0, 2), null, 2).slice(0, 1500));
}

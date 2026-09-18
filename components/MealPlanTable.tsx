import type { DayPlan, PlannedMeal, ShoppingItem } from "@/lib/nutrition/types";

const SLOTS: PlannedMeal["slot"][] = [
  "Petit-déjeuner",
  "Déjeuner",
  "Dîner",
  "Collation",
];

function mealCellContent(meal: PlannedMeal | undefined) {
  if (!meal) {
    return <span className="text-muted/70">—</span>;
  }
  const lines = meal.lines?.length
    ? meal.lines
    : [{ name: meal.nameFr, quantity: `${meal.portionG} g` }];

  return (
    <div className="space-y-1 text-left text-[12px] leading-snug text-ink sm:text-[13px]">
      {lines.map((line, index) => (
        <p key={`${line.name}-${index}`}>
          {index > 0 ? <span className="text-olive">+ </span> : null}
          {line.name}{" "}
          <span className="text-ink/70">
            ({line.quantity})
          </span>
        </p>
      ))}
      {meal.alternatives.length > 0 ? (
        <p className="pt-1 text-[11px] text-muted">
          Alt. : {meal.alternatives[0]}
        </p>
      ) : null}
    </div>
  );
}

export function MealPlanTable({
  title = "JOURNÉE TYPE",
  days,
  shopping,
}: {
  title?: string;
  days: DayPlan[];
  shopping?: ShoppingItem[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d5ddd0] bg-white shadow-[0_4px_20px_rgba(44,42,38,0.06)]">
      <div className="border-b border-[#d5ddd0] bg-white px-4 py-3 sm:px-5">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-olive">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#e8efe3]">
              <th className="border-b border-r border-[#d5ddd0] px-3 py-2.5 text-[12px] font-bold text-olive sm:px-4">
                Jour
              </th>
              {SLOTS.map((slot) => (
                <th
                  key={slot}
                  className="border-b border-r border-[#d5ddd0] px-3 py-2.5 text-[12px] font-bold text-olive last:border-r-0 sm:px-4"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const bySlot = Object.fromEntries(
                day.meals.map((meal) => [meal.slot, meal])
              ) as Partial<Record<PlannedMeal["slot"], PlannedMeal>>;

              return (
                <tr key={day.dayIndex} className="align-top">
                  <td className="border-b border-r border-[#e4e8e0] px-3 py-3 text-[13px] font-semibold text-olive sm:px-4">
                    {day.label}
                  </td>
                  {SLOTS.map((slot) => (
                    <td
                      key={slot}
                      className="border-b border-r border-[#e4e8e0] px-3 py-3 last:border-r-0 sm:px-4"
                    >
                      {mealCellContent(bySlot[slot])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {shopping && shopping.length > 0 ? (
        <div className="border-t border-[#d5ddd0] px-4 py-4 sm:px-5">
          <h4 className="text-[12px] font-bold uppercase tracking-[0.06em] text-olive">
            Liste de courses
          </h4>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {shopping.map((item) => (
              <li
                key={`${item.category}-${item.name}`}
                className="flex items-baseline justify-between gap-2 rounded-lg border border-[#e4e8e0] bg-[#fafbf8] px-3 py-2 text-[12px]"
              >
                <span className="text-ink">
                  {item.name}
                  <span className="text-muted"> · {item.category}</span>
                </span>
                <span className="shrink-0 font-medium text-olive">{item.quantityLabel}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

import { useState } from "react";
import { MealType, MealTypeLabels, DayLabels } from "../types";
import type { SetMenuItem } from "../types";
import MenuSlot from "./MenuSlot";
import RecipePicker from "./RecipePicker";

interface Props {
  items: SetMenuItem[];
  onChange: (items: SetMenuItem[]) => void;
}

const MEAL_TYPES = [
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner,
  MealType.Snack,
];

export default function WeeklyGrid({ items, onChange }: Props) {
  const [picker, setPicker] = useState<{
    day: number;
    meal: MealType;
  } | null>(null);

  const getItem = (day: number, meal: MealType) =>
    items.find((i) => i.dayOfWeek === day && i.mealType === meal);

  const handleSave = (item: SetMenuItem | null) => {
    if (!picker) return;
    const { day, meal } = picker;

    // Remove existing item for this slot
    const filtered = items.filter(
      (i) => !(i.dayOfWeek === day && i.mealType === meal),
    );

    if (item) {
      filtered.push(item);
    }

    onChange(filtered);
    setPicker(null);
  };

  return (
    <>
      <div className="weekly-grid">
        {/* Header row */}
        <div className="grid-header" />
        {DayLabels.map((day, i) => (
          <div key={i} className="grid-header">
            {day.slice(0, 3)}
          </div>
        ))}

        {/* Meal rows */}
        {MEAL_TYPES.map((mealType) => (
          <>
            <div key={`label-${mealType}`} className="grid-label">
              {MealTypeLabels[mealType]}
            </div>
            {DayLabels.map((_, dayIdx) => (
              <MenuSlot
                key={`${mealType}-${dayIdx}`}
                item={getItem(dayIdx, mealType)}
                onClick={() => setPicker({ day: dayIdx, meal: mealType })}
              />
            ))}
          </>
        ))}
      </div>

      {picker && (
        <RecipePicker
          dayOfWeek={picker.day}
          mealType={picker.meal}
          current={getItem(picker.day, picker.meal)}
          onSave={handleSave}
          onClose={() => setPicker(null)}
        />
      )}
    </>
  );
}

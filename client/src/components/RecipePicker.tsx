import { useEffect, useState } from "react";
import type { Recipe, SetMenuItem, MealType } from "../types";
import { DayLabels, MealTypeLabels } from "../types";
import { fetchRecipes } from "../api/recipes";
import { btn, btnPrimary, btnDanger, input } from "../utils/styles";

interface Props {
  dayOfWeek: number;
  mealType: MealType;
  current: SetMenuItem | undefined;
  onSave: (item: SetMenuItem | null) => void;
  onClose: () => void;
}

export default function RecipePicker({
  dayOfWeek,
  mealType,
  current,
  onSave,
  onClose,
}: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [customName, setCustomName] = useState(current?.customName ?? "");
  const [notes, setNotes] = useState(current?.notes ?? "");
  const [mode, setMode] = useState<"pick" | "custom">(
    current?.customName ? "custom" : "pick",
  );

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const selectRecipe = (recipe: Recipe) => {
    onSave({
      dayOfWeek,
      mealType,
      recipeId: recipe.id,
      customName: recipe.name,
      notes: notes || null,
    });
  };

  const saveCustom = () => {
    if (!customName.trim()) return;
    onSave({
      dayOfWeek,
      mealType,
      recipeId: null,
      customName: customName.trim(),
      notes: notes.trim() || null,
    });
  };

  const clear = () => {
    onSave(null);
  };

  return (
    <div className="fixed inset-0 bg-accent/40 flex items-center justify-center z-100" onClick={onClose}>
      <div className="bg-bg border border-border rounded-xl p-6 w-[90%] max-w-[450px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4">
          {DayLabels[dayOfWeek]} - {MealTypeLabels[mealType]}
        </h3>

        <div className="flex gap-2 mb-4">
          <button
            className={mode === "pick" ? btnPrimary : btn}
            onClick={() => setMode("pick")}
          >
            From Recipes
          </button>
          <button
            className={mode === "custom" ? btnPrimary : btn}
            onClick={() => setMode("custom")}
          >
            Custom
          </button>
        </div>

        {mode === "pick" ? (
          recipes.length === 0 ? (
            <p className="text-text-muted">
              No recipes yet. Create some first!
            </p>
          ) : (
            <ul className="list-none p-0 mb-4">
              {recipes.map((r) => (
                <li key={r.id} className="px-3 py-2 rounded-md cursor-pointer hover:bg-accent/5" onClick={() => selectRecipe(r)}>
                  {r.name}
                </li>
              ))}
            </ul>
          )
        ) : (
          <div>
            <div className="mb-4">
              <label htmlFor="customName" className="block mb-1 font-medium">
                Name
              </label>
              <input
                id="customName"
                className={input}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder='e.g. "Leftovers", "Eating out"'
              />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block mb-1 font-medium">
                Notes (optional)
              </label>
              <input
                id="notes"
                className={input}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes"
              />
            </div>
            <button className={btnPrimary} onClick={saveCustom}>
              Set
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-between">
          {current && (
            <button className={btnDanger} onClick={clear}>
              Clear Slot
            </button>
          )}
          <button className={btn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

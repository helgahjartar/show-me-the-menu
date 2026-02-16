import { useEffect, useState } from "react";
import type { Recipe, SetMenuItem, MealType } from "../types";
import { DayLabels, MealTypeLabels } from "../types";
import { fetchRecipes } from "../api/recipes";

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
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-content" onClick={(e) => e.stopPropagation()}>
        <h3>
          {DayLabels[dayOfWeek]} - {MealTypeLabels[mealType]}
        </h3>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            className={mode === "pick" ? "primary" : ""}
            onClick={() => setMode("pick")}
          >
            From Recipes
          </button>
          <button
            className={mode === "custom" ? "primary" : ""}
            onClick={() => setMode("custom")}
          >
            Custom
          </button>
        </div>

        {mode === "pick" ? (
          recipes.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              No recipes yet. Create some first!
            </p>
          ) : (
            <ul className="picker-list">
              {recipes.map((r) => (
                <li key={r.id} onClick={() => selectRecipe(r)}>
                  {r.name}
                </li>
              ))}
            </ul>
          )
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="customName">Name</label>
              <input
                id="customName"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder='e.g. "Leftovers", "Eating out"'
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes"
              />
            </div>
            <button className="primary" onClick={saveCustom}>
              Set
            </button>
          </div>
        )}

        <div
          className="form-actions"
          style={{ justifyContent: "space-between" }}
        >
          {current && (
            <button className="danger" onClick={clear}>
              Clear Slot
            </button>
          )}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { WeeklyMenu, Recipe } from "../types";
import { DayLabels } from "../types";
import { fetchMenu, deleteMenu, setMenuItems, fetchShoppingList } from "../api/menus";
import { fetchRecipe } from "../api/recipes";
import ConfirmDialog from "../components/ConfirmDialog";
import { btn, btnDanger } from "../utils/styles";

export default function MenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchMenu(Number(id))
      .then(setMenu)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDayClick = async (dayOfWeek: number, recipeId: number | null) => {
    if (selectedDay === dayOfWeek) {
      setSelectedDay(null);
      setSelectedRecipe(null);
      return;
    }

    setSelectedDay(dayOfWeek);
    setSelectedRecipe(null);

    if (recipeId) {
      setLoadingRecipe(true);
      try {
        const recipe = await fetchRecipe(recipeId);
        setSelectedRecipe(recipe);
      } finally {
        setLoadingRecipe(false);
      }
    }
  };

  const handleExportShoppingList = async () => {
    const items = await fetchShoppingList(Number(id));

    const allIngredients = items
      .flatMap((item) => item.ingredients.split("\n"))
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const unique = [...new Set(allIngredients)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    const lines = [`Shopping list for "${menu!.name}"`, "", ...unique];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shopping-list-${menu!.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteDay = async (dayOfWeek: number) => {
    if (!menu) return;
    const remaining = menu.items
      .filter((i) => i.dayOfWeek !== dayOfWeek)
      .map((i) => ({
        dayOfWeek: i.dayOfWeek,
        mealType: i.mealType,
        recipeId: i.recipeId,
        customName: i.customName,
        notes: i.notes,
      }));
    const updated = await setMenuItems(menu.id, remaining);
    setMenu(updated);
    setSelectedDay(null);
    setSelectedRecipe(null);
  };

  const handleDelete = async () => {
    await deleteMenu(Number(id));
    navigate("/");
  };

  if (loading) return <p>Loading menu...</p>;
  if (!menu) return <p>Menu not found.</p>;

  // Build a map: dayOfWeek -> menu item
  const dayItems = new Map(menu.items.map((item) => [item.dayOfWeek, item]));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl leading-tight m-0">{menu.name}</h1>
        <div className="flex gap-3">
          <button className={btn} onClick={handleExportShoppingList}>
            Export shopping list
          </button>
          <button className={btnDanger} onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {DayLabels.map((dayName, dayIdx) => {
          const item = dayItems.get(dayIdx);
          const isSelected = selectedDay === dayIdx;

          return (
            <div key={dayIdx}>
              <div
                className={`bg-white border border-border rounded-lg p-4 cursor-pointer flex items-center gap-3 sm:gap-6 transition-colors hover:border-accent ${
                  isSelected ? "border-accent rounded-b-none" : ""
                }`}
                onClick={() => handleDayClick(dayIdx, item?.recipeId ?? null)}
              >
                <h3 className="min-w-[100px] m-0">{dayName}</h3>
                <p className="m-0 flex-1">{item?.customName ?? item?.recipeName ?? "No meal planned"}</p>
                {item && (
                  <button
                    className="text-text-muted hover:text-red-500 leading-none text-lg ml-auto"
                    onClick={(e) => { e.stopPropagation(); handleDeleteDay(dayIdx); }}
                    aria-label="Remove day"
                  >
                    ×
                  </button>
                )}
              </div>

              {isSelected && (
                <div className="bg-white border border-accent border-t-0 rounded-b-lg px-4 sm:px-6 py-4 -mt-3 mb-0">
                  {loadingRecipe ? (
                    <p>Loading recipe...</p>
                  ) : selectedRecipe ? (
                    <div>
                      {(selectedRecipe.cookingTimeMinutes != null || selectedRecipe.tags.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {selectedRecipe.cookingTimeMinutes != null && (
                            <span className="text-text-muted text-sm">{selectedRecipe.cookingTimeMinutes} min</span>
                          )}
                          {selectedRecipe.tags.map((tag) => (
                            <span key={tag} className="bg-accent/10 text-accent text-sm px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedRecipe.ingredients && (
                        <div className="mb-4">
                          <p className="font-semibold mb-1">Ingredients</p>
                          <pre className="whitespace-pre-wrap break-words m-0 font-[inherit] text-[#5a4a4a]">{selectedRecipe.ingredients}</pre>
                        </div>
                      )}
                      {selectedRecipe.instructions && (
                        <div>
                          <p className="font-semibold mb-1">Recipe</p>
                          <pre className="whitespace-pre-wrap break-words m-0 font-[inherit] text-[#5a4a4a]">{selectedRecipe.instructions}</pre>
                        </div>
                      )}
                    </div>
                  ) : item?.customName ? (
                    <p>{item.customName}</p>
                  ) : (
                    <p>No recipe details available.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this menu?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

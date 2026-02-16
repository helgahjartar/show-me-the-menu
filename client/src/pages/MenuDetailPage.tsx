import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { WeeklyMenu, Recipe } from "../types";
import { DayLabels } from "../types";
import { fetchMenu, deleteMenu } from "../api/menus";
import { fetchRecipe } from "../api/recipes";
import ConfirmDialog from "../components/ConfirmDialog";

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
      <div className="page-header">
        <h1>{menu.name}</h1>
        <button className="danger" onClick={() => setShowDeleteConfirm(true)}>
          Delete
        </button>
      </div>

      <div className="day-cards">
        {DayLabels.map((dayName, dayIdx) => {
          const item = dayItems.get(dayIdx);
          const isSelected = selectedDay === dayIdx;

          return (
            <div key={dayIdx}>
              <div
                className={`card day-card ${isSelected ? "day-card-active" : ""}`}
                onClick={() => handleDayClick(dayIdx, item?.recipeId ?? null)}
              >
                <h3>{dayName}</h3>
                <p>{item?.customName ?? item?.recipeName ?? "No meal planned"}</p>
              </div>

              {isSelected && (
                <div className="day-detail">
                  {loadingRecipe ? (
                    <p>Loading recipe...</p>
                  ) : selectedRecipe ? (
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      {[selectedRecipe.description, selectedRecipe.ingredients, selectedRecipe.instructions]
                        .filter(Boolean)
                        .join("\n\n")}
                    </pre>
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

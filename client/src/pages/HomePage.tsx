import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { WeeklyMenuSummary } from "../types";
import { MealType } from "../types";
import { fetchMenus, createMenu, setMenuItems } from "../api/menus";
import { fetchRecipes } from "../api/recipes";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HomePage() {
  const [menus, setMenus] = useState<WeeklyMenuSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus()
      .then(setMenus)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setGenerating(true);
    try {
      const recipes = await fetchRecipes();
      if (recipes.length === 0) {
        alert("Add some recipes first before generating a menu!");
        return;
      }

      const today = new Date();
      const day = today.getDay();
      const daysUntilMonday = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + daysUntilMonday);

      const startDate = monday.toISOString().split("T")[0];
      const name = `Week of ${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      const menu = await createMenu({ name, startDate });

      // Pick 7 random recipes (repeat if fewer than 7)
      const shuffled = shuffle(recipes);
      const picked = Array.from({ length: 7 }, (_, i) => shuffled[i % shuffled.length]);

      await setMenuItems(
        menu.id,
        picked.map((r, i) => ({
          dayOfWeek: i,
          mealType: MealType.Dinner,
          recipeId: r.id,
          customName: r.name,
          notes: null,
        })),
      );

      navigate(`/menus/${menu.id}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p>Loading menus...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Weekly Menus</h1>
        <button className="primary" onClick={handleCreate} disabled={generating}>
          {generating ? "Generating..." : "Generate new weekly menu"}
        </button>
      </div>
      {menus.length === 0 ? (
        <div className="empty-state">
          <p>No menus yet. Generate your first weekly menu!</p>
        </div>
      ) : (
        <div className="card-grid">
          {menus.map((m) => (
            <Link
              key={m.id}
              to={`/menus/${m.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card">
                <h3>{m.name}</h3>
                <p>
                  Starts {m.startDate} &middot; {m.itemCount} meals planned
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Recipe, CreateRecipe } from "../types";
import { fetchRecipes, createRecipe } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import { btn, btnPrimary } from "../utils/styles";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: CreateRecipe) => {
    const recipe = await createRecipe(data);
    setRecipes((prev) => [recipe, ...prev]);
    setShowForm(false);
  };

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl leading-tight m-0">Recipes</h1>
        {!showForm && (
          <button className={btnPrimary} onClick={() => setShowForm(true)}>
            New Recipe
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-border rounded-lg p-4 mb-6">
          <h2 className="text-2xl m-0 mb-2">New Recipe</h2>
          <RecipeForm onSubmit={handleCreate} submitLabel="Create Recipe" />
          <div className="flex gap-3 mt-6">
            <button className={btn} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {recipes.length === 0 && !showForm ? (
        <div className="text-center py-12 px-4 text-text-light">
          <p>No recipes yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

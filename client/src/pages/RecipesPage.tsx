import { useEffect, useState } from "react";
import type { Recipe, CreateRecipe } from "../types";
import { fetchRecipes, createRecipe } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";

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
      <div className="page-header">
        <h1>Recipes</h1>
        {!showForm && (
          <button className="primary" onClick={() => setShowForm(true)}>
            New Recipe
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2>New Recipe</h2>
          <RecipeForm onSubmit={handleCreate} submitLabel="Create Recipe" />
          <div className="form-actions">
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {recipes.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>No recipes yet. Create your first one!</p>
        </div>
      ) : (
        <div className="card-grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Recipe, CreateRecipe } from "../types";
import { fetchRecipe, updateRecipe, deleteRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { btn, btnDanger } from "../utils/styles";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchRecipe(Number(id))
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const handleUpdate = async (data: CreateRecipe) => {
    const updated = await updateRecipe(recipe.id, data);
    setRecipe(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteRecipe(recipe.id);
    navigate("/recipes");
  };

  if (editing) {
    return (
      <div>
        <h1 className="text-3xl leading-tight m-0 mb-4">Edit Recipe</h1>
        <RecipeForm
          initial={{
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            tags: recipe.tags,
            cookingTimeMinutes: recipe.cookingTimeMinutes,
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
        <div className="flex gap-3 mt-6">
          <button className={btn} onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h1 className="text-2xl sm:text-3xl leading-tight m-0">{recipe.name}</h1>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setEditing(true)}>Edit</button>
          <button className={btnDanger} onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </button>
        </div>
      </div>
      {(recipe.cookingTimeMinutes != null || recipe.tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {recipe.cookingTimeMinutes != null && (
            <span className="text-text-muted text-sm">{recipe.cookingTimeMinutes} min</span>
          )}
          {recipe.tags.map((tag) => (
            <span key={tag} className="bg-accent/10 text-accent text-sm px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {recipe.ingredients && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
          <pre className="whitespace-pre-wrap break-words m-0 font-[inherit] text-text-light">{recipe.ingredients}</pre>
        </div>
      )}
      {recipe.instructions && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Recipe</h2>
          <pre className="whitespace-pre-wrap break-words m-0 font-[inherit] text-text-light">{recipe.instructions}</pre>
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this recipe?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

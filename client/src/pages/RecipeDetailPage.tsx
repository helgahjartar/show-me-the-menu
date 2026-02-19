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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl leading-tight m-0">{recipe.name}</h1>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setEditing(true)}>Edit</button>
          <button className={btnDanger} onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap m-0 font-[inherit] text-text-light">
        {[recipe.description, recipe.ingredients, recipe.instructions]
          .filter(Boolean)
          .join("\n\n")}
      </pre>

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

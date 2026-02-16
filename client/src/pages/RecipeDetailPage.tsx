import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Recipe, CreateRecipe } from "../types";
import { fetchRecipe, updateRecipe, deleteRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
import ConfirmDialog from "../components/ConfirmDialog";

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
        <h1>Edit Recipe</h1>
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
        <div className="form-actions">
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{recipe.name}</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button className="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </button>
        </div>
      </div>
      <pre style={{ whiteSpace: "pre-wrap" }}>
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

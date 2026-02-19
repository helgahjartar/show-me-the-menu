import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
import type { CreateRecipe } from "../types";

export default function RecipeCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateRecipe) => {
    const recipe = await createRecipe(data);
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl leading-tight m-0 mb-4">New Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Create Recipe" />
    </div>
  );
}

import { Link } from "react-router-dom";
import type { Recipe } from "../types";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="no-underline text-inherit">
      <div className="bg-white border border-border rounded-lg p-4 transition-colors hover:border-accent flex flex-col items-center justify-center min-h-[100px]">
        <h3 className="m-0 mb-2 text-text text-2xl font-bold text-center">{recipe.name}</h3>
        {recipe.description && (
          <p className="m-0 text-text-muted text-sm text-center">{recipe.description}</p>
        )}
      </div>
    </Link>
  );
}

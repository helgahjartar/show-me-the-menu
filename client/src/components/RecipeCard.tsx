import { Link } from "react-router-dom";
import type { Recipe } from "../types";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card">
        <h3>{recipe.name}</h3>
        {recipe.description && <p>{recipe.description}</p>}
      </div>
    </Link>
  );
}

import { useState } from "react";
import type { CreateRecipe } from "../types";
import { btnPrimary, input, textarea } from "../utils/styles";

interface Props {
  initial?: CreateRecipe;
  onSubmit: (data: CreateRecipe) => void;
  submitLabel: string;
}

export default function RecipeForm({ initial, onSubmit, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: null,
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
    });
  };

  const valid = name.trim() && ingredients.trim();

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">
          Title
        </label>
        <input
          id="name"
          className={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe title"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="ingredients" className="block mb-1 font-medium">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          className={textarea}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="List the ingredients..."
          rows={6}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="instructions" className="block mb-1 font-medium">
          Recipe
        </label>
        <textarea
          id="instructions"
          className={textarea}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="How to make it..."
          rows={8}
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button type="submit" className={btnPrimary} disabled={!valid}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

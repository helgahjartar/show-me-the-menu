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
  const [text, setText] = useState(
    initial
      ? [initial.description, initial.ingredients, initial.instructions]
          .filter(Boolean)
          .join("\n\n")
      : "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: null,
      ingredients: text.trim(),
      instructions: "",
    });
  };

  const valid = name.trim() && text.trim();

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
        <label htmlFor="text" className="block mb-1 font-medium">
          Recipe
        </label>
        <textarea
          id="text"
          className={textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ingredients, instructions, notes..."
          rows={10}
          required
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

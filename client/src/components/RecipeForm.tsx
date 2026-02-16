import { useState } from "react";
import type { CreateRecipe } from "../types";

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
      <div className="form-group">
        <label htmlFor="name">Title</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="text">Recipe</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ingredients, instructions, notes..."
          rows={10}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary" disabled={!valid}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

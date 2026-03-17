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
  const [cookingTime, setCookingTime] = useState(
    initial?.cookingTimeMinutes?.toString() ?? ""
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      const trimmed = tagInput.trim().toLowerCase();
      if (trimmed) {
        e.preventDefault();
        if (!tags.includes(trimmed)) setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pendingTag = tagInput.trim().toLowerCase();
    const finalTags = pendingTag && !tags.includes(pendingTag)
      ? [...tags, pendingTag]
      : tags;
    onSubmit({
      name: name.trim(),
      description: null,
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      tags: finalTags,
      cookingTimeMinutes: cookingTime ? parseInt(cookingTime, 10) : null,
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
      <div className="mb-4">
        <label htmlFor="cookingTime" className="block mb-1 font-medium">
          Cooking time (minutes)
        </label>
        <input
          id="cookingTime"
          type="number"
          min="1"
          className={`${input} w-32`}
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          placeholder="e.g. 30"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tags</label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-accent/10 text-accent text-sm px-2 py-0.5 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="leading-none hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          className={input}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter (e.g. quick, vegetarian)"
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { getFridgeSuggestion } from "../api/ai";
import type { FridgeSuggestionResponse } from "../types";
import { btn, btnPrimary, textarea } from "../utils/styles";

export function FridgePage() {
  const [ingredients, setIngredients] = useState("");
  const [suggestion, setSuggestion] = useState<FridgeSuggestionResponse | null>(null);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getSuggestion(excluded: number[]) {
    if (!ingredients.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getFridgeSuggestion({ ingredients, excludedRecipeIds: excluded });
      setSuggestion(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newExcluded: number[] = [];
    setExcludedIds(newExcluded);
    setSuggestion(null);
    getSuggestion(newExcluded);
  }

  function handleSuggestAnother() {
    const newExcluded = suggestion?.matchedRecipeId != null
      ? [...excludedIds, suggestion.matchedRecipeId]
      : excludedIds;
    setExcludedIds(newExcluded);
    getSuggestion(newExcluded);
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight m-0 mb-1">Make from Fridge</h1>
      <p className="text-text-muted mb-6 text-sm">
        Tell us what ingredients you have and we'll suggest a recipe — from your saved recipes or a new one.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="ingredients">
          What's in your fridge?
        </label>
        <textarea
          id="ingredients"
          className={textarea}
          rows={5}
          placeholder={"e.g.\n2 chicken breasts\n1 onion\ngarlic\ntomatoes\npasta"}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading || !ingredients.trim()}
          className={`mt-3 ${btnPrimary} ${loading || !ingredients.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Thinking..." : "Suggest a recipe"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="border border-border rounded-lg p-4 sm:p-5 bg-white">
          <div className="mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${suggestion.isExistingRecipe ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
              {suggestion.isExistingRecipe ? "From your recipes" : "New suggestion"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mt-2 mb-1">
            {suggestion.isExistingRecipe && suggestion.matchedRecipeId != null ? (
              <Link to={`/recipes/${suggestion.matchedRecipeId}`} className="text-accent hover:underline">
                {suggestion.recipeName}
              </Link>
            ) : (
              suggestion.recipeName
            )}
          </h2>

          {suggestion.description && (
            <p className="text-text-muted text-sm mb-3">{suggestion.description}</p>
          )}

          <p className="text-sm text-text-light italic mb-4">{suggestion.explanation}</p>

          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-1">Ingredients</h3>
            <pre className="text-sm whitespace-pre-wrap break-words font-[inherit] text-text-light">{suggestion.ingredients}</pre>
          </div>

          {suggestion.instructions && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-1">Instructions</h3>
              <pre className="text-sm whitespace-pre-wrap break-words font-[inherit] text-text-light">{suggestion.instructions}</pre>
            </div>
          )}

          <button
            onClick={handleSuggestAnother}
            disabled={loading}
            className={`mt-2 ${btn} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Thinking..." : "Suggest another"}
          </button>
        </div>
      )}
    </div>
  );
}

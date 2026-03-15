import { useState } from "react";
import { Link } from "react-router-dom";
import { getFridgeSuggestion } from "../api/ai";
import type { FridgeSuggestionResponse } from "../types";

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">Make from Fridge</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Tell us what ingredients you have and we'll suggest a recipe — from your saved recipes or a new one.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="ingredients">
          What's in your fridge?
        </label>
        <textarea
          id="ingredients"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={5}
          placeholder={"e.g.\n2 chicken breasts\n1 onion\ngarlic\ntomatoes\npasta"}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading || !ingredients.trim()}
          className="mt-3 px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Suggest a recipe"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${suggestion.isExistingRecipe ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {suggestion.isExistingRecipe ? "From your recipes" : "New suggestion"}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-2 mb-1">
            {suggestion.isExistingRecipe && suggestion.matchedRecipeId != null ? (
              <Link to={`/recipes/${suggestion.matchedRecipeId}`} className="text-primary hover:underline">
                {suggestion.recipeName}
              </Link>
            ) : (
              suggestion.recipeName
            )}
          </h2>

          {suggestion.description && (
            <p className="text-gray-500 text-sm mb-3">{suggestion.description}</p>
          )}

          <p className="text-sm text-gray-600 italic mb-4">{suggestion.explanation}</p>

          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-1">Ingredients</h3>
            <pre className="text-sm whitespace-pre-wrap font-sans text-gray-800">{suggestion.ingredients}</pre>
          </div>

          {suggestion.instructions && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-1">Instructions</h3>
              <pre className="text-sm whitespace-pre-wrap font-sans text-gray-800">{suggestion.instructions}</pre>
            </div>
          )}

          <button
            onClick={handleSuggestAnother}
            disabled={loading}
            className="mt-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Suggest another"}
          </button>
        </div>
      )}
    </div>
  );
}

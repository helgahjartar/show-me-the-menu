import { useState } from "react";
import type { MealType, AiSuggestion } from "../types";
import { MealTypeLabels } from "../types";
import { fetchSuggestions } from "../api/ai";
import { btn, btnPrimary } from "../utils/styles";

interface Props {
  onFillSlots: (suggestions: { mealType: MealType; name: string }[]) => void;
}

export default function AiSuggestButton({ onFillSlots }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[] | null>(null);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const results = await fetchSuggestions({
        mealType: null,
        preferences: null,
      });
      setSuggestions(results);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    if (!suggestions) return;
    onFillSlots(
      suggestions.map((s) => ({
        mealType: s.suggestedMealType,
        name: s.name,
      })),
    );
    setSuggestions(null);
  };

  if (suggestions) {
    return (
      <div className="bg-white border border-border rounded-lg p-4 mb-4">
        <h3>AI Suggestions</h3>
        <ul className="list-none p-0">
          {suggestions.map((s, i) => (
            <li key={i} className="mb-2">
              <strong>{s.name}</strong> ({MealTypeLabels[s.suggestedMealType]})
              <br />
              <span className="text-[0.85em] opacity-70">
                {s.description}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button className={btnPrimary} onClick={applySuggestions}>
            Fill Empty Slots
          </button>
          <button className={btn} onClick={() => setSuggestions(null)}>Dismiss</button>
        </div>
      </div>
    );
  }

  return (
    <button className={btn} onClick={handleSuggest} disabled={loading}>
      {loading ? "Thinking..." : "AI Suggest"}
    </button>
  );
}

import { useState } from "react";
import type { MealType, AiSuggestion } from "../types";
import { MealTypeLabels } from "../types";
import { fetchSuggestions } from "../api/ai";

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
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>AI Suggestions</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suggestions.map((s, i) => (
            <li key={i} style={{ marginBottom: "0.5em" }}>
              <strong>{s.name}</strong> ({MealTypeLabels[s.suggestedMealType]})
              <br />
              <span style={{ fontSize: "0.85em", opacity: 0.7 }}>
                {s.description}
              </span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="primary" onClick={applySuggestions}>
            Fill Empty Slots
          </button>
          <button onClick={() => setSuggestions(null)}>Dismiss</button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={handleSuggest} disabled={loading}>
      {loading ? "Thinking..." : "AI Suggest"}
    </button>
  );
}

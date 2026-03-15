import type { AiSuggestRequest, AiSuggestion, FridgeSuggestionRequest, FridgeSuggestionResponse } from "../types";
import { apiPost } from "./client";

export function fetchSuggestions(
  request: AiSuggestRequest,
): Promise<AiSuggestion[]> {
  return apiPost<AiSuggestion[]>("/ai/suggest", request);
}

export function getFridgeSuggestion(
  request: FridgeSuggestionRequest,
): Promise<FridgeSuggestionResponse> {
  return apiPost<FridgeSuggestionResponse>("/ai/fridge-suggestion", request);
}

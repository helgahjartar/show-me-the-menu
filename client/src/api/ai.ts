import type { AiSuggestRequest, AiSuggestion } from "../types";
import { apiPost } from "./client";

export function fetchSuggestions(
  request: AiSuggestRequest,
): Promise<AiSuggestion[]> {
  return apiPost<AiSuggestion[]>("/ai/suggest", request);
}

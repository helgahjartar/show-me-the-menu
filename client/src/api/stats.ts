import { apiGet } from "./client";
import type { KronanProductStats } from "../types";

export function fetchKronanStats(): Promise<KronanProductStats[]> {
  return apiGet<KronanProductStats[]>("/stats/kronan");
}

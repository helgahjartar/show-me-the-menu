import { apiGet, apiPut } from "./client";
import type { AppSettings, UpdateSettings } from "../types";

export function fetchSettings(): Promise<AppSettings> {
  return apiGet<AppSettings>("/settings");
}

export function updateSettings(data: UpdateSettings): Promise<AppSettings> {
  return apiPut<AppSettings>("/settings", data);
}

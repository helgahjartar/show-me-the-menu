import type { InventoryItem } from "../types";
import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export function fetchInventory(): Promise<InventoryItem[]> {
  return apiGet<InventoryItem[]>("/inventory");
}

export function createInventoryItem(category: string, name: string, quantity: number): Promise<InventoryItem> {
  return apiPost<InventoryItem>("/inventory", { category, name, quantity });
}

export function updateInventoryItem(id: number, isCrossed: boolean, quantity: number): Promise<InventoryItem> {
  return apiPut<InventoryItem>(`/inventory/${id}`, { isCrossed, quantity });
}

export function deleteInventoryItem(id: number): Promise<void> {
  return apiDelete(`/inventory/${id}`);
}

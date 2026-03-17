import type {
  WeeklyMenu,
  WeeklyMenuSummary,
  CreateWeeklyMenu,
  SetMenuItem,
  ShoppingListItem,
  GenerateMenuRequest,
} from "../types";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export function fetchMenus(): Promise<WeeklyMenuSummary[]> {
  return apiGet<WeeklyMenuSummary[]>("/menus");
}

export function fetchMenu(id: number): Promise<WeeklyMenu> {
  return apiGet<WeeklyMenu>(`/menus/${id}`);
}

export function createMenu(data: CreateWeeklyMenu): Promise<WeeklyMenu> {
  return apiPost<WeeklyMenu>("/menus", data);
}

export function updateMenu(
  id: number,
  data: { name: string; startDate: string },
): Promise<WeeklyMenu> {
  return apiPut<WeeklyMenu>(`/menus/${id}`, data);
}

export function deleteMenu(id: number): Promise<void> {
  return apiDelete(`/menus/${id}`);
}

export function setMenuItems(
  id: number,
  items: SetMenuItem[],
): Promise<WeeklyMenu> {
  return apiPut<WeeklyMenu>(`/menus/${id}/items`, { items });
}

export function generateMenu(request?: GenerateMenuRequest): Promise<WeeklyMenu> {
  return apiPost<WeeklyMenu>("/menus/generate", request ?? {});
}

export function fetchShoppingList(id: number): Promise<ShoppingListItem[]> {
  return apiGet<ShoppingListItem[]>(`/menus/${id}/shopping-list`);
}

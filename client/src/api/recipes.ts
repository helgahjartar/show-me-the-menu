import type { Recipe, CreateRecipe, UpdateRecipe } from "../types";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export function fetchRecipes(): Promise<Recipe[]> {
  return apiGet<Recipe[]>("/recipes");
}

export function fetchRecipe(id: number): Promise<Recipe> {
  return apiGet<Recipe>(`/recipes/${id}`);
}

export function createRecipe(data: CreateRecipe): Promise<Recipe> {
  return apiPost<Recipe>("/recipes", data);
}

export function updateRecipe(id: number, data: UpdateRecipe): Promise<Recipe> {
  return apiPut<Recipe>(`/recipes/${id}`, data);
}

export function deleteRecipe(id: number): Promise<void> {
  return apiDelete(`/recipes/${id}`);
}

export function fetchRecipeTags(): Promise<string[]> {
  return apiGet<string[]>("/recipes/tags");
}

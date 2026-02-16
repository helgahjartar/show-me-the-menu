export const MealType = {
  Breakfast: 0,
  Lunch: 1,
  Dinner: 2,
  Snack: 3,
} as const;

export type MealType = (typeof MealType)[keyof typeof MealType];

export const MealTypeLabels: Record<MealType, string> = {
  [MealType.Breakfast]: "Breakfast",
  [MealType.Lunch]: "Lunch",
  [MealType.Dinner]: "Dinner",
  [MealType.Snack]: "Snack",
};

export const DayLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipe {
  name: string;
  description: string | null;
  ingredients: string;
  instructions: string;
}

export interface UpdateRecipe extends CreateRecipe {}

export interface MenuItem {
  id: number;
  dayOfWeek: number;
  mealType: MealType;
  recipeId: number | null;
  recipeName: string | null;
  customName: string | null;
  notes: string | null;
}

export interface WeeklyMenu {
  id: number;
  name: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
}

export interface WeeklyMenuSummary {
  id: number;
  name: string;
  startDate: string;
  itemCount: number;
  createdAt: string;
}

export interface CreateWeeklyMenu {
  name: string;
  startDate: string;
}

export interface SetMenuItem {
  dayOfWeek: number;
  mealType: MealType;
  recipeId: number | null;
  customName: string | null;
  notes: string | null;
}

export interface AiSuggestRequest {
  mealType: MealType | null;
  preferences: string | null;
}

export interface AiSuggestion {
  name: string;
  description: string;
  suggestedMealType: MealType;
}

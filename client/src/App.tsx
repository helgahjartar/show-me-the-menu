import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeCreatePage from "./pages/RecipeCreatePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MenuDetailPage from "./pages/MenuDetailPage";
import SettingsPage from "./pages/SettingsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { StatsPage } from "./pages/StatsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/new" element={<RecipeCreatePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/menus/:id" element={<MenuDetailPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

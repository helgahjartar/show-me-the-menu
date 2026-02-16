import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeCreatePage from "./pages/RecipeCreatePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MenuDetailPage from "./pages/MenuDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/new" element={<RecipeCreatePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/menus/:id" element={<MenuDetailPage />} />
      </Route>
    </Routes>
  );
}

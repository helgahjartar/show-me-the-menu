import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const linkClass = (path: string) =>
    `px-2 py-1 rounded text-nav-text font-normal no-underline ${
      isActive(path) ? "text-white bg-white/15" : "hover:text-white hover:bg-white/15"
    }`;

  return (
    <nav className="flex items-center gap-8 px-6 py-3 bg-primary border-b border-border">
      <Link to="/" className="text-xl font-bold text-nav-brand no-underline hover:text-white">
        Show Me The Menu
      </Link>
      <div className="flex gap-4">
        <Link to="/" className={linkClass("/menus")}>
          Menus
        </Link>
        <Link to="/recipes" className={linkClass("/recipes")}>
          Recipes
        </Link>
        <Link to="/settings" className={linkClass("/settings")}>
          Settings
        </Link>
      </div>
    </nav>
  );
}

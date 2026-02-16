import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `nav-link ${pathname === path || pathname.startsWith(path + "/") ? "active" : ""}`;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Show Me The Menu
      </Link>
      <div className="nav-links">
        <Link to="/" className={linkClass("/menus")}>
          Menus
        </Link>
        <Link to="/recipes" className={linkClass("/recipes")}>
          Recipes
        </Link>
      </div>
    </nav>
  );
}

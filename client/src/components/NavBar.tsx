import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function NavBar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth0();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const linkClass = (path: string) =>
    `px-2 py-1 rounded text-nav-text font-normal no-underline ${
      isActive(path) ? "text-white bg-white/15" : "hover:text-white hover:bg-white/15"
    }`;

  const mobileLinkClass = (path: string) =>
    `flex flex-col items-center px-3 py-1 rounded text-xs text-nav-text font-normal no-underline ${
      isActive(path) ? "text-white bg-white/15" : "hover:text-white hover:bg-white/15"
    }`;

  const doLogout = () => logout({ logoutParams: { returnTo: window.location.origin } });

  return (
    <>
      <nav className="flex items-center px-4 sm:px-6 py-3 gap-6 bg-primary">
        <Link to="/" className="text-xl font-bold text-nav-brand no-underline hover:text-white shrink-0">
          Show Me The Menu
        </Link>
        <div className="hidden sm:flex gap-4">
          <Link to="/" className={linkClass("/menus")}>Menus</Link>
          <Link to="/fridge" className={linkClass("/fridge")}>Make from Fridge</Link>
          <Link to="/recipes" className={linkClass("/recipes")}>Recipes</Link>
          <Link to="/settings" className={linkClass("/settings")}>Settings</Link>
        </div>
        <div className="hidden sm:flex ml-auto items-center gap-3">
          {user && <span className="text-sm text-nav-text">{user.email}</span>}
          <button
            onClick={doLogout}
            className="px-3 py-1 text-sm rounded bg-white/15 text-white hover:bg-white/25"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-primary z-50 flex items-center justify-around px-2 py-2 border-t border-white/10">
        <Link to="/" className={mobileLinkClass("/menus")}>Menus</Link>
        <Link to="/fridge" className={mobileLinkClass("/fridge")}>Fridge</Link>
        <Link to="/recipes" className={mobileLinkClass("/recipes")}>Recipes</Link>
        <Link to="/settings" className={mobileLinkClass("/settings")}>Settings</Link>
        <button
          onClick={doLogout}
          className="flex flex-col items-center px-3 py-1 rounded text-xs text-nav-text hover:text-white hover:bg-white/15"
        >
          Log out
        </button>
      </div>
    </>
  );
}

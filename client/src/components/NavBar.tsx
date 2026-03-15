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

  const userSection = (
    <div className="flex items-center gap-3">
      {user && (
        <span className="text-sm text-nav-text">{user.email}</span>
      )}
      <button
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="px-3 py-1 text-sm rounded bg-white/15 text-white hover:bg-white/25"
      >
        Log out
      </button>
    </div>
  );

  return (
    <>
      <nav className="flex items-center gap-8 px-6 py-3 bg-primary">
        <Link to="/" className="text-xl font-bold text-nav-brand no-underline hover:text-white">
          Show Me The Menu
        </Link>
        <div className="flex gap-4">
          <Link to="/" className={linkClass("/menus")}>
            Menus
          </Link>
          <Link to="/fridge" className={linkClass("/fridge")}>
            Make from Fridge
          </Link>
          <Link to="/recipes" className={linkClass("/recipes")}>
            Recipes
          </Link>
          <Link to="/settings" className={linkClass("/settings")}>
            Settings
          </Link>
        </div>
        <div className="ml-auto hidden sm:flex">
          {userSection}
        </div>
      </nav>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-primary px-6 py-3 flex justify-between items-center z-50">
        {userSection}
      </div>
    </>
  );
}

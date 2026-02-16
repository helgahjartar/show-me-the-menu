import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

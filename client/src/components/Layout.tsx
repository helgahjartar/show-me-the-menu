import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-6 max-w-[1200px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

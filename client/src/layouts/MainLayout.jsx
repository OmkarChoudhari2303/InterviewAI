import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function MainLayout() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <Outlet />
        </div>
    )
}

export default MainLayout;

/**
 * Outlet acts like:
 * -> dynamic page placeholder
 * This prevents repeating layouts on every page.
 * 
 * When you define a parent route that has "children," the parent component needs a way to know exactly where to display those children in its own layout.
 * The <Outlet /> serves as that injection point
 */
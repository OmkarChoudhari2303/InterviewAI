import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext.jsx";


function Navbar() {
    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (loggingOut) return;
        try {
            setLoggingOut(true);
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setLoggingOut(false);
        }
    }
    return (
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-850">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
                <img src="/logo.png" alt="InterviewAI Logo" className="h-8 w-8 object-contain" />
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    InterviewAI
                </span>
            </Link>
            <div className="flex gap-4 md:gap-6 items-center text-sm md:text-base">
                <Link to="/">Home</Link>
                {!user ? (
                    <>
                        <Link to="/login" className={loggingOut ? "pointer-events-none opacity-50" : ""}>Login</Link>
                        <Link to="/signup" className={loggingOut ? "pointer-events-none opacity-50" : ""}>Signup</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className={loggingOut ? "pointer-events-none opacity-50" : ""}>Dashboard</Link>
                        <Link to="/chat" className={loggingOut ? "pointer-events-none opacity-50" : ""}>Chat</Link>

                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded text-white disabled:opacity-50"
                        >
                            {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;

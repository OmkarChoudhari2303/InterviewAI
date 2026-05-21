import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext.jsx";


function Navbar() {
    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout()
        navigate("/login");
    }
    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
            <h1 className=" text-2xl font-bold">
                InterviewAI
            </h1>
            <div className="flex gap-6 items-center">
                <Link to="/">Home</Link>
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/chat">Chat</Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;

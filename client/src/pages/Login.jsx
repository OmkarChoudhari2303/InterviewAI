import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios.js";

import { AuthContext } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const Navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);

    const { token } = useContext(AuthContext);

    useEffect(()=>{
        if(token){
            Navigate("/dashboard")
        }
    },[token]);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // prevents from refreshing
        if (loading) return;

        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/auth/login",
                formData
            )

            login(
                response.data.user,
                response.data.accessToken
            )

            alert("Login Successful");

            Navigate("/dashboard");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        if (loading) return;
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/auth/google",
                {
                    credential:
                        credentialResponse.credential
                })

            login(
                response.data.user,
                response.data.accessToken
            )

            Navigate("/dashboard")
        } catch (error) {
            console.log(error);

            alert(error.response?.data?.message || "Google Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4"
            >
                <h1 className="text-3xl font-bold">
                    Login
                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 rounded bg-black border border-zinc-700 disabled:opacity-50"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 rounded bg-black border border-zinc-700 disabled:opacity-50"
                />

                <button 
                    disabled={loading}
                    className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Logging in...
                        </>
                    ) : "Login"}
                </button>
                <div className="flex flex-col items-center gap-2 mt-2">
                    <Link to="/forgot-password" className={`text-sm text-blue-400 hover:underline ${loading ? "pointer-events-none opacity-50" : ""}`}>
                        Forgot Password?
                    </Link>
                    <p className="text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className={`text-blue-400 hover:underline ${loading ? "pointer-events-none opacity-50" : ""}`}>
                            Signup
                        </Link>
                    </p>
                </div>
                <div className={`flex justify-center mt-4 ${loading ? "pointer-events-none opacity-50" : ""}`}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}

                        onError={() => {
                            console.log("Google Login Failed")
                        }}
                    />
                </div>
            </form>
        </div>
    )
}

export default Login;
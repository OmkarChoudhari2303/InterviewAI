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

        try {
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
            alert(error.response.data.message)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
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
                    className="w-full p-3 rounded bg-black border border-zinc-700"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-black border border-zinc-700"
                />

                <button className="w-full bg-white text-black p-3 rounded font-semibold">
                    Login
                    <p className="text-sm text-center">
                        <Link to="/forgot-password" className="text-blue-400">
                            Forgot Password
                        </Link>
                    </p>
                </button>
                <div className="flex justify-center mt-4">
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
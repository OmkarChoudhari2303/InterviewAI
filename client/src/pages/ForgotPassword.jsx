import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios.js";

function ForgotPassword(){
    const [email,setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setMessage("");

        try{
            setLoading(true);

            const response = await axiosInstance.post("/auth/forgot-password",{email})

            setMessage(response.data.message);
        }catch(error){
            console.log(error);

            setMessage(
                error.response?.data?.message || "Something Went Wrong"
            )
        }finally{
            setLoading(false)
        }
    }

    return(
        <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-black
        text-white
        "
        >
            <form
            onSubmit={handleSubmit}
            className="
            bg-zinc-900
            p-8
            rounded-xl
            w-[400px]
            space-y-4
            "
            >
                <h1 className="text-3xl font-bold">
                    Forgot Password
                </h1>

                <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="
                w-full
                p-3
                rounded
                bg-black
                border
                border-zinc-700
                "
                />

                <button
                disabled={loading}
                className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                    {
                        loading
                        ? "Sending..."
                        : "Send Reset Link"
                    }
                </button>
                <p className="text-sm text-center text-zinc-400 mt-4">
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Back to Login
                    </Link>
                </p>

                {
                    message && (
                        <p className="text-sm text-center text-zinc-300">
                            {message}
                        </p>
                    )
                }
            </form>
        </div>
    )
}

export default ForgotPassword;
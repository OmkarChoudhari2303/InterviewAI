import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios.js";

function ForgotPassword(){
    const [email,setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [resetLink, setResetLink] = useState("");

    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setMessage("");
        setResetLink("");

        try{
            setLoading(true);

            const response = await axiosInstance.post("/auth/forgot-password",{email})

            setMessage(response.data.message);
            if (response.data.resetLink) {
                setResetLink(response.data.resetLink);
            }
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

                {
                    resetLink && (
                        <div className="mt-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-left">
                            <p className="text-xs text-yellow-500 font-bold mb-1 flex items-center gap-1.5">
                                ⚠️ Mail Delivery Restricted
                            </p>
                            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                                Because cloud providers (like Render) block SMTP ports by default, copy and use this direct reset link to complete the reset flow:
                            </p>
                            <a
                                href={resetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:underline break-all block p-2 rounded bg-zinc-900 border border-zinc-800 font-mono"
                            >
                                {resetLink}
                            </a>
                        </div>
                    )
                }
            </form>
        </div>
    )
}

export default ForgotPassword;
import { useState } from "react";

import axiosInstance from "../api/axios.js";

function ForgotPassword(){
    const [email,setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();

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
                className="
                w-full
                bg-white
                text-black
                p-3
                rounded-2xl
                font-semibold
                "
                >
                    {
                        loading
                        ? "Sending..."
                        : "Send Reset Link"
                    }
                </button>

                {
                    message && (
                        <p className="text-sm">
                            {message}
                        </p>
                    )
                }
            </form>
        </div>
    )
}

export default ForgotPassword;
import { useState } from "react";
import {useNavigate,useParams} from "react-router-dom";
import axiosInstance from "../api/axios.js";

function ResetPassword(){
    const {token} = useParams()

    const navigate = useNavigate()

    const [password,setPassword] = useState("")

    const [loading,setLoading] = useState(false)

    const [message,setMessage] = useState("")

    const handleSubmit = async (e)=>{

    e.preventDefault()

    try{
        setLoading(true)

        const response = await axiosInstance.post(
            "/auth/reset-password",
            {
                token,
                password
            }
        )

        setMessage(response.data.message)

        setTimeout(()=>{
            navigate("/login")
        },2000)
    }catch(error){
        console.log(error)

        setMessage(
            error.response?.data?.message || "Something Went Wrong"
        )
    }finally{
        setLoading(false);
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
                    Reset Password
                </h1>

                <input 
                type="password" 
                placeholder="Enter new password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-black border border-zinc-700 focus:border-zinc-500 outline-none transition"
                />

                <button
                disabled={loading}
                className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                    {
                        loading
                        ? "Resetting..."
                        :"Reset Password"
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

export default ResetPassword;
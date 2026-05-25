import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axios";

function Signup(){
    const navigate = useNavigate();
    
    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:""
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if (loading) return;

        try{
            setLoading(true);
            await axiosInstance.post("/auth/signup",formData);
            alert("Signup Successful");

            navigate("/login");
        }catch(error){
            console.log(error);
            alert(error.response?.data?.message || error.message || "Signup failed");
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4">
                <h1 className="text-3xl font-bold"> Signup</h1>

                <input 
                type="text" 
                name="name" 
                placeholder="Enter Name" 
                onChange={handleChange} 
                disabled={loading}
                className="w-full p-3 rounded bg-black border border-zinc-700 disabled:opacity-50"
                />

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
                            Signing up...
                        </>
                    ) : "Signup"}
                </button>
                <p className="text-sm text-center text-zinc-400 mt-4">
                    Already have an account?{" "}
                    <span className={`text-blue-400 cursor-pointer hover:underline ${loading ? "pointer-events-none opacity-50" : ""}`} onClick={() => !loading && navigate("/login")}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    )
}

export default Signup;
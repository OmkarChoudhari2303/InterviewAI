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

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try{
            await axiosInstance.post("/auth/signup",formData);
            alert("Signup Successful");

            navigate("/login");
        }catch(error){
            console.log(error);
            alert(error.response?.data?.message || error.message || "Signup failed");
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
                className="w-full p-3 rounded bg-black border border-zinc-700"
                />

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
                placeholder="Enter Passrord" 
                onChange={handleChange}
                className="w-full p-3 rounded bg-black border border-zinc-700"
                />

                <button
                className="w-full bg-white text-black p-3 font-semibold"
                >
                    Signup
                </button>
            </form>
        </div>
    )
}

export default Signup;
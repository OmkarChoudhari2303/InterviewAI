import { useState, useEffect } from "react";

import axiosInstance from "../api/axios.js"

import InputField from "./InputField.jsx";

function ProfileForm(){
    const[formData,setFormData] = useState({
        name:"",
        bio:"",
        githubUrl:"",
        linkedinUrl:""
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setFormData({
                        name: response.data.name || "",
                        bio: response.data.bio || "",
                        githubUrl: response.data.githubUrl || "",
                        linkedinUrl: response.data.linkedinUrl || ""
                    });
                }
            } catch (error) {
                console.log("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e)=>{
        setFormData({
            ...formData,[e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try{
            const token = localStorage.getItem("token");

            await axiosInstance.post("/profile/create",formData,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Profile Created Successfully")
        }catch(error){
            console.log(error);

            alert(error.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <h2 className="text-2xl font-bold">
                Profile
            </h2>

            <InputField
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            />

            <textarea 
            name="bio" 
            placeholder="Write about yourself" 
            value={formData.bio}
            onChange={handleChange}
            className="
            w-full
            h-32
            p-3
            rounded-lg
            bg-black
            border
            border-zinc-700
            "/>

            <InputField
            name="githubUrl"
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={handleChange}
            />

            <InputField
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleChange}
            />
            
            <button
            className="
            bg-white
            text-black
            px-6
            py-3
            rounded-lg
            font-semibold
            "
            >
                Save Profile
            </button>
        </form>
    )
}

export default ProfileForm;
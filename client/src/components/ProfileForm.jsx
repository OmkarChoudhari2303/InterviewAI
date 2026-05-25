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
    const [loading, setLoading] = useState(false);

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
        if (loading) return;

        try{
            setLoading(true);
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
        }finally{
            setLoading(false);
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
            disabled={loading}
            />

            <textarea 
            name="bio" 
            placeholder="Write about yourself" 
            value={formData.bio}
            onChange={handleChange}
            disabled={loading}
            className="
            w-full
            h-32
            p-3
            rounded-lg
            bg-black
            border
            border-zinc-700
            outline-none
            disabled:opacity-50
            "/>

            <InputField
            name="githubUrl"
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={handleChange}
            disabled={loading}
            />

            <InputField
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleChange}
            disabled={loading}
            />
            
            <button
            disabled={loading}
            className="
            bg-white
            text-black
            px-6
            py-3
            rounded-lg
            font-semibold
            disabled:opacity-50
            flex
            items-center
            gap-2
            "
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                    </>
                ) : "Save Profile"}
            </button>
        </form>
    )
}

export default ProfileForm;
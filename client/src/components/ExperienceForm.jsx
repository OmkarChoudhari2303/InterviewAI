import { useState, useEffect } from "react";

import axiosInstance from "../api/axios.js";

import InputField from "./InputField.jsx";

function ExperienceForm(){
    const [formData,setFormData] = useState({
        companyName:"",
        role:"",
        description:"",
        startDate:"",
        endDate:"",
        currentlyWorking:false
    })
    const [experienceList, setExperienceList] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/experience", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExperienceList(response.data);
            } catch (error) {
                console.log("Error fetching experiences:", error);
            }
        };
        fetchExperiences();
    }, []);

    const handleChange = (e)=>{
        const {name, value, type, checked} = e.target

        setFormData({
            ...formData,
            [name]: type === "checkbox"
            ? checked
            : value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if (loading) return;

        try{
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await axiosInstance.post(
                "/experience/add",formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Experience Added");
            setExperienceList((prev) => [...prev, response.data])
            setFormData({
                companyName:"",
                role:"",
                description:"",
                startDate:"",
                endDate:"",
                currentlyWorking:false
            })
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (loading) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axiosInstance.delete(`/experience/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setExperienceList((prev) => prev.filter((exp) => exp.id !== id));
        } catch (error) {
            console.log("Error deleting experience record:", error);
            alert("Failed to delete experience record");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <form
            onSubmit={handleSubmit}
            className="space-y-4"
            >
                <h2 className="text-2xl font-bold">
                    Experience
                </h2>

                <InputField
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                disabled={loading}
                />

                <InputField
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                />

                <textarea
                name="description"
                placeholder="Experience description"
                value={formData.description}
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
                "
                />

                <InputField
                name="startDate"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                />

                <InputField
                name="endDate"
                placeholder="End Date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                />

                <label className="flex gap-2 items-center">
                    <input 
                    type="checkbox" 
                    name="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onChange={handleChange}
                    disabled={loading}
                    />
                    Currently Working Here
                </label>

                <button
                disabled={loading}
                className="
                bg-white
                text-black
                px-6
                py-3
                rounded-lg
                font-semibold
                cursor-pointer
                hover:bg-zinc-200
                transition
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
                            Adding...
                        </>
                    ) : "Add Experience"}
                </button>
            </form>

            {experienceList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                    <h3 className="text-lg font-semibold text-zinc-400">Work Experience History</h3>
                    <div className="space-y-2">
                        {experienceList.map((exp) => (
                            <div key={exp.id} className="flex justify-between items-start bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700/50 transition">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-white">{exp.companyName}</h4>
                                    <p className="text-sm text-zinc-450">{exp.role}</p>
                                    {exp.description && <p className="text-xs text-zinc-400 mt-1 whitespace-pre-wrap">{exp.description}</p>}
                                    <p className="text-xs text-zinc-500">
                                        {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(exp.id)}
                                    disabled={loading}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium bg-red-950/40 px-2 py-1 rounded transition cursor-pointer disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExperienceForm;
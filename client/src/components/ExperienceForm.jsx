import { useState, useEffect } from "react";

import axiosInstance from "../api/axios.js";

import InputField from "./InputField.jsx";

const CalendarIcon = ({ disabled }) => (
    <svg 
    className={`w-5 h-5 transition-colors ${disabled ? "text-zinc-600 opacity-40" : "text-zinc-400"}`} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="2"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    } catch (e) {
        return dateStr;
    }
};

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

        setFormData((prev) => {
            const nextData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            };
            if (name === "currentlyWorking" && checked) {
                nextData.endDate = "";
            }
            return nextData;
        });
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-400">
                            Start Date
                        </label>
                        <InputField
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        disabled={loading}
                        icon={<CalendarIcon disabled={loading} />}
                        onClick={(e) => {
                            try { e.target.showPicker(); } catch (err) {}
                        }}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={`text-sm font-medium transition-colors ${formData.currentlyWorking ? "text-zinc-650 opacity-40" : "text-zinc-400"}`}>
                            End Date
                        </label>
                        <InputField
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={loading || formData.currentlyWorking}
                        icon={<CalendarIcon disabled={loading || formData.currentlyWorking} />}
                        onClick={(e) => {
                            if (!formData.currentlyWorking) {
                                try { e.target.showPicker(); } catch (err) {}
                            }
                        }}
                        className={formData.currentlyWorking ? "opacity-30 cursor-not-allowed bg-zinc-950 border-zinc-800" : ""}
                        />
                    </div>
                </div>

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
                                        {formatDate(exp.startDate)} - {exp.currentlyWorking ? "Present" : formatDate(exp.endDate)}
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
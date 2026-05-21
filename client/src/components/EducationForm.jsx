import { useState, useEffect } from "react";

import axiosInstance from "../api/axios.js";

import InputField from "./InputField.jsx";

function EducationForm(){
    const [formData,setFormData] = useState({
        collegeName:"",
        degree:"",
        fieldOfStudy:"",
        startYear:"",
        endYear:""
    })
    const [educationList, setEducationList] = useState([])

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/education", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEducationList(response.data);
            } catch (error) {
                console.log("Error fetching education:", error);
            }
        };
        fetchEducation();
    }, []);

    const handleChange = (e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            const token = localStorage.getItem("token");

            const response = await axiosInstance.post(
                "/education/add",
                formData,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Education added")
            setEducationList((prev) => [...prev, response.data])
            setFormData({
                collegeName: "",
                degree: "",
                fieldOfStudy: "",
                startYear: "",
                endYear: ""
            })
        }catch(error){
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.delete(`/education/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEducationList((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            console.log("Error deleting education record:", error);
            alert("Failed to delete education record");
        }
    };

    return(
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <form
            onSubmit={handleSubmit}
            className="space-y-4"
            >
                <h2 className="text-2xl font-bold">
                    Education
                </h2>

                <InputField
                name="collegeName"
                placeholder="College Name"
                value={formData.collegeName}
                onChange={handleChange}
                />

                <InputField
                name="degree"
                placeholder="Degree"
                value={formData.degree}
                onChange={handleChange}
                />

                <InputField
                name="fieldOfStudy"
                placeholder="Field Of Study"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                />

                <InputField
                name="startYear"
                placeholder="Start Year"
                value={formData.startYear}
                onChange={handleChange}
                />

                <InputField
                name="endYear"
                placeholder="End Year"
                value={formData.endYear}
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
                cursor-pointer
                hover:bg-zinc-200
                transition
                "
                >
                    Add Education
                </button>
            </form>

            {educationList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                    <h3 className="text-lg font-semibold text-zinc-400">Education History</h3>
                    <div className="space-y-2">
                        {educationList.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-start bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700/50 transition">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-white">{edu.collegeName}</h4>
                                    <p className="text-sm text-zinc-400">{edu.degree} in {edu.fieldOfStudy}</p>
                                    <p className="text-xs text-zinc-500">{edu.startYear} - {edu.endYear}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(edu.id)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium bg-red-950/40 px-2 py-1 rounded transition cursor-pointer"
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

export default EducationForm;
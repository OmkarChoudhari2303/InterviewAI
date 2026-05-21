import { useState, useEffect } from "react";

import axiosInstance from "../api/axios.js";

import InputField from "./InputField.jsx";

function SkillsForm(){
    const [skill,setSkill] = useState("")
    const [skillsList, setSkillsList] = useState([])

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/skills", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSkillsList(response.data);
            } catch (error) {
                console.log("Error fetching skills:", error);
            }
        };
        fetchSkills();
    }, []);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!skill.trim()) return;

        try{
            const token = localStorage.getItem("token");

            const response = await axiosInstance.post(
                "/skills/add",
                {
                    name: skill
                },
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            alert("Skill Added")
            setSkillsList((prev) => [...prev, response.data])
            setSkill("")
        }catch(error){
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.delete(`/skills/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSkillsList((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.log("Error deleting skill:", error);
            alert("Failed to delete skill");
        }
    };

    return(
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <form 
            onSubmit={handleSubmit}
            className="space-y-4"
            >
                <h2 className="text-2xl font-bold">
                    Skills
                </h2>

                <InputField
                    name="skill"
                    placeholder="Enter Skills"
                    value={skill}
                    onChange={(e)=> setSkill(e.target.value)}
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
                    Add Skill
                </button>
            </form>

            {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800">
                    {skillsList.map((s) => (
                        <div
                            key={s.id}
                            className="flex items-center gap-2 bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-zinc-700 transition"
                        >
                            <span>{s.name}</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(s.id)}
                                className="text-zinc-500 hover:text-red-400 font-bold transition cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SkillsForm;
import { useState, useEffect } from "react";

import InputField from "./InputField.jsx";

import axiosInstance from "../api/axios.js";

function ProjectForm(){
    const [formData,setFormData] = useState({
        title:"",
        description:"",
        techStack:""
    })
    const [projectsList, setProjectsList] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosInstance.get("/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProjectsList(response.data);
            } catch (error) {
                console.log("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try{
            const token = localStorage.getItem("token");

            const response = await axiosInstance.post(
                "/projects/add",
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Project Added")
            setProjectsList((prev) => [...prev, response.data])
            setFormData({
                title: "",
                description: "",
                techStack: ""
            })
        }catch(error){
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.delete(`/projects/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjectsList((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.log("Error deleting project:", error);
            alert("Failed to delete project");
        }
    };

    return(
        <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <form
            onSubmit={handleSubmit}
            className="space-y-4"
            >
                <h2 className="text-2xl font-bold">
                    Projects
                </h2>

                <InputField
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                />

                <textarea
                name="description"
                placeholder="Project description"
                value={formData.description}
                onChange={handleChange}
                className="
                w-full
                h-32
                p-3
                rounded-lg
                bg-black
                border
                border-zinc-700
                "
                />

                <InputField
                name="techStack"
                placeholder="React, Node.js..."
                value={formData.techStack}
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
                >Add Project</button>

            </form>

            {projectsList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                    <h3 className="text-lg font-semibold text-zinc-400">Current Projects</h3>
                    <div className="space-y-2">
                        {projectsList.map((p) => (
                            <div key={p.id} className="flex justify-between items-start bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700/50 transition">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-white">{p.title}</h4>
                                    <p className="text-sm text-zinc-400">{p.description}</p>
                                    <p className="text-xs text-zinc-500 font-mono">Stack: {p.techStack}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(p.id)}
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

export default ProjectForm;

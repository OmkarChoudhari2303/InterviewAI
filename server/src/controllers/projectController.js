import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";

export const addProject = async (req,res)=>{
    try{
        const {title,description,techStack} = req.body;

        const project = await prisma.project.create({
            data:{
                title,
                description,
                techStack,
                userId: req.user.id
            }
        })

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on project add:", err);
        });

        res.status(201).json(project);
    }catch(error){
        console.log(error);

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        await prisma.project.delete({
            where: { id }
        });

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on project delete:", err);
        });

        res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
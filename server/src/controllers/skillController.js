import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";

export const addSkill = async (req,res)=>{
    try{
        const {name} = req.body;

        const skill = await prisma.skill.create({
            data:{
                name,
                userId: req.user.id
            }
        })

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on skill add:", err);
        });

        res.status(201).json(skill)
    }catch(error){
        console.log(error);
        
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getSkills = async (req, res) => {
    try {
        const skills = await prisma.skill.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json(skills);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await prisma.skill.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        await prisma.skill.delete({
            where: { id }
        });

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on skill delete:", err);
        });

        res.status(200).json({
            message: "Skill deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
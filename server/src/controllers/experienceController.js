import { encodeBase64 } from "bcryptjs";
import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";

export const addExperiece = async(req,res)=>{
    try{
        const {companyName,role,description,startDate,endDate,currentlyWorking} = req.body;

        const experience = await prisma.experience.create({
            data:{
                companyName,
                role,
                description,
                startDate,
                endDate,
                currentlyWorking,
                userId: req.user.id
            }
        })

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on experience add:", err);
        });

        res.status(201).json(experience)
    }catch(error){
        console.log(error)

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getExperiences = async (req, res) => {
    try {
        const experiences = await prisma.experience.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json(experiences);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await prisma.experience.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!experience) {
            return res.status(404).json({
                message: "Experience record not found"
            });
        }

        await prisma.experience.delete({
            where: { id }
        });

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on experience delete:", err);
        });

        res.status(200).json({
            message: "Experience record deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";

export const addEducation = async (req,res)=>{
    try{
        const {collegeName,degree,fieldOfStudy,startYear,endYear} = req.body;

        const education = await prisma.education.create({
            data:{
                collegeName,
                degree,
                fieldOfStudy,
                startYear,
                endYear,
                userId: req.user.id
            }
        })

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on education add:", err);
        });

        res.status(201).json(education)
    }catch(error){
        console.log(error);

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getEducations = async (req, res) => {
    try {
        const educations = await prisma.education.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json(educations);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const education = await prisma.education.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!education) {
            return res.status(404).json({
                message: "Education record not found"
            });
        }

        await prisma.education.delete({
            where: { id }
        });

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on education delete:", err);
        });

        res.status(200).json({
            message: "Education record deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
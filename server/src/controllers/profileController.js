import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";

export const getProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user.id }
        });
        res.status(200).json(profile || { name: "", bio: "", githubUrl: "", linkedinUrl: "" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const createProfile = async (req,res)=>{
    try{
        const{name,bio,githubUrl,linkedinUrl} = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId: req.user.id },
            update: {
                name,
                bio,
                githubUrl,
                linkedinUrl,
            },
            create: {
                name,
                bio,
                githubUrl,
                linkedinUrl,
                userId: req.user.id
            }
        })

        // Auto-sync vectors in background
        syncUserVectors(req.user.id).catch((err) => {
            console.error("Auto vector sync failed on profile update:", err);
        });

        res.status(200).json(profile);

    }catch(error){
        console.log(error);

        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}
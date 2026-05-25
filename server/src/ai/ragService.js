import { retrieveRelevantChunks } from "../vector/retrieveRelevantChunks.js";
import { buildRAGPrompt } from "./buildRAGPrompt.js";
import { generateGeminiResponse } from "./providers/geminiProvider.js";

//21-05-26
import { retrieveConversationMemory } from "../vector/retrieveConversationMemory.js";

import { deduplicateMemory } from "./deduplicateMemory.js";
import { rankMemory } from "./rankMemory.js";
import { compressMemory } from "./compressMemory.js";
import prisma from "../lib/prisma.js";

export const generateRAGResponse = async ({ userId, prompt }) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Fetch user data from DB to check if they have any details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                skills: true,
                projects: true,
                educations: true,
                experiences: true
            }
        });

        const hasProfileData = user && user.profile && (
            (user.profile.name && user.profile.name.trim() !== "") ||
            (user.profile.bio && user.profile.bio.trim() !== "") ||
            (user.profile.githubUrl && user.profile.githubUrl.trim() !== "") ||
            (user.profile.linkedinUrl && user.profile.linkedinUrl.trim() !== "")
        );

        const hasSkills = user && user.skills && user.skills.length > 0;
        const hasProjects = user && user.projects && user.projects.length > 0;
        const hasEducations = user && user.educations && user.educations.length > 0;
        const hasExperiences = user && user.experiences && user.experiences.length > 0;

        if (!hasProfileData && !hasSkills && !hasProjects && !hasEducations && !hasExperiences) {
            return {
                response: "No data available, please Fill the data in Dashboard",
                retrievedChunks: []
            };
        }

        // retrieve relevant memory

        const retrievedChunks =
            await retrieveRelevantChunks({

                userId,

                query: prompt
            })

        const conversationMemory =
            await retrieveConversationMemory({

                userId,

                query: prompt
            })

        let combinedMemory = [
            ...retrievedChunks,
            ...conversationMemory
        ]

        combinedMemory = deduplicateMemory(combinedMemory)
        combinedMemory = rankMemory(combinedMemory)
        combinedMemory = compressMemory({
            chunks: combinedMemory,
            limit: 6
        })

        // build contextual prompt

        const finalPrompt =
            buildRAGPrompt({

                userPrompt: prompt,

                combinedMemory
            })

        // generate AI response

        const response =
            await generateGeminiResponse(
                finalPrompt
            )

        return {
            response,
            retrievedChunks
        }
    } catch (error) {
        console.log(error)

        throw new Error(
            "RAG generation failed"
        )
    }
}
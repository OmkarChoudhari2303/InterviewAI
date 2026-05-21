import { retrieveRelevantChunks } from "../vector/retrieveRelevantChunks.js";
import { retrieveConversationMemory } from "../vector/retrieveConversationMemory.js";
import { buildRAGPrompt } from "./buildRAGPrompt.js";
import { generateGeminiStream } from "./providers/geminiProvider.js";
import { deduplicateMemory } from "./deduplicateMemory.js";
import { rankMemory } from "./rankMemory.js";
import { compressMemory } from "./compressMemory.js";
import prisma from "../lib/prisma.js";
import { syncUserVectors } from "../vector/syncUserVectors.js";
import { pineconeIndex } from "../vector/pinecone.js";

export const generateRAGStream = async ({ userId, prompt }) => {
    try {
        // --- SELF-HEALING FALLBACK ---
        try {
            if (userId) {
                // Check if user has any profile/skills/education/etc. vectors in Pinecone
                const checkVectors = await pineconeIndex.query({
                    vector: Array(768).fill(0),
                    topK: 1,
                    filter: {
                        userId,
                        type: {
                            $in: ["profile", "skills", "project", "education", "experience"]
                        }
                    }
                });
                const hasVectors = checkVectors.matches && checkVectors.matches.length > 0;
                
                if (!hasVectors) {
                    console.log(`[Self-Healing] User ${userId} has no profile vectors in Pinecone. Checking DB...`);
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
                    
                    if (user && (user.profile || user.skills?.length > 0 || user.projects?.length > 0 || user.educations?.length > 0 || user.experiences?.length > 0)) {
                        console.log(`[Self-Healing] User has details in DB. Syncing vectors to Pinecone...`);
                        await syncUserVectors(userId);
                    }
                }
            }
        } catch (syncErr) {
            console.error("[Self-Healing] Failed to auto-sync user vectors:", syncErr);
        }
        // ------------------------------

        // retrieve profile memory

        const retrievedChunks = await retrieveRelevantChunks({
            userId,
            query: prompt
        })

        // retrieve conversation memory
        const conversationMemory = await retrieveConversationMemory({ userId, query: prompt })

        // combine memory
        let combinedMemory = [...retrievedChunks, ...conversationMemory]

        // deduplicate
        combinedMemory = deduplicateMemory(combinedMemory)

        // rank memory
        combinedMemory = rankMemory(combinedMemory)

        // compress memory
        combinedMemory = compressMemory({
            chunks: combinedMemory,
            limit: 6
        })

        // debug logging
        console.log("\n========== FINAL MEMORY ==========")

        console.dir(
            combinedMemory,
            { depth: null }
        )

        // build final prompt

        const finalPrompt =
            buildRAGPrompt({
                userPrompt: prompt,
                combinedMemory
            })

        // real Gemini streaming

        const stream = await generateGeminiStream(finalPrompt)

        return stream
    } catch (error) {
        console.log(error)
        throw new Error("RAG streaming failed")
    }
}
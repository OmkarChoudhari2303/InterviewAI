import prisma from "../lib/prisma.js"
import { pineconeIndex } from "./pinecone.js"
import { generateEmbedding } from "../ai/embeddingService.js"
import { buildUserChunks } from "./buildUserChunks.js"

const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Pinecone connection failed (attempt ${i + 1}/${retries}), retrying in ${delay}ms... Error:`, err.message || err);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

export const syncUserVectors = async (userId) => {
    try {
        // fetch full user data

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: {
                        user: true
                    }
                },
                skills: true,
                projects: true,
                educations: true,
                experiences: true
            }
        })

        if (!user) {
            throw new Error(
                "User not found"
            )
        }

        // build semantic chunks

        const chunks = buildUserChunks({
            profile: user.profile,
            skills: user.skills,
            projects: user.projects,
            educations: user.educations,
            experiences: user.experiences
        })

        // generate vectors sequentially to avoid socket / API rate issues
        const vectors = []
        for (let index = 0; index < chunks.length; index++) {
            const chunk = chunks[index]
            const embedding = await generateEmbedding(chunk.text)
            vectors.push({
                id: `${userId}-${chunk.type}-${index}`,
                values: embedding,
                metadata: {
                    userId,
                    type: chunk.type,
                    text: chunk.text
                }
            })
        }

        // query old vectors by metadata filter first to get their IDs
        const queryResponse = await retry(() => pineconeIndex.query({
            vector: Array(768).fill(0),
            filter: {
                userId: userId,
                type: {
                    $in: [
                        "profile",
                        "skills",
                        "project",
                        "education",
                        "experience"
                    ]
                }
            },
            topK: 1000,
            includeMetadata: false
        }))

        const oldIds = queryResponse.matches?.map((m) => m.id) || []
        if (oldIds.length > 0) {
            await retry(() => pineconeIndex.deleteMany({ ids: oldIds }))
        }

        // upload fresh vectors
        console.log("Sync User Vectors:", {
            userId,
            chunksCount: chunks.length,
            vectorsCount: vectors.length
        })

        if (vectors.length > 0) {
            await retry(() => pineconeIndex.upsert({
                records: vectors
            }))
        }

        return {
            success: true,
            count: vectors.length
        }
    } catch (error) {
        console.log(error)

        throw new Error(
            "Vector synchronization failed"
        )
    }
}
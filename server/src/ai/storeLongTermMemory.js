import prisma from "../lib/prisma.js"
import { summarizeConversationMemory } from "./summarizeConversationMemory.js"
import { scoreMemoryImportance } from "./scoreMemoryImportance.js"
import { generateEmbedding } from "./embeddingService.js"
import { pineconeIndex } from "../vector/pinecone.js"

export const storeLongTermMemory = async({userId,messages})=>{
    try{
        // summarize memory
        const summary = await summarizeConversationMemory(messages)

        // importance scoring
        const importance = scoreMemoryImportance(summary)

        // store in DB
        const memory = await prisma.memorySummary.create({
            data: {
                userId,
                summary,
                importance
            }
        })

        // embedding
        const embedding = await generateEmbedding(summary)

        // vector upload
        await pineconeIndex.upsert({
            records: [
                {
                    id: `long-memory-${memory.id}`,
                    values: embedding,
                    metadata: {
                        userId,
                        memoryType: "long_term_memory",
                        text: summary,
                        importance
                    }
                }
            ]
        })

        return memory
    }catch(error){
        console.error("long-term memory storage failed:", error);
        return null;
    }
}

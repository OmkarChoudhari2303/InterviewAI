import { pineconeIndex } from "./pinecone.js";

import { generateEmbedding } from "../ai/embeddingService.js";

export const storeConversationMemory = async ({ userId, conversationId, role, content }) => {
    try {
        if (!userId) {
            console.warn("storeConversationMemory called without userId");
            return false;
        }
        // generate embedding

        const embedding = await generateEmbedding(content)

        //unique vector id

        const vectorId = `memory-${conversationId}-${Date.now()}`

        // upload vector

        await pineconeIndex.upsert({
            records: [
                {
                    id: vectorId,
                    values: embedding,
                    metadata: {
                        userId,
                        memoryType: "conversation",
                        conversationId,
                        role,
                        text: content,
                    }
                }
            ]
        })

        return true
    } catch (error) {
        console.error("Conversation memory storage failed:", error);
        return false;
    }
}
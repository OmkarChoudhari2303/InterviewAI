import { generateEmbedding } from "../ai/embeddingService.js";
import { pineconeIndex } from "./pinecone.js";

export const retrieveConversationMemory = async ({ userId, query, topK = 5 }) => {
    try {
        if (!userId) {
            console.warn("retrieveConversationMemory called without userId");
            return [];
        }
        const queryEmbedding = await generateEmbedding(query);

        const searchResults = await pineconeIndex.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
            filter: {
                userId,
                memoryType: {
                    $in: [
                        "conversation",
                        "long_term_memory"
                    ]
                }
            }
        });

        const relevantMemories = (searchResults.matches || []).map((match) => ({
            text: match.metadata?.text || "",
            role: match.metadata?.role || "",
            score: match.score
        }));

        return relevantMemories;
    } catch (error) {
        console.error("Conversation memory retrieval failed (falling back to empty memories):", error);
        return [];
    }
}

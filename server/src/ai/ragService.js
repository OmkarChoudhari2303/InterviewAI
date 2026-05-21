import { retrieveRelevantChunks } from "../vector/retrieveRelevantChunks.js";
import { buildRAGPrompt } from "./buildRAGPrompt.js";
import { generateGeminiResponse } from "./providers/geminiProvider.js";

//21-05-26
import { retrieveConversationMemory } from "../vector/retrieveConversationMemory.js";

import { deduplicateMemory } from "./deduplicateMemory.js";
import { rankMemory } from "./rankMemory.js";
import { compressMemory } from "./compressMemory.js";

export const generateRAGResponse = async ({ userId, prompt }) => {
    try {
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
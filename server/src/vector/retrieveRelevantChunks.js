// import { pineconeIndex } from "./pinecone.js"

// import { generateEmbedding } from "../ai/embeddingService.js"

// export const retrieveRelevantChunks = async ({ userId, query, topK = 5 }) => {
//     try {
//         //generate embedding
//         // for user query

//         const queryEmbedding = await generateEmbedding(query, {
//             taskType: "RETRIEVAL_QUERY"
//         });

//         //semantic similarity search
//         const results = await pineconeIndex.query({
//             vector: queryEmbedding,
//             topK,
//             includeMetadata: true,
//             filter: {
//                 userId: { $eq: userId }
//             }
//         })

//         //extract chunk text
//         const relevantChunks =
//             searchResults.matches.map(
//                 (match) => ({
//                     text:
//                         match.metadata.text,

//                     type:
//                         match.metadata.type,

//                     score:
//                         match.score
//                 })
//             )

//         return relevantChunks
//     } catch (error) {
//         console.error("Vector Search Error: ", error);

//         throw new Error("Semantic search failed")
//     }
// }
//..............................................................................................

import { generateEmbedding }
    from "../ai/embeddingService.js"

import { pineconeIndex }
    from "./pinecone.js"

export const retrieveRelevantChunks =
    async ({
        userId,
        query,
        topK = 5
    }) => {

        try {

            console.log("\n========== QUERY ==========")
            console.log(query)

            if (!userId) {
                console.warn("retrieveRelevantChunks called without userId");
                return [];
            }

            // generate query embedding

            const queryEmbedding =
                await generateEmbedding(query)

            console.log(
                "\nEmbedding Length:",
                queryEmbedding.length
            )

            // semantic search

            const searchResults =
                await pineconeIndex.query({

                    vector: queryEmbedding,

                    topK,

                    includeMetadata: true,

                    filter: {
                        userId,
                        type: {
                            $in: [
                                "profile",
                                "skills",
                                "project",
                                "education",
                                "experience"
                            ]
                        }
                    }
                })

            console.log(
                "\n========== RAW SEARCH RESULTS =========="
            )

            console.dir(
                searchResults,
                { depth: null }
            )

            // extract chunk text

            const relevantChunks =
                (searchResults.matches || []).map(
                    (match) => ({

                        text:
                            match.metadata?.text || "",

                        type:
                            match.metadata?.type || "",

                        score:
                            match.score
                    })
                )

            console.log(
                "\n========== RETRIEVED CHUNKS =========="
            )

            console.dir(
                relevantChunks,
                { depth: null }
            )

            return relevantChunks;
        } catch (error) {

            console.error("Semantic retrieval failed (falling back to empty chunks):", error);
            return [];
        }
    }
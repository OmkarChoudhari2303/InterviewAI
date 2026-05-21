import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateEmbedding = async (text) => {
    try {
        const response = await genAI.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
            config: {
                outputDimensionality: 768
            }
        });
        return response.embeddings[0].values;
    } catch (error) {
        console.error("Embedding generation error:", error);
        throw new Error("Embedding generation failed");
    }
}
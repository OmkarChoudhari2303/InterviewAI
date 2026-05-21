import { generateGeminiResponse } from "./providers/geminiProvider.js";

export const generateConversationTitle = async (prompt) => {
    try {
        const titlePrompt = `Generate a short conversation title for the following user message.
        Rules:
        -maximum 6 words
        -no quotes
        -concise
        -professional
        Message:${prompt}
        `

        const title = await generateGeminiResponse(titlePrompt)

        return title.trim()
    } catch (error) {
        console.log(error);

        return "New Conversation"
    }
}
import {generateGeminiResponse} from "./providers/geminiProvider.js"

export const summarizeConversationMemory = async(messages = [])=>{
    try{
        const conversationText = messages.map((message)=>{
            return `${message.role}:${message.content}`
        }).join("\n")

        const prompt = `
        You are an AI memory summarizer.

        Summarize the important information
        from this conversation.

        Focus on:
        - user goals
        - skills
        - interests
        - preferences
        - important context
        - learning topics
        - interview preparation

        Keep summary concise but meaningful.

        CONVERSATION:
        ${conversationText}
        `

        const summary = await generateGeminiResponse(prompt)

        return summary
    }catch(error){
        console.log(error)

        throw new Error("Memory summarization failed")
    }
}

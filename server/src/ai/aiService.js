import { generateGeminiResponse } from "./providers/geminiProvider.js";

export const generateAIResponse = async({provider,prompt})=>{
    switch(provider){
        case "gemini":
            return await generateGeminiResponse(prompt);

            default:
                throw new Error("Invalid AI provider")
    }
}
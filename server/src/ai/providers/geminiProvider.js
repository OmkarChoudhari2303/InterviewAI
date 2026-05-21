import { GoogleGenAI } from "@google/genai"; // dont go with chatgpt , just go with the documents given on google studio, gpt is not updated with latest docs.

/**
 * Model : Gemini 3 flash preview.
 * Requests Per Minute (RPM): 15 requests
 * Tokens Per Minute (TPM): 1 million tokens
 * Requests Per Day (RPD): 1,500 requests
 */
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateGeminiResponse = async (prompt) => {
  try {

    const result = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      contents: prompt,
    })

    const response = result.text;

    return response;
  } catch (error) {
    console.log(error);

    throw new Error("Gemini generation failed");
  }
};

export const generateGeminiStream = async (prompt) => {
  try {
    const responseStream = await genAI.models.generateContentStream({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      contents: prompt,
    });

    return responseStream
  } catch (error) {
    console.log(error)

    throw new Error(
      "Gemini streaming failed"
    )
  }
}

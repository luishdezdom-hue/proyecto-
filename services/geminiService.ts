import { GoogleGenAI } from "@google/genai";

// Fix: Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNewsSummary = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      // Fix: Use 'gemini-3-flash-preview' for basic text tasks
      model: 'gemini-3-flash-preview',
      contents: `Write a short, engaging 2-sentence summary for a university news article about: ${topic}. Keep it professional but exciting for students.`,
    });
    // Fix: Access .text property directly, do not call as a method
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Error generating news:", error);
    return "Could not generate content at this time.";
  }
};

export const generateUniversityInsights = async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            // Fix: Use 'gemini-3-flash-preview' for basic text tasks
            model: 'gemini-3-flash-preview',
            contents: `You are a helpful university assistant. Answer the following query briefly for a student: ${query}`,
            config: {
                systemInstruction: "Keep answers under 50 words. Be polite and academic."
            }
        });
        // Fix: Access .text property directly
        return response.text || "No insight available.";
    } catch (error) {
        console.error("Gemini Error", error);
        return "Service unavailable.";
    }
}
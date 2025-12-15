import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateNewsSummary = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Unable to generate summary.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, engaging 2-sentence summary for a university news article about: ${topic}. Keep it professional but exciting for students.`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Error generating news:", error);
    return "Could not generate content at this time.";
  }
};

export const generateUniversityInsights = async (query: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful university assistant. Answer the following query briefly for a student: ${query}`,
            config: {
                systemInstruction: "Keep answers under 50 words. Be polite and academic."
            }
        });
        return response.text || "No insight available.";
    } catch (error) {
        console.error("Gemini Error", error);
        return "Service unavailable.";
    }
}

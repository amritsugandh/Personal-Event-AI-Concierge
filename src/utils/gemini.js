import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const getAIReasoning = async (userProfile, recommendedSessions, userQuery) => {
  if (!genAI) {
    return "Intelligence Note: Connect your Gemini API key in the .env file to enable deep natural language reasoning for these matches!";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const context = `
      User Profile: ${userProfile.name}, bio: ${userProfile.bio}, interests: ${userProfile.interests.join(', ')}
      Recommended Sessions: ${JSON.stringify(recommendedSessions.map(s => ({ title: s.title, room: s.room, time: s.time })))}
      User Query: ${userQuery}
      
      Task: Act as a premium event concierge. Briefly explain why these sessions are a great fit for the user's specific background and interests. Be encouraging and concise.
    `;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Concierge is currently processing your matches. High-reasoning insights will appear here once the intelligence bridge is fully synchronized.";
  }
};

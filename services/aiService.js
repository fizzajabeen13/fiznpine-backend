require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const MODEL_NAME = "gemini-flash-lite-latest";

const systemInstruction = `
You are FizNPine AI.
Your name is FizNPine.
You are a helpful, intelligent, friendly assistant built for a student chatbot project.
Keep answers clear, useful, and age-appropriate.
If the user asks for medical, legal, or financial advice, provide safe general guidance and suggest consulting a qualified professional.
IMPORTANT: Do NOT start your messages with "As FizNPine AI" or introduce yourself repeatedly. Just answer naturally.
`;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the backend.");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const extractText = (response) => {
  if (typeof response.text === "string") {
    return response.text.trim();
  }

  if (typeof response.text === "function") {
    return response.text().trim();
  }

  const parts =
    response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean) || [];

  return parts.join("\n").trim();
};

const generateAIResponse = async (prompt) => {
  const ai = getClient();

  try {
    console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = extractText(response);

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);

    throw new Error(error.message || "Gemini request failed.");
  }
};

module.exports = {
  generateAIResponse,
  MODEL_NAME,
};

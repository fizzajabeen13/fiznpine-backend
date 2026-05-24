require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const MODEL_NAME = "gemini-flash-latest";

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
        apiKey: process.env.GEMINI_API_KEY
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

    let response;

    try {
        response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.7
            }
        });
    } catch (error) {
        const message = [
            error?.message,
            error?.status,
            error?.code,
            error?.toString?.(),
            JSON.stringify(error)
        ].filter(Boolean).join(" ");

        if (
            message.toLowerCase().includes("leaked") ||
            message.toLowerCase().includes("permission_denied") ||
            message.toLowerCase().includes("permission denied") ||
            message.includes("PERMISSION_DENIED") ||
            message.includes("\"code\":403")
        ) {
            throw new Error("Gemini rejected this API key because it was reported as leaked. Rotate it in Google AI Studio and update backend/.env.");
        }

        throw new Error("Gemini request failed. Check the backend API key and quota.");
    }

    const text = extractText(response);

    if (!text) {
        throw new Error("Gemini returned an empty response.");
    }

    return text;
};

module.exports = {
    generateAIResponse,
    MODEL_NAME
};

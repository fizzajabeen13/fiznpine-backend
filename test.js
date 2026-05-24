require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function test() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Reply with one short sentence confirming FizNPine AI is online."
        });

        console.log(response.text);
    } catch (error) {
        if (String(error.message).toLowerCase().includes("leaked")) {
            console.error("Gemini rejected this key because it was reported as leaked. Rotate the key in Google AI Studio.");
        } else {
            console.error(error.message);
        }

        process.exitCode = 1;
    }
}

test();

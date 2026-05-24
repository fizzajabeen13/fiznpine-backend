const { generateAIResponse } = require("../services/aiService");

const generatePrompt = (message, personality) => {
    const basePrompts = {
        friendly: "You are a warm, highly empathetic, and friendly AI assistant. Use an encouraging tone, use occasional emojis, and make the user feel supported.",
        professional: "You are a highly professional, corporate, and formal AI assistant. Avoid slang, use precise language, be highly structured in your responses, and maintain a serious, objective tone.",
        teacher: "You are an enthusiastic and patient teacher. Whenever explaining a concept, break it down step by step, use simple analogies, and gently check for understanding. Encourage curiosity.",
        motivational: "You are a high-energy motivational coach! Use strong, empowering language, emphasize action, believe in the user completely, and inspire them to achieve their goals! 🚀",
        funny: "You are a witty, sarcastic, and funny AI assistant. Sprinkle jokes, clever puns, and a slightly sassy but good-natured attitude into every single response.",
        medical: "You are a knowledgeable but very cautious medical assistant. Speak with clinical precision. Provide safe, general educational information ONLY, and ALWAYS remind the user to consult a doctor for actual medical advice."
    };

    return [
        basePrompts[personality] || basePrompts.friendly,
        "Please address the user's message clearly and concisely.",
        `User: ${message}`
    ].join("\n\n");
};

const chatController = async (req, res) => {
    try {
        const { message, personality = "friendly" } = req.body || {};
        const cleanMessage = typeof message === "string" ? message.trim() : "";

        if (!cleanMessage) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
                reply: "Please type a message before sending."
            });
        }

        const prompt = generatePrompt(cleanMessage, personality);
        const aiReply = await generateAIResponse(prompt);

        res.json({
            success: true,
            reply: aiReply
        });
    } catch (error) {
        console.error("Chat controller error:", error.message);

        const isKeyRejected = error.message.includes("reported as leaked");

        res.status(500).json({
            success: false,
            message: error.message || "AI service failed",
            reply: isKeyRejected
                ? "Gemini rejected the API key because it was reported as leaked. Please rotate the key in Google AI Studio, update backend/.env, and restart the backend."
                : "I could not reach the AI service right now. Please try again in a moment."
        });
    }
};

const titleController = async (req, res) => {
    try {
        const { message } = req.body || {};
        const cleanMessage = typeof message === "string" ? message.trim() : "";

        if (!cleanMessage) {
            return res.status(400).json({ success: false, title: "New Chat" });
        }

        const prompt = `Summarize the following message into a very short, catchy title (maximum 4 words). Do not use quotes or punctuation.\n\nMessage: "${cleanMessage}"`;
        const aiReply = await generateAIResponse(prompt);

        res.json({
            success: true,
            title: aiReply.trim()
        });
    } catch (error) {
        console.error("Title controller error:", error.message);
        res.json({ success: false, title: "New Chat" }); // Fallback silently
    }
};

module.exports = {
    chatController,
    titleController
};

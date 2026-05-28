const { generateAIResponse } = require("../services/aiService");

// =============================
// PROMPT BUILDER
// =============================
const generatePrompt = (message, personality) => {
    const basePrompts = {
        friendly: "You are a warm, empathetic, and friendly AI assistant. Use a supportive tone.",
        professional: "You are a professional AI assistant. Be formal, structured, and precise.",
        teacher: "You are a patient teacher. Explain step by step with simple examples.",
        motivational: "You are a high-energy motivational coach. Inspire and push the user forward.",
        funny: "You are a witty, humorous AI assistant with light sarcasm.",
        medical: "You are a cautious medical assistant. Provide general info only and recommend doctors."
    };

    return `
${basePrompts[personality] || basePrompts.friendly}

User message:
${message}
`;
};

// =============================
// CHAT CONTROLLER
// =============================
const chatController = async (req, res) => {
    try {
        const { message, personality = "friendly" } = req.body || {};

        const cleanMessage = typeof message === "string" ? message.trim() : "";

        if (!cleanMessage) {
            return res.status(400).json({
                success: false,
                reply: "Message is required"
            });
        }

        const prompt = generatePrompt(cleanMessage, personality);

        console.log("🧠 Prompt sent to AI:", prompt);

        // =============================
        // SAFE AI CALL (NO CRASH VERSION)
        // =============================
        let aiReply;

        try {
            aiReply = await generateAIResponse(prompt);

            if (!aiReply || typeof aiReply !== "string") {
                throw new Error("Invalid AI response");
            }

        } catch (aiError) {
            console.error("❌ AI SERVICE ERROR:", aiError);

            return res.status(500).json({
                success: false,
                reply: "AI service is currently unavailable. Please check API key or backend logs."
            });
        }

        return res.json({
            success: true,
            reply: aiReply.trim()
        });

    } catch (error) {
        console.error("❌ CHAT CONTROLLER ERROR:", error);

        return res.status(500).json({
            success: false,
            reply: "Internal server error"
        });
    }
};

// =============================
// TITLE CONTROLLER (SAFE)
// =============================
const titleController = async (req, res) => {
    try {
        const { message } = req.body || {};
        const cleanMessage = typeof message === "string" ? message.trim() : "";

        if (!cleanMessage) {
            return res.json({
                success: false,
                title: "New Chat"
            });
        }

        const prompt = `
Summarize into a short 3–4 word chat title:
"${cleanMessage}"
Do not use quotes.
`;

        let aiReply;

        try {
            aiReply = await generateAIResponse(prompt);

            if (!aiReply) {
                throw new Error("Empty title response");
            }

        } catch (err) {
            console.error("❌ TITLE AI ERROR:", err);

            return res.json({
                success: false,
                title: "New Chat"
            });
        }

        return res.json({
            success: true,
            title: aiReply.trim()
        });

    } catch (error) {
        console.error("❌ TITLE CONTROLLER ERROR:", error);

        return res.json({
            success: false,
            title: "New Chat"
        });
    }
};

module.exports = {
    chatController,
    titleController
};
require("dotenv").config();

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models";

    const res = await fetch(url, {
        headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY
        }
    });

    const data = await res.json();

    console.log(JSON.stringify(data, null, 2));
}

listModels().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});

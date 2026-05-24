require("dotenv").config();

async function test() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: "Hello" }]
                }
            ]
        })
    });

    const data = await res.json();

    console.log(JSON.stringify(data, null, 2));
}

test().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});

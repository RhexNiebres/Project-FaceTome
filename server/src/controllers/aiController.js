const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generatePost = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Create a post based on this prompt: "${prompt}". Respond ONLY in JSON with this format: { "title": "title", "content": "post content" }`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const content = response.choices[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({ error: "AI response was not valid JSON." });
    }

    res.status(201).json(parsed); 
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate post with AI" });
  }
};

const Groq = require("groq-sdk");
const Filter = require("bad-words");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const filter = new Filter();

exports.generatePost = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Input is required" });
    }

    if (filter.isProfane(prompt)) {
      return res.status(400).json({ error: "Please Avoid vulgar words. Please try again" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that responds ONLY with valid JSON (no preface, no explanation). Format: { "title": "title", "content": "content" }. Feel free to include emojis or special characters if relevant.`,
        },
        {
          role: "user",
          content: `Create a medium length post based on this prompt: "${prompt}". Respond ONLY with valid JSON (no preface, no explanation). Format: { "title": "title", "content": "content" }`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Something went wrong please try again" });
    }

    if (filter.isProfane(parsed.title) || filter.isProfane(parsed.content)) {
      return res.status(400).json({
        error: "Inappropriate content. Please try again with a cleaner input.",
      });
    }

    res.status(201).json(parsed);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate post please try again" });
  }
};

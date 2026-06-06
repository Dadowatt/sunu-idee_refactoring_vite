export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
        messages: [
          {
            role: "system",
            content: "Tu réponds uniquement par un mot: pedagogie, campus, technique, evenement"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    const message = data?.choices?.[0]?.message?.content;

    res.status(200).json({
      result: message?.trim()?.toLowerCase() || "campus"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "campus" });
  }
}
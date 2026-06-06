const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function appelerOpenRouter(prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Sunu-Idee",
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
        messages: [
          {
            role: "system",
            content:
              "Tu réponds uniquement par un mot: pedagogie, campus, technique, evenement"
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

    return message.trim().toLowerCase();

  } catch (error) {
    console.error("Erreur OpenRouter :", error);
    return "campus";
  }
}
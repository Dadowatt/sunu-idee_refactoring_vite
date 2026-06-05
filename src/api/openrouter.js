const API_URL = "https://openrouter.ai/api/v1/chat/completions";

/*******************************************
 * Appel OpenRouter pour classification IA
 *******************************************/
export async function appelerOpenRouter(prompt) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Erreur API OpenRouter");
    }

    const data = await response.json();

    const message = data?.choices?.[0]?.message?.content;

    if (!message) {
      throw new Error("Réponse IA vide");
    }

    return message.trim().toLowerCase();
  } catch (error) {
    console.error("Erreur OpenRouter :", error);

    // fallback obligatoire
    return "technique";
  }
}
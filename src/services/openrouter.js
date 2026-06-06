export async function appelerOpenRouter(prompt) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    return data.result || "campus";
  } catch (error) {
    console.error("Erreur OpenRouter :", error);
    return "campus";
  }
}
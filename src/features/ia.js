import { appelerOpenRouter } from "../services/openrouter.js";

export async function detecterCategorieIA(titre, description) {
  const prompt = `
Tu es un système de classification.

Tu dois choisir UNE seule catégorie parmi :

pedagogie
campus
technique
evenement

Règles :
- cours, enseignants, examens => pedagogie
- vie étudiante, bibliothèque => campus
- application, site web => technique
- conférence, atelier => evenement

Réponds uniquement par un mot.

Titre: ${titre}
Description: ${description}
`;

  const result = await appelerOpenRouter(prompt);

  return result;
}

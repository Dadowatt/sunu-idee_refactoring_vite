// UI FORM ERROR
// Affiche une erreur
export function afficherErreur(message) {
  const erreur = document.getElementById("message-erreur");
  erreur.textContent = message;
  erreur.classList.remove("hidden");
}

// Cache l'erreur
export function cacherErreur() {
  const erreur = document.getElementById("message-erreur");
  erreur.textContent = "";
  erreur.classList.add("hidden");
}
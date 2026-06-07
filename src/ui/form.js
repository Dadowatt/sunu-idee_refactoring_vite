// Active le mode édition
export function activerModeEdition(btnSubmit) {
    console.log("MODE EDITION");
    btnSubmit.textContent = "Mettre à jour";

    btnSubmit.classList.remove("from-blue-500", "to-indigo-600");
    btnSubmit.classList.add("from-yellow-400", "to-yellow-500");
}

// Désactive le mode édition
export function desactiverModeEdition(btnSubmit) {
    btnSubmit.textContent = "Soumettre l'idée";

    btnSubmit.classList.remove("from-yellow-400", "to-yellow-500");
    btnSubmit.classList.add("from-blue-500", "to-indigo-600");
}
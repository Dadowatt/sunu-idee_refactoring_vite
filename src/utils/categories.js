// Retourne la classe Tailwind selon la catégorie
export function couleurCategorie(categorie) {
  const couleurs = {
    pedagogie: "bg-blue-100 text-blue-700",
    campus: "bg-green-100 text-green-700",
    technique: "bg-purple-100 text-purple-700",
    evenement: "bg-pink-100 text-pink-700",
  };

  return couleurs[categorie] || "bg-slate-100 text-slate-700";
}

// Transforme la catégorie en texte lisible
export function nomCategorie(categorie) {
  const noms = {
    pedagogie: "Pédagogie",
    campus: "Vie de campus",
    technique: "Amélioration technique",
    evenement: "Événement",
  };

  return noms[categorie] || categorie;
}
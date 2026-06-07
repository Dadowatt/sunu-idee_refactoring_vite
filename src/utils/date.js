// Formate la date d'une idée
export function formaterDate(date) {
  const maintenant = new Date();
  const dateIdee = new Date(date);

  const difference = maintenant - dateIdee;

  const secondes = Math.floor(difference / 1000);
  const minutes = Math.floor(secondes / 60);
  const heures = Math.floor(minutes / 60);
  const jours = Math.floor(heures / 24);

  if (secondes < 60) return "À l'instant";
  if (minutes < 60) return `${minutes} min`;
  if (heures < 24) return `${heures} h`;
  if (jours < 7) return `${jours} j`;

  return dateIdee.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}
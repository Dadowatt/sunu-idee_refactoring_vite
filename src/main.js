import { ajouterIdeeSupabase } from "./api/supabase.js";

const nouvelleIdee = {
  titre: "Test Vite",
  description: "Création depuis module",
  categorie: "technique",
  likes: 0,
  liked: false,
  archive: false,
  date: new Date().toISOString(),
};

const result = await ajouterIdeeSupabase(nouvelleIdee);
console.log("INSERT RESULT :", result);
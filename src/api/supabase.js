import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**************************************
 * READ - charger toutes les idées
 **************************************/
export async function chargerIdeesSupabase() {
  const { data, error } = await supabaseClient
    .from("idees")
    .select("*")
    .order("date", { ascending: false })

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

/******************************************************
 * CREATE - ajouter une idée
 ******************************************************/
export async function ajouterIdeeSupabase(idee) {
  const { data, error } = await supabaseClient
    .from("idees")
    .insert([idee])
    .select();

  if (error) {
    console.error("Erreur INSERT Supabase :", error);
    return null;
  }

  return data;
}

/********************************************************
 * UPDATE - modifier une idée
 *******************************************************/
export async function updateIdeeSupabase(id, updates) {
  try {
    const { data, error } = await supabaseClient
      .from("idees")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur UPDATE Supabase :", error);
    return null;
  }
}


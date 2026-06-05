import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**************************************
 * READ - charger toutes les idées
 **************************************/
export async function chargerIdeesSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from("idees")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Erreur READ Supabase :", error);
    return [];
  }
}

/******************************************************
 * CREATE - ajouter une idée
 ******************************************************/
export async function ajouterIdeeSupabase(idee) {
  try {
    const { data, error } = await supabaseClient
      .from("idees")
      .insert([idee])
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Erreur INSERT Supabase :", error);
    return null;
  }
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

/********************************************************
 * DELETE - supprimer une idée
 *******************************************************/

export async function supprimerIdeeSupabase(id) {
    try{
        const { error } = await supabaseClient
        .from("idees")
        .delete()
        .eq("id", id);

        if(error){
            throw error;
        }
        return true;
    }catch(error){
        console.error("Erreur DELETE Supabase :", error);
        return false;
    }
}
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**************************************
 * READ - charger toutes les idées
 **************************************/
export async function chargerIdeesSupabase() {
  const { data, error } = await supabase
    .from("idees")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
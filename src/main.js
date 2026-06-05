import { chargerIdeesSupabase } from "./api/supabase.js";

const data = await chargerIdeesSupabase();
console.log("IDEES SUPABASE :", data);
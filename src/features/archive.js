import { updateIdeeSupabase, chargerIdeesSupabase } from "../services/supabase.js";

/***************************************************************
 * ARCHIVAGE D'UNE IDÉE
 ***************************************************************/
export async function archiverIdee(id, setListeDesIdees, afficherLeMur) {
  const result = await updateIdeeSupabase(id, {
    archive: true,
  });

  if (!result) return;

    const nouvellesIdees = await chargerIdeesSupabase();
    setListeDesIdees(nouvellesIdees);
  afficherLeMur();
}
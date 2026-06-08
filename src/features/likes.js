import { updateIdeeSupabase } from "../services/supabase.js";

/***************************************************
 * GESTION DES LIKES
 ***************************************************/
export async function likerIdee(id,listeDesIdees,updateCarte) {
  const idee = listeDesIdees.find((i) => i.id === id);
  if (!idee) return;

  const newLikedState = !idee.liked;
  const newLikes = newLikedState ? idee.likes + 1 : idee.likes - 1;

  const result = await updateIdeeSupabase(id, {
    likes: newLikes,
    liked: newLikedState,
  });

  if (!result) return;

  idee.likes = newLikes;
  idee.liked = newLikedState;

  updateCarte(id);
}
import { chargerIdeesSupabase, ajouterIdeeSupabase, updateIdeeSupabase, supprimerIdeeSupabase } from "./services/supabase.js";
import { detecterCategorieIA } from "./features/ia.js";
import { formaterDate } from "./utils/date.js";
import { sanitizer } from "./utils/sanitizer.js";
import { couleurCategorie, nomCategorie } from "./utils/categories.js";
import { afficherErreur, cacherErreur } from "./ui/errors.js";
import { activerModeEdition, desactiverModeEdition } from "./ui/form.js";
import { creerCarteHTML } from "./ui/cards.js";
import { likerIdee } from "./features/likes.js";
import { archiverIdee } from "./features/archive.js";

/*************************************************
 * 2. STATE
 *************************************************/
let listeDesIdees = [];
let modeEdition = false;
let idEnCoursEdition = null;
let categorieActive = "toutes";


/*************************************************
 * 1. DOM
 *************************************************/
const formIdees = document.getElementById("form-idee");
const murDesIdees = document.getElementById("mur-idees");
const titreInput = document.getElementById("titre");
const categorieInput = document.getElementById("categorie");
const descriptionInput = document.getElementById("description");
const btnSubmit = document.getElementById("btn");
const filtreCategorie = document.getElementById("filtre-categorie");

/*************************************************
 * 7. EVENTS
 *************************************************/
filtreCategorie.addEventListener("change", () => {
  categorieActive = filtreCategorie.value;
  afficherLeMur();
});


formIdees.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = titreInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!titre || !description) {
    afficherErreur("Le titre et la description sont obligatoires.");
    return;
  }

  cacherErreur();

  let categorie;

  try {
    const categorieChoisie = categorieInput.value;

    if (modeEdition || categorieChoisie) {
      categorie = categorieChoisie;
    } else {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Analyse IA en cours...";

      categorie = await detecterCategorieIA(
        titre,
        description
      );
    }
  } catch (error) {
    console.error("Erreur IA :", error);
    categorie = "campus"; // fallback obligatoire
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Soumettre l'idée";
  }

  /*************************************************
   * MODE CRÉATION
   *************************************************/
  if (!modeEdition) {
    const nouvelleIdee = {
      titre,
      categorie,
      description,
      likes: 0,
      liked: false,
      archive: false,
      date: new Date().toISOString(),
    };

    try {
      const inserted = await ajouterIdeeSupabase(nouvelleIdee);

      if (inserted) {
        listeDesIdees = await chargerIdeesSupabase();
        afficherLeMur();
      }
    } catch (error) {
      console.error("Erreur INSERT Supabase :", error);
    }
  }

  /*************************************************
   * MODE ÉDITION
   *************************************************/
  else {
    try {
      const result = await updateIdeeSupabase(
        idEnCoursEdition,
        {
          titre,
          categorie,
          description,
        }
      );

      if (!result) return;

      listeDesIdees = await chargerIdeesSupabase();
      afficherLeMur();

      modeEdition = false;
      idEnCoursEdition = null;
      desactiverModeEdition(btnSubmit);

    } catch (error) {
      console.error("Erreur UPDATE Supabase :", error);
    }
  }

  formIdees.reset();
});

murDesIdees.addEventListener("click", async (e) => {
  const btnLike = e.target.closest(".btn-like");
  if (btnLike) {
    const id = Number(btnLike.closest("[data-id]").dataset.id);
    await likerIdee(id, listeDesIdees, updateCarte);
    return;
  }
  // fonction remplacer
  const btnSupprimer = e.target.closest(".btn-supprimer");
  if (btnSupprimer) {
    const id = Number(btnSupprimer.closest("[data-id]").dataset.id);

    console.log("BOUTON SUPPRIMER CLIQUÉ", id);

    supprimerIdee(id);
    return;
  }

  const btnEditer = e.target.closest(".btn-editer");
  if (btnEditer) {
    const id = Number(btnEditer.closest("[data-id]").dataset.id);
    chargerFormulaireEdition(id);
    return;
  }

  const btnArchiver = e.target.closest(".btn-archiver");
  if (btnArchiver) {
    const id = Number(btnArchiver.closest("[data-id]").dataset.id);

    await archiverIdee(id, (data) => {
      listeDesIdees = data;
      }, afficherLeMur
    );
    return;
    }
});

// Chargement initial du mur
afficherLeMur();

/****************************************************
 * CONSTRUCTION DU MUR D'IDÉES
 ****************************************************/

// Fonction de filtre
function filtrerIdees() {
  return categorieActive === "toutes"
    ? listeDesIdees
    : listeDesIdees.filter(
        (i) => i.categorie === categorieActive
      );
}

// Fonction UI "empty state"
function afficherMessageVide(message) {
  murDesIdees.innerHTML = `
    <div class="message-vide col-span-full bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
      <p class="text-slate-400 text-sm">
        ${message}
      </p>
    </div>
  `;
}

// afficherLeMur
function afficherLeMur() {
  const ideesFiltrees = filtrerIdees();

  murDesIdees.innerHTML = "";

  if (listeDesIdees.length === 0) {
    afficherMessageVide("Aucune idée publiée pour le moment.");
    return;
  }

  if (ideesFiltrees.length === 0) {
  afficherMessageVide(
    "Aucune idée à afficher pour cette catégorie."
  );
  return;
  }

  ideesFiltrees.forEach((idee) => {
    murDesIdees.insertAdjacentHTML(
      "beforeend",
      creerCarteHTML(idee)
    );
  });
}

/**************************************************
 * MISE À JOUR D'UNE CARTE
 **************************************************/
function updateCarte(id) {
  const idee = listeDesIdees.find((i) => i.id === id);
  const ancienneCarte = murDesIdees.querySelector(`[data-id="${id}"]`);

  if (!idee || !ancienneCarte) return;

  if (categorieActive === "toutes" || categorieActive === idee.categorie) {
    ancienneCarte.outerHTML = creerCarteHTML(idee);
  } else {
    afficherLeMur();
  }
}

async function supprimerIdee(id) {
  const confirmation = confirm(
    "Voulez-vous vraiment supprimer cette idée ?"
  );

  if (!confirmation) return;

  const success = await supprimerIdeeSupabase(id);

  if (!success) return;

  // Recharger les idées depuis Supabase
  listeDesIdees = await chargerIdeesSupabase();

  afficherLeMur();
}


/****************************************************
 * CHARGEMENT D'UNE IDÉE EN ÉDITION
 ****************************************************/
function chargerFormulaireEdition(id) {
  const idee = listeDesIdees.find((i) => i.id === id);
  if (!idee) return;

  modeEdition = true;
  idEnCoursEdition = id;

  titreInput.value = idee.titre;
  categorieInput.value = idee.categorie;
  descriptionInput.value = idee.description;

  activerModeEdition(btnSubmit);
}

// INIT
async function init() {
  listeDesIdees = await chargerIdeesSupabase();
  listeDesIdees.sort((a, b) => new Date(b.date) - new Date(a.date));
  afficherLeMur();
}

init();
import { chargerIdeesSupabase, ajouterIdeeSupabase, updateIdeeSupabase, supprimerIdeeSupabase } from "./api/supabase.js";
import { appelerOpenRouter } from "./services/openrouter.js";
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
 * 4. HELPERS
 *************************************************/

// Retourne la classe Tailwind selon la catégorie
function couleurCategorie(categorie) {
  const couleurs = {
    pedagogie: "bg-blue-100 text-blue-700",
    campus: "bg-green-100 text-green-700",
    technique: "bg-purple-100 text-purple-700",
    evenement: "bg-pink-100 text-pink-700",
  };

  return couleurs[categorie] || "bg-slate-100 text-slate-700";
}

// Transforme la catégorie en texte lisible
function nomCategorie(categorie) {
  const noms = {
    pedagogie: "Pédagogie",
    campus: "Vie de campus",
    technique: "Amélioration technique",
    evenement: "Événement",
  };

  return noms[categorie] || categorie;
}

// Formate la date d'une idée
function formaterDate(date) {
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

// Sécurise le texte contre les injections HTML
function sanitizer(texte) {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
    /*************************************************
     * MODE ÉDITION
     *************************************************/
    if (modeEdition) {
      categorie = categorieInput.value;
    }

    /*************************************************
     * MODE CRÉATION (IA)
     *************************************************/
    else {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Analyse IA en cours...";
      categorie = await detecterCategorieIA(titre, description);
    }
  } catch (error) {
    console.error("Erreur IA :", error);
    categorie = "campus";
  } finally {
    if (!modeEdition) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Soumettre l'idée";
    }
  }

  /*************************************************
   * CRÉATION
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
      const inserted = await ajouterIdeeSupabase(
        nouvelleIdee
      );

      if (inserted) {
        listeDesIdees = await chargerIdeesSupabase();
        afficherLeMur();
      }
    } catch (error) {
      console.error(
        "Erreur INSERT Supabase :",
        error
      );
    }
  }

  /*************************************************
   * ÉDITION
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

      desactiverModeEdition();

    } catch (error) {
      console.error(
        "Erreur UPDATE Supabase :",
        error
      );
    }
  }

  formIdees.reset();
});

murDesIdees.addEventListener("click", (e) => {
  const btnLike = e.target.closest(".btn-like");
  if (btnLike) {
    const id = Number(btnLike.closest("[data-id]").dataset.id);
    likerIdee(id);
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
    archiverIdee(id);
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


// UI FORM ERROR
// Affiche une erreur
function afficherErreur(message) {
  const erreur = document.getElementById("message-erreur");
  erreur.textContent = message;
  erreur.classList.remove("hidden");
}

// Cache l'erreur
function cacherErreur() {
  const erreur = document.getElementById("message-erreur");
  erreur.textContent = "";
  erreur.classList.add("hidden");
}

// Active le mode édition
function activerModeEdition() {
  btnSubmit.textContent = "Mettre à jour";

  btnSubmit.classList.remove("from-blue-500", "to-indigo-600");
  btnSubmit.classList.add("from-yellow-400", "to-yellow-500");
}

// Désactive le mode édition
function desactiverModeEdition() {
  btnSubmit.textContent = "Soumettre l'idée";

  btnSubmit.classList.remove("from-yellow-400", "to-yellow-500");
  btnSubmit.classList.add("from-blue-500", "to-indigo-600");
}


/*****************************************************
 * GÉNÉRATION D'UNE CARTE D'IDÉE
 *****************************************************/
function creerCarteHTML(idee) {
  return `
      <div 
        class="card-animation p-5 rounded-xl border shadow-xs flex flex-col justify-between min-h-[200px]
        ${idee.archive ? "bg-slate-100 border-slate-300" : "bg-white border-slate-100"}"
        data-id="${idee.id}">

        <div>

          <div class="flex justify-between items-center mb-3">

            <div class="flex items-center gap-2">

              <span class="${couleurCategorie(idee.categorie)} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ${nomCategorie(idee.categorie)}
              </span>

              ${
                idee.archive
                  ? `<span class="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Archivé</span>`
                  : ""
              }

            </div>

            <span class="text-[10px] text-slate-400">
              ${formaterDate(idee.date)}
            </span>

          </div>

          <h3 class="font-bold text-base mb-2 ${
            idee.archive ? "line-through text-slate-400" : "text-slate-900"
          }">
            ${sanitizer(idee.titre)}
          </h3>

          <p class="text-xs leading-relaxed line-clamp-4 ${
            idee.archive ? "line-through text-slate-400" : "text-slate-500"
          }">
            ${sanitizer(idee.description)}
          </p>

        </div>

        <div class="flex justify-between items-center mt-6 pt-3 border-t border-slate-50 text-[11px] text-slate-400">

          ${
            idee.archive
              ? `
              <div class="flex gap-3">
                <button class="btn-supprimer text-red-600 hover:text-red-700 cursor-pointer transition duration-200 hover:scale-110">
                  <i class="fa-regular fa-trash-can fa-2x"></i>
                </button>
              </div>
            `
              : `
              <div class="flex gap-3">

                <button class="btn-editer text-yellow-600 hover:text-yellow-700 cursor-pointer transition duration-200 hover:scale-110">
                  <i class="fa-solid fa-pen-to-square fa-2x"></i>
                </button>

                <button class="btn-archiver text-blue-600 hover:text-blue-700 cursor-pointer transition duration-200 hover:scale-110">
                  <i class="fa-solid fa-box-archive fa-2x"></i>
                </button>

                <button class="btn-supprimer text-red-600 hover:text-red-700 cursor-pointer transition duration-200 hover:scale-110">
                  <i class="fa-regular fa-trash-can fa-2x"></i>
                </button>

              </div>
            `
          }

          <button class="btn-like flex items-center gap-1 font-medium transition cursor-pointer ${
            idee.liked ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
          }">
            <i class="fa-solid fa-thumbs-up fa-2x"></i>
            <span class="text-[16px]">${idee.likes}</span>
          </button>

        </div>

      </div>
    `;
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


/***************************************************
 * GESTION DES LIKES
 ***************************************************/
async function likerIdee(id) {
  const idee = listeDesIdees.find((i) => i.id === id);
  if (!idee) return;

  const newLikedState = !idee.liked;
  const newLikes = newLikedState ? idee.likes + 1 : idee.likes - 1;

  const result = await updateIdeeSupabase(id, {
    likes: newLikes,
  });

  if (!result) return;

  idee.likes = newLikes;
  idee.liked = newLikedState;

  updateCarte(id);
}

/***************************************************************
 * ARCHIVAGE D'UNE IDÉE
 ***************************************************************/
async function archiverIdee(id) {
  const result = await updateIdeeSupabase(id, {
    archive: true,
  });

  if (!result) return;

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

  activerModeEdition();
}


async function detecterCategorieIA(titre, description) {
  const prompt = `
Tu es un système de classification.

Tu dois choisir UNE seule catégorie parmi :

pedagogie
campus
technique
evenement

Règles :
- cours, enseignants, examens => pedagogie
- vie étudiante, bibliothèque => campus
- application, site web => technique
- conférence, atelier => evenement

Réponds uniquement par un mot.

Titre: ${titre}
Description: ${description}
`;

  const result = await appelerOpenRouter(prompt);
  console.log("IA RESULT:", result)

  return result;
}


// INIT
async function init() {
  listeDesIdees = await chargerIdeesSupabase();
  listeDesIdees.sort((a, b) => new Date(b.date) - new Date(a.date));
  afficherLeMur();
}

init();
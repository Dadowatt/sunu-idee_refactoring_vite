import { formaterDate } from "../utils/date.js";
import { couleurCategorie, nomCategorie } from "../utils/categories.js";
import { sanitizer } from "../utils/sanitizer.js";


/*****************************************************
 * GÉNÉRATION D'UNE CARTE D'IDÉE
 *****************************************************/
export function creerCarteHTML(idee) {
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
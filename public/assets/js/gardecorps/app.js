/**
 * app.js — Moteur universel de configurateur piloté par steps.js
 * -----------------------------------------------------------------------------
 * Idée générale :
 * - Tu fournis un "steps.js" (tableau d'étapes ou objet) décrivant le scénario :
 *     [{ id, label, description, fields: [...], preview, defaultPreview, showIf, validate, ...}, ...]
 * - Chaque étape (step) contient des champs (fields) avec leur type (choice, number, text, boolean, range)
 * - Le moteur :
 *     1) Normalise steps (en Array)
 *     2) Gère un état "selection" (clé/valeur par field.id)
 *     3) Rend la sidebar, l’étape courante, et la navigation (Précédent/Suivant/Terminer)
 *     4) Applique les conditions d’affichage (showIf), la validation (validate), et le preview
 * - Le tout est monté dans un conteneur "mount" (par défaut #app) + 4 zones fixes :
 *     #cfg-preview, #cfg-steps, #cfg-fields, #cfg-nav
 *
 * Remarque :
 * - Le code est écrit vanilla (sans framework) pour rester portable et minimal.
 */

import {
  el, text, clamp, escapeHtml,
  normalizeSteps, normalizeOptions,
  resolveMaybeFn, resolvePredicate
} from "./core/utils.js";

import { renderSidebar, renderStep, renderNav, makePredicates } from "./core/renderers.js";

/**
 * Fonction principale d’initialisation du configurateur.
 *
 * @param {Object}   params
 * @param {Array|Object} params.steps   - Définition des étapes (Array OU Object)
 * @param {Object}   [params.data={}]   - Données externes (catalogues, tarifs, etc.)
 * @param {HTMLElement} [params.mount=document.getElementById("app")] - Élément racine où rendre l’UI
 * @param {number}   [params.startAt=0] - Index de l’étape de départ (0 = première étape)
 */
export function initConfigurator({
  steps,                                   // steps peut être un Array ou un Object (voir normalizeSteps)
  data = {},                               // Données externes (optionnelles)
  mount = document.getElementById("app"),  // Élément racine par défaut : <div id="app"></div>
  startAt = 0,                             // Étape initiale
})
{
  // --- Sécurité : s’assurer que le conteneur existe, sinon on arrête proprement.
  if (!mount) throw new Error("❌ Élément 'mount' introuvable. Ajouter <div id=\"app\"></div>.");

  // --- Hack utile : certains navigateurs (Chrome) soumettent un <form>
  //     si un <button> est cliqué sans type explicite. On bloque toute soumission par défaut.
  mount.addEventListener('submit', (ev) => {
    ev.preventDefault(); // Empêche toute soumission de formulaire par défaut
  }, { capture: true }); // Capture pour intercepter l’événement tôt (avant d’autres handlers)

  // --- 1) Normaliser steps en un Array d’objets étape cohérents
  //     - Si steps est un objet { etapeA: {...}, etapeB: {...} } => on produit [{id:"etapeA", ...}, {id:"etapeB", ...}]
  //     - Si steps est un array => on s’assure que chaque élément a un id
  const stepsArr = normalizeSteps(steps);

  // --- Si aucune étape, on affiche un message et on sort.
  if (stepsArr.length === 0) {
    mount.innerHTML = "Aucun step à afficher.";
    return;
  }

  // --- 2) État global de la configuration :
  //     - Objet sans prototype (Object.create(null)) pour éviter les collisions avec des clés héritées.
  //     - Clé = field.id, Valeur = saisie/choix utilisateur.
  const selection = Object.create(null);

  // --- 3) Index de l’étape courante (borné entre 0 et stepsArr.length - 1)
  let current = clamp(startAt, 0, stepsArr.length - 1);

  // --- 4) Récupération des conteneurs DOM (layout présumé existant dans index.html)
  const $previewContainer = document.getElementById("cfg-preview");
  const $sidebarContainer = document.getElementById("cfg-steps");
  const $fieldsContainer  = document.getElementById("cfg-fields");
  const $navContainer     = document.getElementById("cfg-nav");

  // --- Vérification que tous les conteneurs sont là (sinon on ne peut pas rendre l’UI)
  if (!$previewContainer || !$sidebarContainer || !$fieldsContainer || !$navContainer) {
    throw new Error("❌ Conteneurs manquants (#cfg-preview, #cfg-steps, #cfg-fields, #cfg-nav). Vérifie index.html.");
  }

  // --- On nettoie ces conteneurs
  $previewContainer.innerHTML = "";
  $sidebarContainer.innerHTML = "";
  $fieldsContainer.innerHTML  = "";
  $navContainer.innerHTML     = "";

  // --- On nettoie également le mount si tu veux encapsuler une structure différente
  mount.innerHTML = "";

  // --- On fabrique une petite structure racine interne (optionnelle)
  //     Note : tu peux t’en passer si ton index.html contient déjà toute la structure.
  const $root = el("div", { class: "cfg-root" });
  const $sidebar = el("aside", { class: "cfg-steps" });
  const $main = el("main", { class: "cfg-main" });
  const $nav = el("div", { class: "cfg-nav" });

  $root.appendChild($sidebar);
  $root.appendChild($main);
  $root.appendChild($nav);

  mount.appendChild($root);

  // ---------- Contexte (ctx) partagé entre les renderers ----------
  // Helpers de visibilité
  const predicates = makePredicates({
    selection, stepsArr, data,
    getCurrentIndex: () => current
  });

  // ctx = toutes les fonctions/états dont les renderers ont besoin
  const ctx = {
    selection,
    data,
    stepsArr,

    // index courant + mutateurs
    getCurrentIndex: () => current,
    setCurrentIndex: (i) => { current = clamp(i, 0, stepsArr.length - 1); },

    // --- 🆕 Gestion des erreurs "requis manquants" (UX conviviale)
    invalidFields: new Set(),               // Set<string> des field.id invalides
    requiredErrorMessage: "",               // message bandeau (string)

    setRequiredErrors(ids, message) {       // appelé quand on veut afficher les erreurs
      this.invalidFields = new Set(ids);
      this.requiredErrorMessage = message || "";
    },
    clearRequiredErrors() {                 // appelé quand on corrige ou on change d'étape
      this.invalidFields.clear();
      this.requiredErrorMessage = "";
    },

    // visibilité step/field (utilise resolvePredicate)
    isStepVisible: (step) => predicates.stepVisible(step, resolvePredicate),
    shouldShowField: (field) => predicates.fieldVisible(field, resolvePredicate),

    // efface les sélections des steps suivants
    clearSelectionsBeyond: (step, { preserve = [] } = {}) => {
      const idx = stepsArr.indexOf(step);
      for (let i = idx + 1; i < stepsArr.length; i++) {
        for (const f of stepsArr[i].fields ?? []) {
          if (preserve.includes(f.id)) continue;
          delete selection[f.id];
        }
      }
    },

    // completude : tous les champs visibles sont remplis si required
    isStepComplete: (step) => {
      const fields = (step.fields ?? []).filter(f => ctx.shouldShowField(f));
      return fields.every(f =>
        !f.required || (selection[f.id] !== undefined && selection[f.id] !== "" && selection[f.id] !== null)
      );
    },

    // utilitaire central pour rerendre tout d’un coup
    rerenderAll: () => {
      renderSidebar({ containers, ctx });
      renderStep({ containers, ctx });
      renderNav({ containers, ctx });
    }
  };

  // Conteneurs groupés (plus simple à passer aux renderers)
  const containers = {
    mount,
    $previewContainer,
    $sidebarContainer,
    $fieldsContainer,
    $navContainer
  };

  // --- Rendu initial : sidebar + step + nav
  ctx.rerenderAll();
}

/**
 * Petit utilitaire exporté pour récupérer un paramètre d’URL.
 * - Utile côté bootstrap.js pour sélectionner un dataset via ?code=...
 */
export function getQueryParam(name) {
  const p = new URLSearchParams(location.search); // Analyse la query string
  return p.get(name);                              // Retourne la valeur (ou null si absente)
}
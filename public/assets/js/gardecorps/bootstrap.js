/**
 * bootstrap.js — Sélecteur de dataset via un menu (sans paramètres d’URL)
 * -----------------------------------------------------------------------------
 * Rôle :
 * - Construire un menu (boutons) listant les "datasets" disponibles (câbles, barres, verre, etc.)
 * - Au clic sur un bouton, charger dynamiquement le steps.js correspondant (import dynamique)
 * - Initialiser (ou ré-initialiser) le configurateur dans l’élément #app
 *
 * Hypothèses côté HTML :
 * - Un conteneur racine existe : <div id="app"></div>
 * - Un conteneur optionnel pour le menu : <div id="links"></div> (sinon il sera créé)
 * - Le layout du configurateur (zones #cfg-preview, #cfg-steps, #cfg-fields, #cfg-nav)
 *   est géré par app.js et/ou ton index.html selon ton organisation.
 */

import { initConfigurator } from "./app.js"; // On importe la fonction d'initialisation du configurateur

// ============================================================================
// 1) Registre des datasets → fonctions d'import dynamique
// ----------------------------------------------------------------------------
// - Chaque entrée associe un "code" (slug) à une fonction qui retourne un import()
// - L'import dynamique charge le module steps.js quand on en a besoin (lazy loading)
// - Convention : chaque steps.js exporte "default" = la définition des steps
// ============================================================================
const DATASETS = {
  "cables":           () => import("./datasets/cables/steps.js"),
  "barres":           () => import("./datasets/barres/steps.js"),
  "verre":            () => import("./datasets/verre/steps.js"),
  "verre-a-profile":  () => import("./datasets/verre-a-profile/steps.js"),
  "barriere-piscine": () => import("./datasets/barriere-piscine/steps.js"),
  "filet-inox":       () => import("./datasets/filet-inox/steps.js"),
  "tole-inox":        () => import("./datasets/tole-inox/steps.js"),
  // ⚠️ Si tu ajoutes un nouveau dossier datasets/<code>/steps.js,
  //    pense à l’enregistrer ici ET dans MENU_ITEMS plus bas.
};

// ============================================================================
// 2) Menu à afficher (ordre + libellés)
// ----------------------------------------------------------------------------
// - Définit l'ordre d'affichage et le label utilisateur pour chaque bouton
// - "code" doit correspondre EXACTEMENT à une clé de DATASETS ci-dessus
// ============================================================================
const MENU_ITEMS = [
  { code: "cables",           label: "Câbles" },
  { code: "barres",           label: "Barres" },
  { code: "verre",            label: "Verre" },
  { code: "verre-a-profile",  label: "Verre à profilé" },
  { code: "barriere-piscine", label: "Barrière piscine" },
  { code: "filet-inox",       label: "Filet câble inox" },
  { code: "tole-inox",        label: "Acier inox" },
];

// ============================================================================
// 3) Références DOM
// ----------------------------------------------------------------------------
// - $app   : où le configurateur sera rendu (obligatoire)
// - $links : où placer le menu (optionnel ; créé dynamiquement s'il est absent)
// ============================================================================
const $app   = document.getElementById("app");
const $links = document.getElementById("links"); // conteneur du menu (optionnel dans ton HTML)

// Petite protection : on vérifie la présence des conteneurs essentiels
if (!$app) {
  // Sans #app, on ne peut pas initialiser l'application → on stoppe net.
  throw new Error("❌ Élément #app introuvable dans le DOM.");
}
if (!$links) {
  // Ce n'est pas bloquant : si #links n'existe pas, on le créera juste avant #app.
  console.warn("ℹ️ Aucun conteneur #links trouvé : le menu sera créé automatiquement en haut de #app.");
}

// ============================================================================
// 4) État courant (dataset sélectionné)
// ----------------------------------------------------------------------------
// - Mémorise le "code" du dataset actif (ex: "cables")
// - Utile pour surligner le bouton actif et éviter un rechargement inutile
// ============================================================================
let currentCode = null;

// ============================================================================
// 5) Construit le menu et attache les handlers
// ----------------------------------------------------------------------------
// - Crée un bouton par entrée de MENU_ITEMS
// - Gère la classe .active sur le bouton courant
// - Au clic : met à jour currentCode, rafraîchit le style, charge le dataset
// ============================================================================
function buildMenu() {
  // On choisit le conteneur : #links s'il existe, sinon on crée un <div id="links">
  const host = $links ?? document.createElement("div");
  host.id = "links";      // s'assure qu'il porte l'id standard
  host.innerHTML = "";    // nettoyage (au cas où on reconstruit le menu)

  // Pour chaque entrée du menu, on fabrique un bouton
  MENU_ITEMS.forEach(item => {
    const a = document.createElement("button"); // <button> plutôt que <a> pour éviter la navigation
    a.type = "button";                          // évite tout submit si jamais dans un form ancêtre
    a.textContent = item.label;                 // texte utilisateur (ex: "Câbles")
    a.className = "menu-btn";                   // classe pour le style CSS
    if (item.code === currentCode) a.classList.add("active"); // surlignage si bouton courant

    // Au clic sur un bouton de menu :
    a.addEventListener("click", () => {
      if (currentCode === item.code) return; // si déjà actif → rien à faire
      currentCode = item.code;               // mémorise le nouveau code sélectionné
      highlightActive(host);                 // met à jour le style des boutons (active)
      loadDataset(item.code);                // charge dynamiquement le dataset et (ré)initialise le configurateur
    });

    // On ajoute le bouton au conteneur du menu
    host.appendChild(a);
  });

  // Si #links n’existait pas dans le DOM initial, on insère le menu juste avant #app
  if (!$links) {
    // parentNode est garanti ici car #app existe (vérifié plus haut)
    $app.parentNode.insertBefore(host, $app);
  }
}

/**
 * Met à jour la classe .active sur le bouton correspondant à currentCode.
 * @param {HTMLElement} host - Le conteneur du menu (celui qui contient les .menu-btn)
 */
function highlightActive(host) {
  // On enlève .active de tous les boutons
  host.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));

  // On retrouve l'item du menu dont le code === currentCode
  const activeItem = MENU_ITEMS.find(i => i.code === currentCode);

  // On cherche le bouton dont le texte correspond au label de l'item actif
  // (on pourrait aussi comparer via data-attributes si besoin)
  const btn = [...host.querySelectorAll(".menu-btn")]
    .find(b => b.textContent === activeItem?.label);

  // Si trouvé, on applique .active
  if (btn) btn.classList.add("active");
}

// ============================================================================
// 6) Charge un dataset puis (ré)initialise le configurateur
// ----------------------------------------------------------------------------
// - Récupère la fonction loader depuis DATASETS[code]
// - Fait un import() dynamique du steps.js
// - Récupère "steps" depuis mod.default
// - Appelle initConfigurator({ steps, ... }) pour générer l'UI
// ============================================================================
async function loadDataset(code) {
  const loader = DATASETS[code]; // Ex: DATASETS["cables"] → () => import("./datasets/cables/steps.js")

  // Si le code n'existe pas dans DATASETS : message d'erreur utilisateur
  if (!loader) {
    $app.innerHTML = `Code inconnu: <b>${code}</b>`;
    return;
  }

  // Avant de charger, on nettoie l'UI pour éviter des restes visuels/d'état
  $app.innerHTML = "";

  try {
    // Import dynamique du module steps.js
    const mod = await loader();

    // Convention : steps.js exporte "default"
    const steps = mod.default;

    // Important : initConfigurator reconstruit son contenu dans #app
    // et s’appuie sur les conteneurs fixes #cfg-preview/#cfg-steps/#cfg-fields/#cfg-nav
    // présents dans le layout global (index.html + CSS).
    initConfigurator({
      steps,         // définition des étapes (array ou objet normalisé par app.js)
      data: {},      // données externes (catalogues, tarifs, etc.) si besoin
      mount: $app,   // élément racine où rendre le configurateur
      startAt: 0,    // on commence à la première étape (modifiable au besoin)
    });

  } catch (err) {
    // En cas d'erreur (module manquant, erreur d'exécution, chemin incorrect...), on log + message utilisateur
    console.error(err);
    $app.innerHTML = "Erreur lors du chargement du steps.js";
  }
}

// ============================================================================
// 7) Boot : sélectionne un dataset par défaut et construit le menu
// ----------------------------------------------------------------------------
// - IIFE (Immediately Invoked Function Expression) : la fonction "start" s'exécute immédiatement
// - Définit un dataset par défaut (1er item du menu) puis le charge
// - Construit le menu (et le place si #links n'existe pas)
// ============================================================================
(function start() {
  // Par défaut, on active le premier item du menu
  // (Tu peux changer cette ligne si tu veux un autre dataset par défaut)
  currentCode = MENU_ITEMS[0].code;

  // Construit/affiche le menu
  buildMenu();

  // Charge et initialise le configurateur pour le dataset par défaut
  loadDataset(currentCode);
})();

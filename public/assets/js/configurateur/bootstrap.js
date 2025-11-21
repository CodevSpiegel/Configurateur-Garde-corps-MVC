/**
 * ============================================================================
 * bootstrap.js — Fichier de démarrage du configurateur
 * ============================================================================
 * 
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier est le "chef d'orchestre" au démarrage de l'application.
 * Il crée le menu de sélection des types de garde-corps et charge le bon
 * configurateur quand l'utilisateur clique sur un bouton.
 * 
 * 📚 FONCTIONNEMENT :
 * 1. Afficher un menu avec tous les types disponibles (Câbles, Barres, Verre...)
 * 2. Quand l'utilisateur clique sur un type, charger son fichier steps.js
 * 3. Initialiser le configurateur avec les bonnes étapes
 * 
 * 💡 CONCEPTS JAVASCRIPT UTILISÉS :
 * - Import dynamique (lazy loading)
 * - Fonctions asynchrones (async/await)
 * - Manipulation du DOM
 * - Gestion d'événements
 * - IIFE (fonction qui s'exécute immédiatement)
 */

// ============================================================================
// IMPORTATIONS
// ============================================================================

// On importe la fonction principale qui lance le configurateur
import { initConfigurator } from "./app.js";

// ============================================================================
// CONFIGURATION : REGISTRE DES TYPES DE GARDE-CORPS
// ============================================================================

/**
 * DATASETS = dictionnaire qui associe chaque type de garde-corps
 * à une fonction qui charge son fichier de configuration (steps.js)
 *
 * 💡 IMPORT DYNAMIQUE :
 * Au lieu de charger tous les fichiers au démarrage, on les charge
 * seulement quand l'utilisateur en a besoin. C'est plus rapide !
 *
 * Exemple : () => import("./datasets/cables/steps.js")
 * - () => ... = fonction fléchée (arrow function)
 * - import("...") = charger un module JavaScript dynamiquement
 */
const DATASETS = {
  // Clé : code unique du type (utilisé en interne)
  // Valeur : fonction qui retourne une promesse de chargement du module
  "cables":           () => import("./datasets/cables/steps.js"),           // Garde-corps câbles tendus
  "barres":           () => import("./datasets/barres/steps.js"),           // Garde-corps barres horizontales
  "verre":            () => import("./datasets/verre/steps.js"),            // Garde-corps panneaux de verre
  "verre-a-profile":  () => import("./datasets/verre-a-profile/steps.js"),  // Garde-corps verre avec profilés
  "barriere-piscine": () => import("./datasets/barriere-piscine/steps.js"), // Barrières de piscine
  "filet-inox":       () => import("./datasets/filet-inox/steps.js"),       // Garde-corps filet câble inox
  "tole-inox":        () => import("./datasets/tole-inox/steps.js"),        // Garde-corps tôle perforée inox

  // ⚠️ IMPORTANT : Si on ajoute un nouveau type de garde-corps :
  // 1. Créer le dossier datasets/<nouveau-code>/
  // 2. Créer le fichier steps.js dedans
  // 3. Ajouter une ligne ici : "nouveau-code": () => import("./datasets/nouveau-code/steps.js")
  // 4. Ajouter aussi dans MENU_ITEMS plus bas pour qu'il apparaisse dans le menu
};

// ============================================================================
// CONFIGURATION : ÉLÉMENTS DU MENU
// ============================================================================

/**
 * MENU_ITEMS = tableau qui définit les boutons du menu
 *
 * 💡 STRUCTURE :
 * - code : doit correspondre à une clé dans DATASETS (c'est le lien entre les deux)
 * - label : texte affiché sur le bouton (visible par l'utilisateur)
 *
 * ⚠️ L'ORDRE COMPTE : les boutons apparaîtront dans l'ordre du tableau
 */
const MENU_ITEMS = [
  { code: "cables",           label: "Câbles" },              // Premier bouton
  { code: "barres",           label: "Barres" },              // Deuxième bouton
  { code: "verre",            label: "Verre" },               // etc.
  { code: "verre-a-profile",  label: "Verre à profilé" },
  { code: "barriere-piscine", label: "Barrière piscine" },
  { code: "filet-inox",       label: "Filet câble inox" },
  { code: "tole-inox",        label: "Acier inox" },
];

// ============================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ============================================================================

// On récupère les conteneurs HTML depuis la page
// getElementById() = chercher un élément par son id
const $app   = document.getElementById("app");    // Zone principale où afficher le configurateur
const $links = document.getElementById("links");  // Zone où afficher le menu (optionnel)

// --------------------------------------------------------------------------
// VÉRIFICATION DE SÉCURITÉ
// --------------------------------------------------------------------------

// Si l'élément #app n'existe pas dans le HTML, on ne peut pas continuer
if (!$app) {
  // throw = lancer une erreur qui arrête le programme
  throw new Error("❌ Élément #app introuvable dans le DOM.");
}

// Si l'élément #links n'existe pas, ce n'est pas grave
// On affichera juste un message d'information dans la console
if (!$links) {
  // console.warn() = afficher un avertissement dans la console du navigateur
  console.warn("ℹ️ Aucun conteneur #links trouvé : le menu sera créé automatiquement en haut de #app.");
}

// ============================================================================
// ÉTAT GLOBAL : MÉMORISATION DU TYPE SÉLECTIONNÉ
// ============================================================================

/**
 * currentCode = variable qui stocke le code du type actuellement affiché
 *
 * Exemple : si l'utilisateur a cliqué sur "Câbles", currentCode = "cables"
 *
 * Initialisation à null = aucun type sélectionné au départ
 */
let currentCode = null;

// ============================================================================
// FONCTION : CONSTRUCTION DU MENU
// ============================================================================

/**
 * buildMenu() = créer et afficher le menu de sélection des types
 *
 * Cette fonction :
 * 1. Crée un bouton pour chaque type de garde-corps
 * 2. Gère le clic sur chaque bouton
 * 3. Met en surbrillance le bouton actif
 */
function buildMenu() {
  // --------------------------------------------------------------------------
  // PRÉPARATION DU CONTENEUR
  // --------------------------------------------------------------------------

  // Si #links existe, on l'utilise. Sinon, on crée un nouveau <div>
  // ?? = opérateur de coalescence nulle (si $links est null, utiliser la valeur de droite)
  const host = $links ?? document.createElement("div");

  // On s'assure que le conteneur a l'id "links"
  host.id = "links";

  // On vide le contenu HTML pour repartir à zéro
  host.innerHTML = "";

  // --------------------------------------------------------------------------
  // CRÉATION DES BOUTONS
  // --------------------------------------------------------------------------

  // forEach() = boucle qui parcourt chaque élément du tableau
  // item = un objet { code: "...", label: "..." }
  MENU_ITEMS.forEach(item => {
    // Création d'un bouton HTML
    // createElement() = créer un nouvel élément HTML
    const a = document.createElement("button");  // <button> plutôt que <a> car ce n'est pas un lien

    // Attributs du bouton
    a.type = "button";              // Type explicite pour éviter la soumission de formulaire
    a.textContent = item.label;     // Texte affiché sur le bouton (ex: "Câbles")
    a.className = "menu-btn";       // Classe CSS pour le style

    // Si ce bouton correspond au type actuellement sélectionné, on le met en surbrillance
    if (item.code === currentCode) {
      // classList.add() = ajouter une classe CSS
      a.classList.add("active");    // La classe "active" change l'apparence du bouton
    }

    // --------------------------------------------------------------------------
    // GESTION DU CLIC SUR LE BOUTON
    // --------------------------------------------------------------------------

    // addEventListener() = écouter un événement (ici : "click")
    // () => {...} = fonction fléchée qui s'exécute quand on clique
    a.addEventListener("click", () => {
      // Si l'utilisateur clique sur le bouton déjà actif, ne rien faire
      if (currentCode === item.code) return;  // return = sortir de la fonction

      // Mémoriser le nouveau code sélectionné
      currentCode = item.code;

      // Mettre à jour l'apparence des boutons (enlever/ajouter la classe "active")
      highlightActive(host);

      // Charger le configurateur correspondant au type sélectionné
      loadDataset(item.code);
    });

    // Ajouter le bouton au conteneur du menu
    // appendChild() = insérer un élément enfant
    host.appendChild(a);
  });

  // --------------------------------------------------------------------------
  // INSERTION DU MENU DANS LA PAGE
  // --------------------------------------------------------------------------

  // Si #links n'existait pas au départ, on l'insère avant #app
  if (!$links) {
    // parentNode = élément parent (celui qui contient #app)
    // insertBefore(nouveau, référence) = insérer "nouveau" avant "référence"
    $app.parentNode.insertBefore(host, $app);
  }
}

// ============================================================================
// FONCTION : MISE EN SURBRILLANCE DU BOUTON ACTIF
// ============================================================================

/**
 * highlightActive() = mettre à jour l'apparence des boutons
 *
 * Enlève la classe "active" de tous les boutons,
 * puis l'ajoute seulement au bouton correspondant à currentCode
 *
 * @param {HTMLElement} host - Le conteneur qui contient les boutons
 */
function highlightActive(host) {
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : ENLEVER LA SURBRILLANCE DE TOUS LES BOUTONS
  // --------------------------------------------------------------------------

  // querySelectorAll() = chercher tous les éléments qui correspondent au sélecteur CSS
  // ".menu-btn" = tous les éléments avec la classe "menu-btn"
  // forEach() = parcourir chaque bouton trouvé
  host.querySelectorAll(".menu-btn").forEach(btn => {
    // classList.remove() = enlever une classe CSS
    btn.classList.remove("active");
  });

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : TROUVER L'ÉLÉMENT ACTIF DANS MENU_ITEMS
  // --------------------------------------------------------------------------

  // find() = chercher le premier élément qui satisfait la condition
  // i => i.code === currentCode : trouver l'item dont le code correspond
  const activeItem = MENU_ITEMS.find(i => i.code === currentCode);

  // --------------------------------------------------------------------------
  // ÉTAPE 3 : TROUVER LE BOUTON CORRESPONDANT
  // --------------------------------------------------------------------------

  // [...array] = convertir une NodeList en vrai tableau
  // Permet d'utiliser les méthodes de tableau comme find()
  const btn = [...host.querySelectorAll(".menu-btn")]
    // On cherche le bouton dont le texte correspond au label
    // ?. = optional chaining (évite une erreur si activeItem est null)
    .find(b => b.textContent === activeItem?.label);

  // --------------------------------------------------------------------------
  // ÉTAPE 4 : AJOUTER LA SURBRILLANCE AU BON BOUTON
  // --------------------------------------------------------------------------

  // Si on a trouvé le bouton (btn n'est pas null/undefined)
  if (btn) {
    // Ajouter la classe "active" pour le mettre en surbrillance
    btn.classList.add("active");
  }
}

// ============================================================================
// FONCTION : CHARGEMENT D'UN TYPE DE GARDE-CORPS
// ============================================================================

/**
 * loadDataset() = charger et afficher un type de garde-corps
 *
 * Cette fonction est asynchrone car elle doit attendre le chargement
 * du fichier steps.js avant de continuer
 *
 * 💡 ASYNC/AWAIT :
 * - async = cette fonction est asynchrone (peut attendre des opérations)
 * - await = attendre qu'une promesse se résolve avant de continuer
 *
 * @param {string} code - Le code du type à charger (ex: "cables")
 */
async function loadDataset(code) {
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : RÉCUPÉRER LA FONCTION DE CHARGEMENT
  // --------------------------------------------------------------------------

  // On cherche la fonction de chargement dans DATASETS
  // Ex: DATASETS["cables"] = () => import("./datasets/cables/steps.js")
  const loader = DATASETS[code];

  // Si le code n'existe pas dans DATASETS, afficher une erreur
  if (!loader) {
    // innerHTML = modifier le contenu HTML
    // Backticks ` ` = template string (permet d'insérer des variables avec ${...})
    $app.innerHTML = `Code inconnu: <b>${code}</b>`;
    return;  // Sortir de la fonction (ne pas continuer)
  }

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : NETTOYER L'INTERFACE
  // --------------------------------------------------------------------------

  // On vide le contenu de #app avant de charger le nouveau configurateur
  // Cela évite d'avoir des restes de l'ancien configurateur
  $app.innerHTML = "";

  // --------------------------------------------------------------------------
  // ÉTAPE 3 : CHARGER LE FICHIER STEPS.JS
  // --------------------------------------------------------------------------

  // try/catch = gérer les erreurs
  // try = essayer de faire quelque chose
  // catch = si ça échoue, exécuter le code dans catch
  try {
    // Appeler la fonction loader() qui retourne une promesse
    // await = attendre que l'import soit terminé
    const mod = await loader();

    // Le module chargé contient plusieurs exports possibles
    // Par convention, le steps est dans l'export "default"
    const steps = mod.default;

    // --------------------------------------------------------------------------
    // ÉTAPE 4 : INITIALISER LE CONFIGURATEUR
    // --------------------------------------------------------------------------

    // Appeler la fonction principale qui crée l'interface du configurateur
    initConfigurator({
      steps,         // Les étapes de configuration (array d'objets)
      data: {},      // Données supplémentaires (catalogues, tarifs...) - vide pour l'instant
      mount: $app,   // Où afficher le configurateur (l'élément #app)
      startAt: 0,    // Commencer à la première étape (index 0)
    });

  } catch (err) {
    // --------------------------------------------------------------------------
    // GESTION DES ERREURS
    // --------------------------------------------------------------------------

    // Si quelque chose s'est mal passé (fichier introuvable, erreur de syntaxe...),
    // on affiche l'erreur dans la console
    console.error(err);

    // Et on affiche un message d'erreur à l'utilisateur
    $app.innerHTML = "Erreur lors du chargement du steps.js";
  }
}

// ============================================================================
// DÉMARRAGE AUTOMATIQUE DE L'APPLICATION
// ============================================================================

/**
 * IIFE (Immediately Invoked Function Expression) = fonction qui s'exécute immédiatement
 *
 * 💡 SYNTAXE :
 * (function nom() { ... })();
 *
 * Les parenthèses finales () signifient "exécuter cette fonction maintenant"
 *
 * C'est utile pour :
 * 1. Encapsuler le code (éviter de polluer l'espace global)
 * 2. Exécuter du code au chargement de la page
 */
(function start() {
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : DÉFINIR LE TYPE PAR DÉFAUT
  // --------------------------------------------------------------------------

  // Au démarrage, on sélectionne automatiquement le premier type du menu
  // MENU_ITEMS[0] = premier élément du tableau
  // .code = accéder à la propriété "code" de l'objet
  currentCode = MENU_ITEMS[0].code;

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : CONSTRUIRE ET AFFICHER LE MENU
  // --------------------------------------------------------------------------

  // Créer les boutons et les insérer dans la page
  buildMenu();

  // --------------------------------------------------------------------------
  // ÉTAPE 3 : CHARGER LE CONFIGURATEUR PAR DÉFAUT
  // --------------------------------------------------------------------------

  // Charger et afficher le configurateur du premier type
  loadDataset(currentCode);

})();  // ← Ces parenthèses exécutent immédiatement la fonction start()

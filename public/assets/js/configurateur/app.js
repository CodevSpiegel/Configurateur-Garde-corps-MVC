/**
 * ============================================================================
 * app.js — Moteur universel du configurateur de garde-corps
 * ============================================================================
 * 
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier est le "cerveau" du configurateur. Il orchestre toute l'application :
 * - Il charge les étapes de configuration (steps)
 * - Il gère l'état de la configuration (ce que l'utilisateur a choisi)
 * - Il affiche l'interface utilisateur (sidebar, formulaires, navigation)
 * - Il coordonne les différents modules (renderers, utils, fields)
 * 
 * 📚 CONCEPTS JAVASCRIPT UTILISÉS :
 * - Import/Export de modules ES6
 * - Fonctions fléchées (arrow functions)
 * - Destructuration d'objets
 * - Manipulation du DOM
 * - Gestion d'événements
 */

// ============================================================================
// IMPORTATIONS DES MODULES
// ============================================================================

// On importe des fonctions utilitaires depuis le fichier utils.js
// Ces fonctions aident à créer des éléments HTML, normaliser les données, etc.
import {
  el,                    // Fonction pour créer des éléments HTML facilement
  text,                  // Fonction pour créer des nœuds de texte
  clamp,                 // Fonction pour borner une valeur entre min et max
  escapeHtml,            // Fonction pour sécuriser du texte HTML (éviter les failles XSS)
  normalizeSteps,        // Fonction pour uniformiser le format des étapes
  normalizeOptions,      // Fonction pour uniformiser le format des options
  resolveMaybeFn,        // Fonction pour exécuter une valeur ou une fonction
  resolvePredicate       // Fonction pour évaluer une condition (vrai/faux)
} from "./core/utils.js";

// On importe les fonctions de rendu qui génèrent l'interface utilisateur
import { 
  renderSidebar,         // Affiche la barre latérale avec les étapes
  renderStep,            // Affiche le formulaire de l'étape courante
  renderNav,             // Affiche les boutons de navigation (Précédent/Suivant)
  makePredicates         // Crée des fonctions pour vérifier la visibilité des éléments
} from "./core/renderers.js";

// ============================================================================
// FONCTION PRINCIPALE : INITIALISATION DU CONFIGURATEUR
// ============================================================================

/**
 * Cette fonction démarre le configurateur et le rend opérationnel.
 * C'est le point d'entrée principal de l'application.
 *
 * @param {Object} params - Objet contenant tous les paramètres de configuration
 * @param {Array|Object} params.steps - Les étapes du configurateur (ex: type, finition, forme...)
 * @param {Object} [params.data={}] - Données supplémentaires (catalogues, tarifs...)
 * @param {HTMLElement} [params.mount] - L'élément HTML où afficher le configurateur
 * @param {number} [params.startAt=0] - À quelle étape commencer (0 = première étape)
 */
export function initConfigurator({
  steps,                                   // Les étapes de configuration (obligatoire)
  data = {},                               // Données externes (optionnel, valeur par défaut = objet vide)
  mount = document.getElementById("app"),  // Conteneur principal (par défaut = élément avec id="app")
  startAt = 0,                             // Étape de départ (par défaut = 0, donc la première)
})
{
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : VÉRIFICATIONS DE SÉCURITÉ
  // --------------------------------------------------------------------------

  // On vérifie que le conteneur principal existe dans le HTML
  // Si mount est null (l'élément n'existe pas), on lance une erreur
  if (!mount) {
    // throw = arrêter le programme et afficher un message d'erreur
    throw new Error("❌ Élément 'mount' introuvable. Ajouter <div id=\"app\"></div>.");
  }

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : EMPÊCHER LES SOUMISSIONS DE FORMULAIRE ACCIDENTELLES
  // --------------------------------------------------------------------------

  // Les navigateurs soumettent automatiquement les formulaires quand on clique sur un bouton
  // On intercepte tous les événements "submit" pour les bloquer
  mount.addEventListener('submit', (ev) => {
    // ev.preventDefault() = annuler le comportement par défaut (ici, la soumission)
    ev.preventDefault();
  }, { 
    // capture: true = intercepter l'événement dès qu'il commence (phase de capture)
    // Cela permet de bloquer TOUS les submits, même dans les éléments enfants
    capture: true 
  });

  // --------------------------------------------------------------------------
  // ÉTAPE 3 : NORMALISATION DES DONNÉES D'ENTRÉE
  // --------------------------------------------------------------------------

  // Les étapes peuvent être fournies sous deux formats :
  // - Soit un Array : [{ id: "type", ... }, { id: "finition", ... }]
  // - Soit un Object : { type: {...}, finition: {...} }
  // normalizeSteps() convertit toujours en Array pour simplifier le traitement
  const stepsArr = normalizeSteps(steps);

  // Si aucune étape n'a été fournie, on affiche un message et on s'arrête
  if (stepsArr.length === 0) {
    // innerHTML = modifier le contenu HTML d'un élément
    mount.innerHTML = "Aucun step à afficher.";
    // return = sortir de la fonction (ne pas continuer)
    return;
  }

  // --------------------------------------------------------------------------
  // ÉTAPE 4 : CRÉATION DE L'ÉTAT GLOBAL (SÉLECTIONS DE L'UTILISATEUR)
  // --------------------------------------------------------------------------

  // selection = objet qui stocke tous les choix de l'utilisateur
  // Exemple : { typeId: 1, finitionId: 2, longueur_a: 150 }
  // Object.create(null) = créer un objet sans prototype (plus propre, évite les bugs)
  const selection = Object.create(null);

  // --------------------------------------------------------------------------
  // ÉTAPE 5 : INITIALISATION DE L'INDEX DE L'ÉTAPE COURANTE
  // --------------------------------------------------------------------------

  // current = numéro de l'étape en cours (0 = première étape)
  // clamp() = s'assurer que la valeur est entre 0 et le nombre d'étapes - 1
  // Par exemple, si on a 5 étapes et startAt = 10, clamp retournera 4 (dernière étape)
  let current = clamp(startAt, 0, stepsArr.length - 1);

  // --------------------------------------------------------------------------
  // ÉTAPE 6 : RÉCUPÉRATION DES CONTENEURS DOM
  // --------------------------------------------------------------------------

  // Le HTML doit contenir 4 zones principales (définies dans index.html)
  // getElementById() = chercher un élément par son attribut id
  const $previewContainer = document.getElementById("cfg-preview");  // Zone d'aperçu visuel
  const $sidebarContainer = document.getElementById("cfg-steps");    // Barre latérale des étapes
  const $fieldsContainer  = document.getElementById("cfg-fields");   // Zone du formulaire
  const $navContainer     = document.getElementById("cfg-nav");      // Zone de navigation

  // Vérification que tous les conteneurs existent
  // Si un seul manque, on ne peut pas afficher l'interface
  if (!$previewContainer || !$sidebarContainer || !$fieldsContainer || !$navContainer) {
    throw new Error("❌ Conteneurs manquants (#cfg-preview, #cfg-steps, #cfg-fields, #cfg-nav). Vérifie index.html.");
  }

  // --------------------------------------------------------------------------
  // ÉTAPE 7 : NETTOYAGE DES CONTENEURS
  // --------------------------------------------------------------------------

  // On vide le contenu HTML de chaque conteneur pour repartir à zéro
  // innerHTML = "" signifie "effacer tout le contenu"
  $previewContainer.innerHTML = "";
  $sidebarContainer.innerHTML = "";
  $fieldsContainer.innerHTML  = "";
  $navContainer.innerHTML     = "";

  // On vide aussi le conteneur principal
  mount.innerHTML = "";

  // --------------------------------------------------------------------------
  // ÉTAPE 8 : CRÉATION DE LA STRUCTURE HTML DE BASE
  // --------------------------------------------------------------------------

  // On crée les éléments HTML de base pour structurer l'interface
  // el() = fonction utilitaire qui crée un élément HTML avec des attributs
  const $root = el("div", { class: "cfg-root" });      // Conteneur racine
  const $sidebar = el("aside", { class: "cfg-steps" }); // Barre latérale (balise <aside>)
  const $main = el("main", { class: "cfg-main" });      // Zone principale (balise <main>)
  const $nav = el("div", { class: "cfg-nav" });         // Zone de navigation

  // Construction de la hiérarchie HTML
  // appendChild() = ajouter un élément enfant à un élément parent
  $root.appendChild($sidebar);   // On met la sidebar dans root
  $root.appendChild($main);      // On met main dans root
  $root.appendChild($nav);       // On met nav dans root

  // On insère la structure complète dans le conteneur mount
  mount.appendChild($root);

  // --------------------------------------------------------------------------
  // ÉTAPE 9 : CRÉATION DU CONTEXTE (FONCTIONS PARTAGÉES)
  // --------------------------------------------------------------------------

  // Les predicates sont des fonctions qui testent des conditions
  // Par exemple : "est-ce que l'étape 'finition' doit être visible ?"
  const predicates = makePredicates({
    selection,              // Les choix de l'utilisateur
    stepsArr,              // La liste des étapes
    data,                  // Les données externes
    getCurrentIndex: () => current  // Fonction qui retourne l'étape courante
  });

  // ctx = contexte = objet qui contient TOUTES les fonctions et données
  // dont les autres modules (renderers) ont besoin
  const ctx = {
    // --- Données ---
    selection,              // Les choix de l'utilisateur (objet clé-valeur)
    data,                  // Données externes (catalogues, tarifs...)
    stepsArr,              // Liste des étapes

    // --- Gestion de l'étape courante ---

    // Fonction pour obtenir l'index de l'étape courante
    // () => current : fonction fléchée qui retourne la valeur de current
    getCurrentIndex: () => current,

    // Fonction pour changer l'étape courante
    // (i) => {...} : fonction fléchée qui prend un index en paramètre
    setCurrentIndex: (i) => { 
      // On borne l'index entre 0 et le nombre d'étapes - 1
      current = clamp(i, 0, stepsArr.length - 1); 
    },

    // --- Gestion des erreurs de validation ---

    // Set = structure de données qui stocke des valeurs uniques (pas de doublons)
    // On y stocke les id des champs qui ont une erreur
    invalidFields: new Set(),

    // Message d'erreur à afficher (texte)
    requiredErrorMessage: "",

    // Fonction pour définir des erreurs sur certains champs
    // ids = tableau des id de champs invalides
    // message = texte à afficher à l'utilisateur
    setRequiredErrors(ids, message) {
      // this = référence à l'objet ctx lui-même
      this.invalidFields = new Set(ids);  // On crée un nouveau Set avec les ids
      this.requiredErrorMessage = message || "";  // message || "" = si message est vide, utiliser ""
    },

    // Fonction pour effacer toutes les erreurs
    clearRequiredErrors() {
      this.invalidFields.clear();  // clear() = vider le Set
      this.requiredErrorMessage = "";
    },

    // --- Fonctions de visibilité ---

    // Vérifier si une étape doit être visible
    // Utilise la fonction resolvePredicate pour évaluer la condition showIf
    isStepVisible: (step) => predicates.stepVisible(step, resolvePredicate),

    // Vérifier si un champ doit être visible
    shouldShowField: (field) => predicates.fieldVisible(field, resolvePredicate),

    // --- Gestion de la sélection ---

    // Effacer les choix des étapes suivantes
    // Utile quand on change un choix qui impacte les étapes d'après
    clearSelectionsBeyond: (step, { preserve = [] } = {}) => {
      // indexOf() = trouver la position d'un élément dans un tableau
      const idx = stepsArr.indexOf(step);

      // Boucle for : on parcourt les étapes suivantes
      for (let i = idx + 1; i < stepsArr.length; i++) {
        // Pour chaque champ de l'étape
        // ?? [] = si fields est null/undefined, utiliser un tableau vide
        for (const f of stepsArr[i].fields ?? []) {
          // Si le champ est dans la liste preserve, on le garde
          if (preserve.includes(f.id)) continue;  // continue = passer au suivant

          // delete = supprimer une propriété d'un objet
          delete selection[f.id];
        }
      }
    },

    // --- Validation de complétude ---

    // Vérifier si une étape est complète (tous les champs requis sont remplis)
    isStepComplete: (step) => {
      // filter() = créer un nouveau tableau avec seulement les éléments qui passent le test
      const fields = (step.fields ?? []).filter(f => ctx.shouldShowField(f));

      // every() = vérifier que TOUS les éléments du tableau passent le test
      // Pour chaque champ, on vérifie :
      // - Soit il n'est pas requis (!f.required)
      // - Soit il est rempli (selection[f.id] existe et n'est pas vide)
      return fields.every(f =>
        !f.required || (selection[f.id] !== undefined && selection[f.id] !== "" && selection[f.id] !== null)
      );
    },

    // --- Fonction de rendu globale ---

    // rerenderAll() = redessiner toute l'interface utilisateur
    // On l'appelle chaque fois qu'on change d'étape ou qu'on modifie un choix
    rerenderAll: () => {
      // On appelle les 3 fonctions de rendu avec les conteneurs et le contexte
      renderSidebar({ containers, ctx });  // Redessiner la barre latérale
      renderStep({ containers, ctx });     // Redessiner le formulaire
      renderNav({ containers, ctx });      // Redessiner la navigation
    }
  };

  // --------------------------------------------------------------------------
  // ÉTAPE 10 : REGROUPEMENT DES CONTENEURS
  // --------------------------------------------------------------------------

  // On regroupe tous les conteneurs dans un seul objet
  // Cela simplifie le passage de paramètres aux fonctions de rendu
  const containers = {
    mount,                 // Conteneur principal
    $previewContainer,     // Zone d'aperçu
    $sidebarContainer,     // Barre latérale
    $fieldsContainer,      // Zone du formulaire
    $navContainer          // Zone de navigation
  };

  // --------------------------------------------------------------------------
  // ÉTAPE 11 : RENDU INITIAL DE L'INTERFACE
  // --------------------------------------------------------------------------

  // On lance le premier affichage de l'interface utilisateur
  // Cela va dessiner la sidebar, le formulaire de la première étape, et les boutons
  ctx.rerenderAll();
}

// ============================================================================
// FONCTION UTILITAIRE : RÉCUPÉRER UN PARAMÈTRE D'URL
// ============================================================================

/**
 * Récupère la valeur d'un paramètre dans l'URL.
 * 
 * Par exemple, si l'URL est : http://example.com/configurateur?code=barres&debug=true
 * getQueryParam("code") retournera "barres"
 * getQueryParam("debug") retournera "true"
 * getQueryParam("absent") retournera null
 *
 * @param {string} name - Le nom du paramètre à récupérer
 * @returns {string|null} - La valeur du paramètre, ou null si absent
 */
export function getQueryParam(name) {
  // URLSearchParams = API JavaScript pour analyser les paramètres d'URL
  // location.search = la partie de l'URL après le ? (exemple : "?code=barres&debug=true")
  const p = new URLSearchParams(location.search);

  // get() = récupérer la valeur d'un paramètre (retourne null si absent)
  return p.get(name);
}

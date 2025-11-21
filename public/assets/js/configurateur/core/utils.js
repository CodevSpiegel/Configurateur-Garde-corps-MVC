/**
 * ============================================================================
 * core/utils.js — Boîte à outils du configurateur
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier contient toutes les petites fonctions utilitaires utilisées
 * partout dans l'application. Ce sont des "outils" réutilisables.
 *
 * 📚 TYPES DE FONCTIONS :
 * - Création d'éléments HTML (el, text)
 * - Sécurité (escapeHtml)
 * - Mathématiques (clamp)
 * - Normalisation de données (normalizeSteps, normalizeOptions)
 * - Évaluation dynamique (resolveMaybeFn, resolvePredicate)
 *
 * 💡 FONCTIONS PURES :
 * Ces fonctions n'ont pas d'effets de bord (elles ne modifient rien en dehors)
 * Elles prennent des paramètres et retournent un résultat, c'est tout.
 */

// ============================================================================
// FONCTION : CRÉER UN ÉLÉMENT HTML
// ============================================================================

/**
 * el() = créer facilement un élément HTML avec ses attributs et enfants
 *
 * C'est une fabrique d'éléments qui simplifie la création d'éléments HTML.
 * Au lieu d'écrire 5 lignes, on en écrit 1 !
 *
 * EXEMPLE D'UTILISATION :
 * el("div", { class: "card", id: "mon-div" }, "Texte", autreElement)
 *
 * @param {string} tag - Nom de la balise HTML (div, button, img, span...)
 * @param {Object} attrs - Attributs à ajouter (class, id, style, onclick...)
 * @param {...any} children - Les enfants (texte ou éléments HTML)
 * @returns {HTMLElement} - L'élément HTML créé
 */
export function el(tag, attrs = {}, ...children) {
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : CRÉER L'ÉLÉMENT DE BASE
  // --------------------------------------------------------------------------

  // createElement() = méthode native JavaScript pour créer un élément HTML
  // tag = nom de la balise (ex: "div" crée un <div></div>)
  const node = document.createElement(tag);

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : APPLIQUER LES ATTRIBUTS
  // --------------------------------------------------------------------------

  // Object.entries() = convertir un objet en tableau de paires [clé, valeur]
  // Exemple : { class: "btn", id: "mon-btn" } → [["class", "btn"], ["id", "mon-btn"]]
  Object.entries(attrs).forEach(([k, v]) => {
    // [k, v] = destructuration : k = clé, v = valeur

    // Si la valeur est null ou undefined, on l'ignore
    // == null vérifie à la fois null ET undefined
    if (v == null) return;

    // Il y a 2 façons de définir un attribut en JavaScript :
    // 1. Comme propriété : node.className = "btn"
    // 2. Avec setAttribute : node.setAttribute("class", "btn")

    // On teste si la clé existe comme propriété de l'élément
    // in = opérateur qui teste si une propriété existe
    if (k in node) {
      // Si oui, on utilise l'affectation directe (plus rapide)
      node[k] = v;
    } else {
      // Sinon, on utilise setAttribute (pour les attributs personnalisés)
      node.setAttribute(k, v);
    }
  });

  // --------------------------------------------------------------------------
  // ÉTAPE 3 : AJOUTER LES ENFANTS
  // --------------------------------------------------------------------------

  // children = tous les arguments après attrs (grâce à ...children)
  // forEach() = parcourir chaque enfant
  children.forEach(c => {
    // typeof = opérateur qui retourne le type d'une variable
    // Si c'est une chaîne de caractères (string), on crée un nœud de texte
    // Sinon, c'est déjà un élément HTML qu'on ajoute directement
    node.appendChild(
      typeof c === "string"
        ? document.createTextNode(c)  // Créer un nœud de texte
        : c                           // Utiliser l'élément tel quel
    );
  });

  // Retourner l'élément créé
  return node;
}

// ============================================================================
// FONCTION : CRÉER UN NŒUD DE TEXTE
// ============================================================================

/**
 * text() = raccourci pour créer un nœud de texte
 *
 * Un nœud de texte = du texte pur sans balise HTML
 *
 * @param {string} s - Le texte à créer
 * @returns {Text} - Un nœud de texte
 */
export function text(s) {
  // createTextNode() = méthode native pour créer du texte pur
  return document.createTextNode(s);
}

// ============================================================================
// FONCTION : BORNER UN NOMBRE
// ============================================================================

/**
 * clamp() = limiter un nombre entre une valeur min et max
 *
 * Très utile pour éviter les débordements (index hors tableau, etc.)
 *
 * EXEMPLES :
 * clamp(5, 0, 10)  → 5   (entre 0 et 10, donc OK)
 * clamp(15, 0, 10) → 10  (trop grand, on ramène à 10)
 * clamp(-5, 0, 10) → 0   (trop petit, on ramène à 0)
 *
 * @param {number} n - Le nombre à borner
 * @param {number} a - La valeur minimale
 * @param {number} b - La valeur maximale
 * @returns {number} - Le nombre borné entre a et b
 */
export function clamp(n, a, b) {
  // Math.max(a, x) = retourner le plus grand entre a et x
  // Math.min(b, n) = retourner le plus petit entre b et n

  // Logique en 2 étapes :
  // 1. Math.min(b, n) = s'assurer que n ne dépasse pas b
  // 2. Math.max(a, ...) = s'assurer que le résultat n'est pas en dessous de a
  return Math.max(a, Math.min(b, n));
}

// ============================================================================
// FONCTION : SÉCURISER DU TEXTE HTML
// ============================================================================

/**
 * escapeHtml() = protéger contre les injections XSS
 *
 * XSS (Cross-Site Scripting) = faille de sécurité où un utilisateur
 * peut injecter du code HTML/JavaScript malveillant
 *
 * Cette fonction remplace les caractères dangereux par des entités HTML sûres
 *
 * EXEMPLES :
 * escapeHtml("<script>alert('hack')</script>")
 * → "&lt;script&gt;alert('hack')&lt;/script&gt;"
 * (Le navigateur affichera le texte tel quel au lieu de l'exécuter)
 *
 * @param {string} s - Le texte à sécuriser
 * @returns {string} - Le texte avec caractères spéciaux échappés
 */
export function escapeHtml(s) {
  // String(s) = convertir en chaîne de caractères (au cas où)
  return String(s).replace(/[&<>"']/g, m => ({
    // replace() avec fonction = remplacer selon un dictionnaire
    // m = caractère trouvé (&, <, >, ", ou ')
    // On le remplace par son équivalent HTML sécurisé
    "&": "&amp;",    // & devient &amp;
    "<": "&lt;",     // < devient &lt;
    ">": "&gt;",     // > devient &gt;
    "\"": "&quot;",  // " devient &quot;
    "'": "&#039;"    // ' devient &#039;
  }[m]));  // [m] = chercher la valeur correspondant à m dans l'objet
}

// ============================================================================
// FONCTION : NORMALISER LES ÉTAPES
// ============================================================================

/**
 * normalizeSteps() = uniformiser le format des étapes
 *
 * Les étapes peuvent être fournies de 2 façons :
 * 1. Array : [{ id: "type", ... }, { id: "finition", ... }]
 * 2. Object : { type: {...}, finition: {...} }
 *
 * Cette fonction convertit TOUJOURS en Array pour simplifier le traitement
 *
 * @param {Array|Object} input - Les étapes (format libre)
 * @returns {Array} - Les étapes normalisées en tableau
 */
export function normalizeSteps(input) {
  // --------------------------------------------------------------------------
  // ÉTAPE 1 : CONVERTIR EN TABLEAU SI C'EST UN OBJET
  // --------------------------------------------------------------------------

  // Array.isArray() = tester si une variable est un tableau
  let arr = Array.isArray(input)
    // Si c'est déjà un tableau, on l'utilise tel quel
    ? input
    // Sinon, on convertit l'objet en tableau
    : Object.keys(input || {})  // Object.keys() = obtenir toutes les clés
        .map(k => ({             // map() = transformer chaque élément
          id: k,                  // La clé devient l'id
          ...(input[k] ?? {})     // ... = spread operator (copier toutes les propriétés)
        }));

  // --------------------------------------------------------------------------
  // ÉTAPE 2 : S'ASSURER QUE CHAQUE ÉTAPE A UN ID
  // --------------------------------------------------------------------------

  // map() avec index (i) = parcourir avec la position
  arr = arr.map((s, i) => ({
    // ?? = opérateur de coalescence (si s.id n'existe pas, utiliser la valeur de droite)
    id: s.id ?? `step_${i + 1}`,  // Id de secours : step_1, step_2, etc.
    ...s                           // Copier toutes les autres propriétés
  }));

  // Retourner le tableau normalisé
  return arr;
}

// ============================================================================
// FONCTION : NORMALISER LES OPTIONS D'UN CHAMP
// ============================================================================

/**
 * normalizeOptions() = uniformiser le format des options d'un champ "choice"
 *
 * Les options peuvent être :
 * 1. Un tableau de strings : ["Option 1", "Option 2"]
 * 2. Un tableau d'objets : [{ value: 1, label: "Option 1" }]
 * 3. Un objet : { opt1: { label: "Option 1" }, opt2: { label: "Option 2" } }
 *
 * Cette fonction convertit TOUT en tableau d'objets { value, label, image }
 *
 * @param {Array|Object} options - Les options (format libre)
 * @returns {Array} - Les options normalisées
 */
export function normalizeOptions(options) {
  // Si options est vide ou null, retourner un tableau vide
  if (!options) return [];

  // --------------------------------------------------------------------------
  // CAS 1 : OPTIONS EN TABLEAU
  // --------------------------------------------------------------------------

  if (Array.isArray(options)) {
    // Parcourir chaque option et la normaliser
    return options.map(o => ({
      // Priorité pour trouver la valeur : value > slug > id > l'option elle-même
      // ?? = coalescence : si la première valeur est null, essayer la suivante
      value: o.value ?? o.slug ?? o.id ?? o,

      // Label : essayer plusieurs propriétés, sinon convertir en string
      label: o.label ?? String(o.label ?? o.value ?? o),

      // Image (optionnelle)
      image: o.image
    }));
  }

  // --------------------------------------------------------------------------
  // CAS 2 : OPTIONS EN OBJET
  // --------------------------------------------------------------------------

  if (typeof options === "object") {
    // Object.keys() = obtenir toutes les clés de l'objet
    return Object.keys(options).map(k => {
      // Récupérer l'objet option (ou {} si null)
      const o = options[k] ?? {};

      return {
        // Pour un objet, on peut utiliser la clé comme value de secours
        value: o.value ?? o.slug ?? k,
        label: o.label ?? String(o.label ?? k),
        image: o.image
      };
    });
  }

  // Si le format n'est ni tableau ni objet, retourner un tableau vide
  return [];
}

// ============================================================================
// FONCTION : RÉSOUDRE UNE VALEUR OU UNE FONCTION
// ============================================================================

/**
 * resolveMaybeFn() = exécuter une fonction ou retourner une valeur
 *
 * Certaines propriétés peuvent être :
 * - Soit une valeur fixe : "Mon texte"
 * - Soit une fonction qui calcule la valeur : (ctx) => ctx.selection.type === 1 ? "A" : "B"
 *
 * Cette fonction gère les deux cas automatiquement
 *
 * @param {any|Function} maybe - La valeur ou la fonction
 * @param {Object} ctx - Le contexte (selection, data, steps...)
 * @returns {any} - La valeur résolue
 */
export function resolveMaybeFn(maybe, ctx) {
  // typeof = obtenir le type d'une variable
  // Si c'est une fonction, l'exécuter avec le contexte
  // Sinon, retourner la valeur telle quelle (ou null si undefined)
  return typeof maybe === "function"
    ? maybe(ctx)      // Exécuter la fonction
    : (maybe ?? null); // ?? = si maybe est undefined, utiliser null
}

// ============================================================================
// FONCTION : ÉVALUER UNE CONDITION (PRÉDICAT)
// ============================================================================

/**
 * resolvePredicate() = évaluer une condition pour savoir si quelque chose doit s'afficher
 *
 * Les conditions (showIf) peuvent être de 3 types :
 * 1. Fonction : (ctx) => ctx.selection.typeId === 1
 * 2. String : "selection.typeId === 1"
 * 3. Booléen : true ou false
 *
 * ⚠️ ATTENTION : Cette fonction utilise eval() pour les strings
 * eval() exécute du code JavaScript, ce qui peut être dangereux !
 * On suppose que le code dans steps.js est de confiance
 *
 * @param {boolean|string|Function} pred - La condition à évaluer
 * @param {Object} ctx - Le contexte (selection, step, steps, data)
 * @returns {boolean} - true si la condition est vraie, false sinon
 */
export function resolvePredicate(pred, ctx) {
  // try/catch = gérer les erreurs
  // Si l'évaluation échoue, retourner false au lieu de planter
  try {
    // --------------------------------------------------------------------------
    // CAS 1 : FONCTION
    // --------------------------------------------------------------------------

    if (typeof pred === "function") {
      // Exécuter la fonction avec le contexte
      // Boolean() = convertir le résultat en vrai booléen (true/false)
      return Boolean(pred(ctx));
    }

    // --------------------------------------------------------------------------
    // CAS 2 : STRING (EXPRESSION JAVASCRIPT)
    // --------------------------------------------------------------------------

    if (typeof pred === "string") {
      // On doit remplacer "selection" et "data" par "ctx.selection" et "ctx.data"
      // pour que l'expression puisse accéder au contexte

      // replace() avec regex /\b...\b/g = remplacer tous les mots complets
      // \b = limite de mot (word boundary)
      // g = global (remplacer toutes les occurrences)
      const expr = pred
        .replace(/\bselection\b/g, "ctx.selection")
        .replace(/\bdata\b/g, "ctx.data");

      // ⚠️ eval() = exécuter du code JavaScript depuis une string
      // C'est dangereux car on exécute du code non vérifié !
      // Ici, on suppose que steps.js est de confiance
      // eslint-disable-next-line = désactiver l'avertissement ESLint
      return Boolean(eval(expr));
    }

    // --------------------------------------------------------------------------
    // CAS 3 : BOOLÉEN OU AUTRE VALEUR
    // --------------------------------------------------------------------------

    // Boolean() = convertir n'importe quelle valeur en booléen
    // Valeurs "fausses" : false, 0, "", null, undefined, NaN
    // Toutes les autres valeurs deviennent true
    return Boolean(pred);

  } catch {
    // Si une erreur se produit pendant l'évaluation,
    // on retourne false (mieux vaut cacher que planter)
    return false;
  }
}

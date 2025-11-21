/**
 * ============================================================================
 * datasets/verre-a-profile/steps.js — Configuration pour verre à profilé aluminium
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier définit les étapes de configuration pour les garde-corps en verre
 * maintenu par des profilés en aluminium. C'est le dataset le plus complexe
 * du configurateur car il gère 18 types de verre différents avec des règles
 * métier très précises.
 *
 * 📚 SPÉCIFICITÉS DU VERRE À PROFILÉ :
 * - 18 types de verre différents (EVA, PVB, HST, extra-clair, opale...)
 * - Matrice de combinaisons complexe (lieu + projet + hauteur → verres recommandés)
 * - Profilés en aluminium (anodisé ou peint noir)
 * - 9 types de profils différents (autoréglables, en F, en U, Y...)
 * - Conformité aux normes selon le contexte d'installation
 *
 * 💡 PRINCIPE TECHNIQUE :
 * Le verre est maintenu dans des profilés aluminium, offrant :
 * - Grande résistance mécanique
 * - Esthétique moderne et épurée
 * - Installation facilitée grâce aux profilés
 * - Choix du verre selon les normes de sécurité
 */

// ============================================================================
// PARTIE 1 : CATALOGUE DES TYPES DE VERRE
// ============================================================================

/**
 * GLASS_CATALOG = dictionnaire central qui associe chaque type de verre
 * à son ID dans la base de données.
 *
 * 🔑 STRUCTURE DES CODES DE VERRE :
 * Les codes suivent ce pattern : "épaisseur1-épaisseur2-type-variante"
 *
 * Exemples :
 * - "88-4-eva-hst" = 2 verres de 8mm + 4 films EVA avec traitement HST
 * - "1010-4-pvb-extra-clair" = 2 verres de 10mm + 4 films PVB extra-clair
 *
 * 📏 ÉPAISSEURS :
 * - 88-4 = 8mm + 8mm + films = environ 17mm total
 * - 1010-4 = 10mm + 10mm + films = environ 21mm total
 *
 * 🧪 TYPES DE FILMS :
 * - EVA = Éthylène-Acétate de Vinyle (meilleure adhérence)
 * - PVB = PolyVinyl Butyral (standard, économique)
 *
 * 🔒 TRAITEMENTS :
 * - HST = Heat Soak Test (test thermique pour éviter la casse spontanée)
 * - extra-clair = verre avec très faible teinte verte
 * - opale = verre translucide mais pas transparent (intimité)
 *
 * ⚠️ IMPORTANT : Ces IDs doivent correspondre à la table gc_verres en BDD
 */
const GLASS_CATALOG = {
  // Série 88-4 EVA (épaisseur standard)
  "88-4-eva-hst":                1,   // 8+8mm, EVA, HST - Usage extérieur sécurisé
  "88-4-eva-hst-extra-clair":    2,   // 8+8mm, EVA, HST, extra-clair - Transparence maximale
  "88-4-eva-extra-clair":        3,   // 8+8mm, EVA, extra-clair - Intérieur haute clarté
  "88-4-eva-opale":              7,   // 8+8mm, EVA, opale - Intimité avec lumière
  "88-4-eva":                    8,   // 8+8mm, EVA - Usage standard intérieur

  // Série 88-4 PVB (alternative économique)
  "88-4-pvb-extra-clair":        10,  // 8+8mm, PVB, extra-clair
  "88-4-pvb-hst-extra-clair":    11,  // 8+8mm, PVB, HST, extra-clair
  "88-4-pvb-hst":                12,  // 8+8mm, PVB, HST
  "88-4-pvb":                    13,  // 8+8mm, PVB - Le plus économique

  // Série 1010-4 EVA (épaisseur renforcée)
  "1010-4-eva-extra-clair":      14,  // 10+10mm, EVA, extra-clair - Haute résistance
  "1010-4-eva-hst-extra-clair":  15,  // 10+10mm, EVA, HST, extra-clair
  "1010-4-eva-hst":              16,  // 10+10mm, EVA, HST
  "1010-4-eva-opale":            17,  // 10+10mm, EVA, opale
  "1010-4-eva":                  18,  // 10+10mm, EVA

  // Série 1010-4 PVB (épaisseur renforcée)
  "1010-4-pvb-extra-clair":      19,  // 10+10mm, PVB, extra-clair
  "1010-4-pvb-hst-extra-clair":  20,  // 10+10mm, PVB, HST, extra-clair
  "1010-4-pvb-hst":              21,  // 10+10mm, PVB, HST
  "1010-4-pvb":                  22,  // 10+10mm, PVB
};

// ============================================================================
// PARTIE 2 : MATRICE DE COMBINAISONS (RÈGLES MÉTIER)
// ============================================================================

/**
 * RAW_VERRE_COMBOS = matrice qui définit quels types de verre sont recommandés
 * selon 3 critères :
 *
 * 🏠 1. LIEU D'INSTALLATION :
 *    - "1" = Intérieur / Extérieur à l'abri
 *    - "2" = Extérieur
 *    - "3" = Extérieur exposé aux vents forts
 *
 * 🏢 2. TYPE DE PROJET :
 *    - "1" = Habitation privée (résidentiel)
 *    - "2" = Établissement Recevant du Public (ERP)
 *
 * 📏 3. HAUTEUR DE CHUTE :
 *    - "1" = Sans danger (< 1m)
 *    - "2" = Chute limitée (1-6m)
 *    - "3" = Chute importante (> 6m)
 *
 * 🔑 CLÉ DE LA MATRICE : "lieu-projet-hauteur"
 * Exemple : "1-1-1" = Intérieur + Résidentiel + < 1m
 *
 * 💡 LOGIQUE MÉTIER :
 * - Plus le risque est élevé → verre plus épais (1010 au lieu de 88)
 * - ERP ou hauteur importante → traitement HST obligatoire
 * - Extérieur exposé → verre renforcé systématiquement
 */
const RAW_VERRE_COMBOS = {
  // ========================================================================
  // LIEU 1 : INTÉRIEUR / EXTÉRIEUR À L'ABRI
  // ========================================================================

  // 1-1-1 : Intérieur + Résidentiel + Faible hauteur
  // → Verres standards suffisants
  "1-1-1": [
    "88-4-eva-opale",           // Option intimité
    "88-4-pvb",                 // Option économique
    "88-4-pvb-extra-clair",     // Option clarté
  ],

  // 1-1-2 : Intérieur + Résidentiel + Hauteur moyenne (1-6m)
  // → Ajout d'une option renforcée (1010)
  "1-1-2": [
    "88-4-eva-opale",
    "88-4-pvb",
    "88-4-pvb-extra-clair",
    "1010-4-eva-opale",         // Option renforcée pour sécurité
  ],

  // 1-1-3 : Intérieur + Résidentiel + Grande hauteur (> 6m)
  // → Uniquement verres renforcés (1010)
  "1-1-3": [
    "1010-4-eva-opale",
    "1010-4-pvb",
    "1010-4-pvb-extra-clair",
  ],

  // 1-2-1 : Intérieur + ERP + Faible hauteur
  // → HST obligatoire pour ERP
  "1-2-1": [
    "88-4-pvb-hst",             // HST = test thermique anti-casse spontanée
    "88-4-pvb-hst-extra-clair",
  ],

  // 1-2-2 : Intérieur + ERP + Hauteur moyenne
  // → HST obligatoire
  "1-2-2": [
    "88-4-pvb-hst",
    "88-4-pvb-hst-extra-clair",
  ],

  // 1-2-3 : Intérieur + ERP + Grande hauteur
  // → HST + verre renforcé (1010)
  "1-2-3": [
    "1010-4-pvb-hst",
    "1010-4-pvb-hst-extra-clair",
  ],

  // ========================================================================
  // LIEU 2 : EXTÉRIEUR (EXPOSÉ À LA PLUIE)
  // ========================================================================

  // 2-1-1 : Extérieur + Résidentiel + Faible hauteur
  // → EVA privilégié (meilleure adhérence sous humidité)
  "2-1-1": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
  ],

  // 2-1-2 : Extérieur + Résidentiel + Hauteur moyenne
  // → EVA + option renforcée
  "2-1-2": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
    "1010-4-eva-opale",         // Sécurité accrue
  ],

  // 2-1-3 : Extérieur + Résidentiel + Grande hauteur
  // → Uniquement 1010 EVA
  "2-1-3": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
    "1010-4-eva-opale",
  ],

  // 2-2-1 : Extérieur + ERP + Faible hauteur
  // → EVA + HST obligatoire
  "2-2-1": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],

  // 2-2-2 : Extérieur + ERP + Hauteur moyenne
  // → EVA + HST
  "2-2-2": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],

  // 2-2-3 : Extérieur + ERP + Grande hauteur
  // → 1010 EVA + HST
  "2-2-3": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],

  // ========================================================================
  // LIEU 3 : EXTÉRIEUR EXPOSÉ AUX VENTS FORTS
  // ========================================================================

  // 3-1-1 : Vents forts + Résidentiel + Faible hauteur
  // → EVA standard suffisant (mais pas de PVB)
  "3-1-1": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
  ],

  // 3-1-2 : Vents forts + Résidentiel + Hauteur moyenne
  // → Verre renforcé recommandé
  "3-1-2": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
  ],

  // 3-1-3 : Vents forts + Résidentiel + Grande hauteur
  // → Verre renforcé obligatoire
  "3-1-3": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
    "1010-4-eva-opale",
  ],

  // 3-2-1 : Vents forts + ERP + Faible hauteur
  // → EVA + HST
  "3-2-1": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],

  // 3-2-2 : Vents forts + ERP + Hauteur moyenne
  // → 1010 EVA + HST
  "3-2-2": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],

  // 3-2-3 : Vents forts + ERP + Grande hauteur
  // → Maximum de sécurité : 1010 EVA HST
  "3-2-3": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],
};

// ============================================================================
// PARTIE 3 : ENRICHISSEMENT AUTOMATIQUE DES COMBINAISONS
// ============================================================================

/**
 * VERRE_COMBOS = version enrichie de RAW_VERRE_COMBOS
 *
 * Au lieu d'avoir juste des codes strings ["88-4-eva", ...],
 * on obtient des objets [{code: "88-4-eva", verreId: 8}, ...]
 *
 * 💡 POURQUOI ENRICHIR ?
 * - Le backend a besoin du verreId numérique pour la base de données
 * - On maintient les IDs à un seul endroit (GLASS_CATALOG)
 * - Évite la duplication et les erreurs
 *
 * 🔧 TECHNIQUE UTILISÉE :
 * Object.fromEntries() + Object.entries() = transformer un objet
 */
const VERRE_COMBOS = Object.fromEntries(
  // Object.entries() = convertir objet en tableau de paires [clé, valeur]
  // Exemple : {a: [1,2]} → [["a", [1,2]]]
  Object.entries(RAW_VERRE_COMBOS).map(([key, codes]) => {
    // Pour chaque paire [clé, tableau de codes]
    // key = "1-1-1", codes = ["88-4-eva-opale", ...]

    // Enrichir chaque code avec son verreId
    // map() = transformer chaque élément du tableau
    const enriched = codes.map(code => ({ 
      code,                             // Le code technique (ex: "88-4-eva")
      verreId: GLASS_CATALOG[code] ?? null  // L'ID en BDD (ex: 8) ou null si absent
      // ?? = opérateur de coalescence (si undefined, utiliser null)
    }));

    // Retourner la nouvelle paire [clé, tableau enrichi]
    return [key, enriched];
  })
  // Object.fromEntries() = reconvertir le tableau en objet
  // Résultat : { "1-1-1": [{code: "88-4-eva-opale", verreId: 7}, ...], ... }
);

// ============================================================================
// PARTIE 4 : FONCTIONS UTILITAIRES
// ============================================================================

/**
 * comboKey() = construire la clé de la matrice à partir des choix utilisateur
 *
 * Cette fonction prend les 3 sélections (lieu, projet, hauteur) et les combine
 * en une seule clé pour chercher dans VERRE_COMBOS.
 *
 * @param {Object} selection - L'objet contenant tous les choix de l'utilisateur
 * @returns {string|null} - La clé "a-b-c" ou null si incomplete
 *
 * EXEMPLES :
 * - { lieuInstallation: "1", typeProjet: "1", hauteurChute: "1" } → "1-1-1"
 * - { lieuInstallation: "2", typeProjet: "2", hauteurChute: "3" } → "2-2-3"
 * - { lieuInstallation: "1" } → null (incomplet)
 */
function comboKey(selection) {
  // Extraire les 3 valeurs nécessaires
  const a = selection.lieuInstallation;  // "1" | "2" | "3"
  const b = selection.typeProjet;        // "1" | "2"
  const c = selection.hauteurChute;      // "1" | "2" | "3"

  // Si une seule valeur manque, on ne peut pas construire la clé
  // ! = négation logique (transforme valeur en booléen et l'inverse)
  if (!a || !b || !c) return null;

  // Template string pour construire la clé
  // ${variable} = insérer la valeur de la variable dans la chaîne
  return `${a}-${b}-${c}`;
}

/**
 * labelFromCode() = convertir un code technique en label lisible
 *
 * Transforme "88-4-eva-hst-extra-clair" en "88 4 EVA HST Extra clair"
 *
 * @param {string} code - Le code technique (ex: "88-4-eva-opale")
 * @returns {string} - Le label lisible (ex: "88 4 EVA Opale")
 *
 * 🔧 TRANSFORMATIONS APPLIQUÉES :
 * 1. Remplacer les tirets par des espaces
 * 2. Mettre EVA, PVB, HST en majuscules
 * 3. Capitaliser Opale, Extra clair
 */
function labelFromCode(code) {
  return code
    // replace() = remplacer dans une chaîne de caractères
    // /-/g = regex pour trouver TOUS les tirets (g = global)
    .replace(/-/g, " ")

    // /\b(eva|pvb|hst)\b/gi = regex pour trouver eva, pvb ou hst
    // \b = limite de mot (word boundary)
    // gi = g = global, i = insensible à la casse
    // s => ... = fonction qui prend le match et le transforme
    .replace(/\b(eva|pvb|hst)\b/gi, s => s.toUpperCase())
    // toUpperCase() = convertir en majuscules

    // Capitaliser "opale"
    // gi = insensible à la casse (trouve opale, Opale, OPALE...)
    .replace(/\bopale\b/gi, "Opale")

    // Capitaliser "extra clair"
    .replace(/\bextra clair\b/gi, "Extra clair")

    // Capitaliser "clair" seul
    .replace(/\bclair\b/gi, "Clair");
}

/**
 * normalizeGlassItem() = uniformiser le format d'un item de verre
 *
 * Les items peuvent arriver sous 2 formes :
 * 1. String simple : "88-4-eva"
 * 2. Objet enrichi : { code: "88-4-eva", verreId: 8 }
 *
 * Cette fonction s'assure qu'on a toujours un objet { code, verreId }
 *
 * @param {string|Object} item - L'item à normaliser
 * @returns {Object} - Toujours { code: string, verreId: number|null }
 */
function normalizeGlassItem(item) {
  // typeof = opérateur qui retourne le type d'une variable
  // Vérifier si l'item est une simple chaîne de caractères
  if (typeof item === "string") {
    // Si c'est une string, la convertir en objet
    return {
      code: item,                          // Le code tel quel
      verreId: GLASS_CATALOG[item] ?? null // Chercher l'ID dans le catalogue
    };
  }

  // Si c'est déjà un objet, normaliser ses propriétés
  return {
    // ?. = optional chaining (accès sécurisé, ne plante pas si null)
    code: item?.code ?? "",                // Extraire le code ou "" par défaut

    // Logique en cascade pour trouver le verreId :
    // 1. D'abord essayer item.verreId directement
    // 2. Sinon, si item.code existe, chercher dans GLASS_CATALOG
    // 3. Sinon, null
    verreId: item?.verreId ?? (item?.code ? (GLASS_CATALOG[item.code] ?? null) : null)
  };
}

/**
 * makeGlassOptions() = convertir des items de verre en options pour l'UI
 *
 * Prend une liste d'items (codes ou objets) et crée des options compatibles
 * avec le système de cartes (cards) du configurateur.
 *
 * @param {Array} items - Liste d'items (strings ou objets)
 * @returns {Array} - Liste d'options formatées pour l'UI
 *
 * FORMAT DE SORTIE :
 * [{
 *   value: "88-4-eva",              // Valeur interne (code)
 *   label: "88 4 EVA (16,76mm)",    // Texte affiché
 *   image: "assets/images/.../88-4-eva.webp",  // Image
 *   meta: { verreId: 8 }            // Métadonnées (ID pour la BDD)
 * }, ...]
 */
function makeGlassOptions(items = []) {
  // = [] signifie "valeur par défaut = tableau vide si items est null/undefined"

  // map() = transformer chaque élément du tableau
  return items.map((item) => {
    // Normaliser l'item pour avoir toujours { code, verreId }
    const { code, verreId } = normalizeGlassItem(item);
    // { code, verreId } = destructuration (extraire les propriétés)

    // Calculer l'épaisseur totale pour l'affichage
    // Logique : si le code commence par "88", c'est 16,76mm
    //           si le code commence par "1010", c'est 20,76mm
    const thickness = code.startsWith("88") ? "16,76mm" : "20,76mm";
    // startsWith() = tester si une chaîne commence par...
    // ? : = opérateur ternaire (condition ? si_vrai : si_faux)

    // Construire le label avec le nom et l'épaisseur
    const label = `${labelFromCode(code)} (${thickness})`;

    // Retourner l'objet option formaté
    return {
      value: code,                    // La valeur sélectionnée (stockée dans selection)
      label: label,                   // Le texte affiché sur la carte
      // Template string pour construire le chemin de l'image
      image: `assets/images/configurateur/verres/${code}.webp`,
      // meta = métadonnées supplémentaires (pas affichées, mais disponibles)
      meta: { verreId }               // L'ID pour l'envoyer au backend
    };
  });
}

// ============================================================================
// PARTIE 5 : DÉFINITION DES ÉTAPES (STEPS)
// ============================================================================

/**
 * export default = exporter le tableau d'étapes par défaut
 *
 * Ce tableau définit le parcours complet de configuration :
 * 1. Type et ancrage
 * 2. Forme
 * 3. Type de verre (avec triple sélection)
 * 4. Mesures
 */
export default [

  // ==========================================================================
  // ÉTAPE 1 : TYPE DE PROFIL ET ANCRAGE
  // ==========================================================================
  {
    // Identifiant unique de l'étape
    id: "type",

    // Titre affiché dans la sidebar et en haut du formulaire
    label: "Type",

    // Description explicative pour l'utilisateur
    description: "Choisissez le type de profil et l'ancrage.",

    // Image d'aperçu par défaut (avant sélection)
    defaultPreview: "assets/images/configurateur/previews/verre-a-profile/autoreglable-sol/autoreglable-sol-decoupe.webp",

    // Liste des champs de cette étape
    fields: [
      // ======================================================================
      // CHAMP 1 : TYPE DE PROFIL
      // ======================================================================
      {
        // Identifiant du champ (stocké dans selection.type)
        id: "type",

        // Label affiché au-dessus du champ
        label: "Type de Profil",

        // Type de champ : "choice" = choix parmi plusieurs options
        type: "choice",

        // Interface utilisateur : "cards" = cartes cliquables avec images
        ui: "cards",

        // Ce champ est obligatoire
        required: true,

        // Liste des options disponibles
        // Chaque option représente un type de profil différent
        options: [
          // ------------------------------------------------------------------
          // PROFILS AUTORÉGLABLES
          // ------------------------------------------------------------------
          // Avantage : compensent automatiquement les dénivelés du sol

          {
            id: 18,                    // ID en base de données
            typeId: 18,                // ID répété pour compatibilité
            value: "autoreglable-sol", // Valeur interne (slug)
            label: "Autoréglable Sol", // Texte affiché
            image: "assets/images/configurateur/types/verre-a-profile/autoreglable-sol.webp"
          },
          {
            id: 19,
            typeId: 19,
            value: "autoreglable-lateral",    // Fixation latérale (sur mur)
            label: "Autoréglable Latéral",
            image: "assets/images/configurateur/types/verre-a-profile/autoreglable-lateral.webp"
          },
          {
            id: 20,
            typeId: 20,
            value: "autoreglable-sol-en-f",   // Profil en forme de F
            label: "Autoréglable Sol en F",
            image: "assets/images/configurateur/types/verre-a-profile/autoreglable-sol-en-f.webp"
          },
          {
            id: 21,
            typeId: 21,
            value: "autoreglable-lateral-y",  // Profil en forme de Y
            label: "Autoréglable Latéral Y",
            image: "assets/images/configurateur/types/verre-a-profile/autoreglable-lateral-y.webp"
          },

          // ------------------------------------------------------------------
          // PROFILS FIXES
          // ------------------------------------------------------------------
          // Plus économiques mais nécessitent un sol parfaitement plat

          {
            id: 22,
            typeId: 22,
            value: "sol-en-f",                // Profil fixe en F
            label: "Sol en F",
            image: "assets/images/configurateur/types/verre-a-profile/sol-en-f.webp"
          },
          {
            id: 23,
            typeId: 23,
            value: "sol-en-u",                // Profil fixe en U
            label: "Sol en U",
            image: "assets/images/configurateur/types/verre-a-profile/sol-en-u.webp"
          },
          {
            id: 24,
            typeId: 24,
            value: "lateral",                 // Fixation latérale simple
            label: "Latéral",
            image: "assets/images/configurateur/types/verre-a-profile/lateral.webp"
          },
          {
            id: 25,
            typeId: 25,
            value: "lateral-y",               // Fixation latérale en Y
            label: "Latéral Y",
            image: "assets/images/configurateur/types/verre-a-profile/lateral-y.webp"
          },

          // ------------------------------------------------------------------
          // PROFIL SPÉCIAL MURET
          // ------------------------------------------------------------------
          // Pour installation sur muret ou parapet existant

          {
            id: 26,
            typeId: 26,
            value: "profil-muret",
            label: "Profil Muret",
            image: "assets/images/configurateur/types/verre-a-profile/profil-muret.webp"
          },
        ]
      },

      // ======================================================================
      // CHAMP 2 : TYPE D'ANCRAGE
      // ======================================================================
      {
        id: "ancrage",
        label: "Ancrage",
        type: "choice",
        ui: "cards",
        required: true,

        // Options d'ancrage spécifiques aux profilés alu
        options: [
          {
            id: 4,
            ancrageId: 4,
            value: "beton-m10x100",   // Vis M10 x 100mm pour béton
            label: "Béton M10 x 100",
            image: "assets/images/configurateur/ancrages/beton-m10x100.webp"
          },
          {
            id: 5,
            ancrageId: 5,
            value: "vis-bois-10mm",   // Vis Ø10mm pour bois
            label: "Bois Ø10 mm",
            image: "assets/images/configurateur/ancrages/vis-bois-10mm.webp"
          },
          {
            id: 6,
            ancrageId: 6,
            value: "aucun",           // Sans ancrage (à préciser)
            label: "Aucun",
            image: "assets/images/configurateur/ancrages/aucun.webp"
          }
        ]
      }
    ],

    // Fonction d'aperçu pour cette étape
    // ({ selection }) = destructuration du paramètre
    // => = fonction fléchée (arrow function)
    preview: ({ selection }) => buildTypePreview(selection),
  },

  // ==========================================================================
  // ÉTAPE 2 : CHOIX DE LA FORME
  // ==========================================================================
  {
    id: "forme",
    label: "Forme",
    description: "Choisissez la forme souhaitée.",

    // Condition d'affichage de cette étape
    // !! = double négation (convertit en booléen)
    // Cette étape apparaît seulement si type ET ancrage sont sélectionnés
    showIf: ({ selection }) => !!selection.type && !!selection.ancrage,

    fields: [
      {
        id: "forme",
        label: "Forme",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de formes (identiques aux autres datasets)
        options: [
          {
            id: 1,
            formeId: 1,
            value: "droit",      // Garde-corps rectiligne
            label: "Droit",
            image: "assets/images/configurateur/formes/droit.webp"
          },
          {
            id: 2,
            formeId: 2,
            value: "en-v",       // Deux segments formant un angle
            label: "En V",
            image: "assets/images/configurateur/formes/v.webp"
          },
          {
            id: 3,
            formeId: 3,
            value: "en-l",       // Angle droit
            label: "En L",
            image: "assets/images/configurateur/formes/l.webp"
          },
          {
            id: 4,
            formeId: 4,
            value: "en-u",       // Trois côtés
            label: "En U",
            image: "assets/images/configurateur/formes/u.webp"
          },
          {
            id: 5,
            formeId: 5,
            value: "en-s",       // Quatre segments
            label: "En S",
            image: "assets/images/configurateur/formes/s.webp"
          },
          {
            id: 6,
            formeId: 6,
            value: "complexe",   // Forme sur mesure
            label: "Complexe",
            image: "assets/images/configurateur/formes/complexe.webp"
          }
        ],
      }
    ],

    // Aperçu dynamique basé sur le type et la forme
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // ÉTAPE 3 : TYPE DE VERRE (LA PLUS COMPLEXE !)
  // ==========================================================================
  {
    id: "typeDeVerre",
    label: "Type de Verre",
    description: "Choisissez le lieu, le type de projet et la hauteur de chute. Ensuite, sélectionnez l'une des options proposées.",

    // Cette étape apparaît seulement si la forme a été choisie
    showIf: ({ selection }) => !!selection.forme,

    // Cette étape contient 4 champs (triple sélection + options)
    fields: [
      // ======================================================================
      // CHAMP 1 : LIEU D'INSTALLATION
      // ======================================================================
      {
        id: "lieuInstallation",
        label: "Lieu d'installation",
        type: "choice",

        // ui: "select" = liste déroulante (dropdown)
        // Plus adapté pour des choix textuels longs
        ui: "select",

        required: true,

        // Texte affiché quand rien n'est sélectionné
        placeholder: "Sélectionnez un lieu…",

        // Options de lieu
        // Déterminent les contraintes de sécurité
        options: [
          {
            value: "1",  // Valeur envoyée (numérique en string)
            label: "Intérieur / Extérieur à l'abri de la pluie"  // Texte long
          },
          {
            value: "2", 
            label: "Extérieur" 
          },
          {
            value: "3", 
            label: "Extérieur (Expositions aux vents forts)" 
          },
        ],
      },

      // ======================================================================
      // CHAMP 2 : TYPE DE PROJET
      // ======================================================================
      {
        id: "typeProjet",
        label: "Type de projet",
        type: "choice",
        ui: "select",
        required: true,
        placeholder: "Sélectionnez un type…",

        // Options de projet
        // Déterminent les normes de sécurité applicables
        options: [
          {
            value: "1",
            label: "Habitation privée - Résidentiel"  // Normes résidentielles
          },
          {
            value: "2",
            label: "Public (Etablissement Recevant du Public)"  // Normes ERP plus strictes
          },
        ],
      },

      // ======================================================================
      // CHAMP 3 : HAUTEUR DE CHUTE
      // ======================================================================
      {
        id: "hauteurChute",
        label: "Hauteur de chute potentielle",
        type: "choice",
        ui: "select",
        required: true,
        placeholder: "Sélectionnez une hauteur…",

        // Options de hauteur
        // Déterminent l'épaisseur de verre nécessaire
        options: [
          {
            value: "1",
            label: "Sans danger de chute (plain-pied, hauteur < 1 m)"
          },
          {
            value: "2",
            label: "Chute limitée (1 à 6 m de hauteur)"
          },
          {
            value: "3",
            label: "Chute importante (> 6 m de hauteur)"
          },
        ],
      },

      // ======================================================================
      // CHAMP 4 : OPTIONS DE VERRE RECOMMANDÉES
      // ======================================================================
      {
        id: "typeDeVerre",
        label: "Optez pour le verre recommandé conforme aux normes",
        type: "choice",

        // ui: "cards" = cartes avec images
        // Plus visuel pour le choix final
        ui: "cards",

        required: true,

        // --------------------------------------------------------------------
        // CONDITION D'AFFICHAGE DYNAMIQUE
        // --------------------------------------------------------------------
        // Ce champ n'apparaît que si les 3 sélections précédentes sont faites
        // comboKey() retourne null si une valeur manque
        showIf: ({ selection }) => !!comboKey(selection),

        // --------------------------------------------------------------------
        // OPTIONS DYNAMIQUES BASÉES SUR LES 3 SÉLECTIONS
        // --------------------------------------------------------------------
        // Cette fonction est appelée à chaque fois que l'utilisateur
        // change une des 3 sélections précédentes
        options: ({ selection }) => {
          // Construire la clé de la matrice (ex: "1-1-2")
          const key = comboKey(selection);

          // Récupérer la liste des verres recommandés depuis VERRE_COMBOS
          // Si la clé n'existe pas ou si key est null, tableau vide
          // && = ET logique avec court-circuit (si key est null, ne pas évaluer la suite)
          const items = key && VERRE_COMBOS[key] ? VERRE_COMBOS[key] : [];
          // ? : = opérateur ternaire

          // Convertir les items en options UI avec makeGlassOptions()
          // Chaque option aura { value, label, image, meta: {verreId} }
          return makeGlassOptions(items);
        },
      },
    ],

    // Aperçu (même si le type de verre ne change pas l'aperçu visuel)
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // ÉTAPE 4 : MESURES
  // ==========================================================================
  {
    id: "mesures",
    label: "Mesures",
    description: "Indiquez les mesures souhaitées",

    // Cette étape apparaît seulement si le type de verre a été choisi
    showIf: ({ selection }) => !!selection.typeDeVerre,

    // Liste des champs de mesures
    fields: [
      // ======================================================================
      // CHAMP 1 : LONGUEUR A (PREMIER SEGMENT)
      // ======================================================================
      {
        id: "longueur_a",
        label: "Longueur A (cm)",

        // type: "number" = champ numérique avec flèches +/-
        type: "number",

        // Unité affichée à côté du champ
        unit: "cm",

        // Texte indicatif dans le champ vide
        placeholder: "Ex: 350",

        required: true,

        // Ce champ apparaît pour toutes les formes sauf "complexe"
        // Les formes complexes nécessitent un devis personnalisé
        showIf: ({ selection }) => selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 2 : LONGUEUR B (DEUXIÈME SEGMENT)
      // ======================================================================
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,

        // Ce champ apparaît seulement pour les formes non-droites
        // Une forme droite n'a qu'un seul segment
        showIf: ({ selection }) => 
          (selection.forme !== "droit") &&   // Pas droit
          selection.forme !== "complexe"     // Pas complexe
      },

      // ======================================================================
      // CHAMP 3 : LONGUEUR C (TROISIÈME SEGMENT)
      // ======================================================================
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,

        // Ce champ apparaît seulement pour les formes en-s et en-u
        // Ces formes ont 3 ou 4 segments
        showIf: ({ selection }) =>
          (selection.forme === "en-s" || selection.forme === "en-u") &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 4 : HAUTEUR
      // ======================================================================
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true

        // Pas de showIf = toujours visible
        // La hauteur est nécessaire pour toutes les configurations
      },

      // ======================================================================
      // CHAMP 5 : ANGLE
      // ======================================================================
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",

        // Unité en degrés
        unit: "°",

        placeholder: "Ex: 30",
        required: true,

        // L'angle n'est demandé que pour la forme en V
        // Pour un V, on a besoin de connaître l'angle entre les 2 segments
        showIf: ({ selection }) =>
          selection.forme === "en-v" &&
          selection.forme !== "complexe"
      },
    ],

    // Aperçu final avec toutes les informations
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// ============================================================================
// PARTIE 6 : FONCTIONS D'APERÇU (PREVIEW)
// ============================================================================

/**
 * buildPreviewPath() = construire le chemin de l'image d'aperçu principal
 *
 * Cette fonction gère les cas spéciaux où certains types ont des aperçus
 * fixes plutôt que des aperçus par forme.
 *
 * @param {Object} selection - Les choix de l'utilisateur
 * @returns {string|null} - Le chemin de l'image ou null
 */
function buildPreviewPath(selection) {
  // Si le type n'est pas encore sélectionné, pas d'aperçu
  if (!selection.type) return null;

  // Extraire les valeurs
  const type  = selection.type;
  const forme = selection.forme || "droit";  // Valeur par défaut

  // --------------------------------------------------------------------
  // CAS SPÉCIAUX : TYPES AVEC APERÇU FIXE
  // --------------------------------------------------------------------
  // Certains types ont un seul aperçu quelle que soit la forme

  if (selection.type === "autoreglable-sol-en-f") {
    // Le profil en F a toujours le même aperçu
    return `assets/images/configurateur/previews/verre-a-profile/autoreglable-sol-en-f/autoreglable-sol-en-f-decoupe.webp`;

  } else if (selection.type === "autoreglable-lateral-y") {
    // Le profil en Y a toujours le même aperçu
    return `assets/images/configurateur/previews/verre-a-profile/autoreglable-lateral-y/autoreglable-lateral-y-decoupe.webp`;

  } else if (selection.type === "profil-muret") {
    // Le profil muret a toujours le même aperçu
    return `assets/images/configurateur/previews/verre-a-profile/profil-muret/profil-muret-decoupe.webp`;

  } else {
    // --------------------------------------------------------------------
    // CAS GÉNÉRAL : APERÇU SELON TYPE ET FORME
    // --------------------------------------------------------------------
    // La plupart des types ont des aperçus différents selon la forme
    // Pattern : previews/verre-a-profile/{type}/{type}-{forme}.webp
    return `assets/images/configurateur/previews/verre-a-profile/${type}/${type}-${forme}.webp`;
  }
}

/**
 * buildTypePreview() = construire l'aperçu pour l'étape "type"
 *
 * À l'étape 1, on montre juste le profil sans la forme.
 *
 * @param {Object} selection - Les choix de l'utilisateur
 * @returns {string|null} - Le chemin de l'image ou null
 */
function buildTypePreview(selection) {
  // Si le type n'est pas encore sélectionné, pas d'aperçu
  if (!selection.type) return null;

  // Extraire le type
  const type = selection.type;

  // Pattern : previews/verre-a-profile/{type}/{type}-decoupe.webp
  // "decoupe" = image du profil seul (coupe transversale)
  return `assets/images/configurateur/previews/verre-a-profile/${type}/${type}-decoupe.webp`;
}
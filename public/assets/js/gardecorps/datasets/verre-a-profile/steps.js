// assets/js/datasets/verre-a-profile/steps.js
// ============================================================================
// Jeu d'étapes (steps) pour le configurateur "Verre à profilé".
// Objectif : proposer des choix structurés (type → forme → type de verre → mesures)
// avec previews dynamiques et contraintes métier (combinaisons de verre selon contexte).
// ============================================================================


/**
 * Table de correspondance "contexte → codes de verres recommandés".
 * La clé est de la forme "lieu-projet-hauteur" :
 *   - lieuInstallation : "1" (intérieur/extérieur abrité), "2" (extérieur), "3" (extérieur vents forts)
 *   - typeProjet      : "1" (résidentiel), "2" (ERP/public)
 *   - hauteurChute    : "1" (< 1 m), "2" (1 à 6 m), "3" (> 6 m)
 *
 * Exemple : "1-1-2" => lieu=1, projet=1, hauteur=2 → liste de codes verres autorisés
 * Les valeurs sont des tableaux de codes (chaînes) qui seront transformés en options (cards).
 */
const VERRE_COMBOS = {
  "1-1-1": [
    "88-4-eva-opale",
    "88-4-pvb",
    "88-4-pvb-extra-clair",
  ],
  "1-1-2": [
    "88-4-eva-opale",
    "88-4-pvb",
    "88-4-pvb-extra-clair",
    "1010-4-eva-opale",
  ],
  "1-1-3": [
    "1010-4-eva-opale",
    "1010-4-pvb",
    "1010-4-pvb-extra-clair",
  ],
  "1-2-1": [
    "88-4-pvb-hst",
    "88-4-pvb-hst-extra-clair",
  ],
  "1-2-2": [
    "88-4-pvb-hst",
    "88-4-pvb-hst-extra-clair",
  ],
  "1-2-3": [
    "1010-4-pvb-hst",
    "1010-4-pvb-hst-extra-clair",
  ],
  "2-1-1": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
  ],
  "2-1-2": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
    "1010-4-eva-opale",
  ],
  "2-1-3": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
    "1010-4-eva-opale",
  ],
  "2-2-1": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],
  "2-2-2": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],
  "2-2-3": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],
  "3-1-1": [
    "88-4-eva",
    "88-4-eva-extra-clair",
    "88-4-eva-opale",
  ],
  "3-1-2": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
  ],
  "3-1-3": [
    "1010-4-eva",
    "1010-4-eva-extra-clair",
    "1010-4-eva-opale",
  ],
  "3-2-1": [
    "88-4-eva-hst",
    "88-4-eva-hst-extra-clair",
  ],
  "3-2-2": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],
  "3-2-3": [
    "1010-4-eva-hst",
    "1010-4-eva-hst-extra-clair",
  ],
};


// --- Helpers ----------------------------------------------------------------
// Ces fonctions utilitaires rendent le code des steps plus lisible et réutilisable.

/**
 * Construit la clé "lieu-projet-hauteur" à partir de la sélection courante.
 * @param {Object} selection - état global (clé/valeur par field.id)
 * @returns {string|null} la clé "a-b-c" si 3 valeurs présentes, sinon null
 */
function comboKey(selection) {
  const a = selection.lieuInstallation; // "1" | "2" | "3"
  const b = selection.typeProjet;       // "1" | "2"
  const c = selection.hauteurChute;     // "1" | "2" | "3"
  if (!a || !b || !c) return null;      // si un des 3 manque, on ne renvoie rien
  return `${a}-${b}-${c}`;              // ex: "2-1-3"
}

/**
 * Transforme un code de verre "technique" en label lisible.
 * - Remplace les tirets par des espaces
 * - Met en majuscules les abréviations EVA/PVB/HST
 * - Met une casse agréable pour "opale", "extra clair", "clair"
 * @param {string} code
 * @returns {string} label lisible (ex: "1010 4 EVA Opale")
 */
function labelFromCode(code) {
  return code
    .replace(/-/g, " ")
    .replace(/\b(eva|pvb|hst)\b/gi, s => s.toUpperCase())
    .replace(/\bopale\b/gi, "Opale")
    .replace(/\bextra clair\b/gi, "Extra clair")
    .replace(/\bclair\b/gi, "Clair");
}

/**
 * Convertit une liste de codes (["88-4-eva-opale", ...]) en options
 * prêtes à être rendues par le moteur (cards).
 * Chaque option peut embarquer une image spécifique.
 * @param {string[]} codes
 * @returns {Array<{value:string,label:string,image:string}>}
 */
function makeGlassOptions(codes = []) {
  return codes.map(code => ({
    value: code,                                  // valeur remontée dans selection.verreOption
    label: labelFromCode(code),                   // label lisible pour l’UI
    image: `${imgPath}verres/${code}.jpg`,    // image associée au code
  }));
}


// ============================================================================
// Export principal : tableau d’étapes pour le dataset "verre-a-profile"
// ============================================================================

const imgPath = "/public/assets/images/gardecorps/";

export default [
  // --------------------------------------------------------------------------
  // ÉTAPE 1 — TYPE
  // --------------------------------------------------------------------------
  {
    id: "type",                                   // identifiant unique de l’étape
    label: "Type",                                // titre affiché dans l’UI
    description: "Choisissez le type de projet et l'ancrage souhaité.",
    // Image par défaut pour le preview de cette étape (si step.preview ne retourne rien)
    defaultPreview: imgPath + "previews/verre-a-profile/autoreglable-sol/autoreglable-sol-decoupe.png", // 🆕 image de base

    // Champs de l’étape "type"
    fields: [{
      id: "type",                                 // identifiant du champ (clé dans selection)
      label: "Type",                              // étiquette affichée
      type: "choice",                             // type "choice" pour proposer un ensemble d'options
      ui: "cards",                                // rendu sous forme de cartes cliquables
      required: true,                             // ce choix est obligé pour continuer
      options: [
        // Chaque option : value (slug), label (texte), image (vignette)
        { value: "autoreglable-sol",       label: "Autoréglable Sol",       image: imgPath + "types/verre-a-profile/autoreglable-sol.jpg" },
        { value: "autoreglable-lateral",   label: "Autoréglable Latéral",   image: imgPath + "types/verre-a-profile/autoreglable-lateral.jpg" },
        { value: "autoreglable-sol-en-f",  label: "Autoréglable Sol en F",  image: imgPath + "types/verre-a-profile/autoreglable-sol-en-f.jpg" },
        { value: "autoreglable-lateral-y", label: "Autoréglable Latéral Y", image: imgPath + "types/verre-a-profile/autoreglable-lateral-y.jpg" },
        { value: "sol-en-f",               label: "Sol en F",               image: imgPath + "types/verre-a-profile/sol-en-f.jpg" },
        { value: "sol-en-u",               label: "Sol en U",               image: imgPath + "types/verre-a-profile/sol-en-u.jpg" },
        { value: "lateral",                label: "Latéral",                image: imgPath + "types/verre-a-profile/lateral.jpg" },
        { value: "lateral-y",              label: "Latéral Y",              image: imgPath + "types/verre-a-profile/lateral-y.jpg" },
        { value: "profil-muret",           label: "Profil Muret",           image: imgPath + "types/verre-a-profile/profil-muret.jpg" },
      ]
    },
    {
      // Deuxième champ à la même étape : choix de l’ancrage
      id: "ancrage",
      label: "Ancrage",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "beton-m10x100", label: "Béton M10 x 100", image: imgPath + "ancrages/beton-m10x100.jpg" },
        { value: "vis-bois-10mm", label: "Bois Ø10 mm",     image: imgPath + "ancrages/vis-bois-10mm.jpg" },
        { value: "aucuns",        label: "Aucun",           image: imgPath + "ancrages/aucun.jpg" }
      ]
    }],
    // Preview spécifique pour cette étape (écrase defaultPreview si non nul)
    preview: ({ selection }) => buildTypePreview(selection),
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 2 — FORME
  // --------------------------------------------------------------------------
  {
    id: "forme",
    label: "Forme",
    description: "Choisissez la forme souhaitée.",
    // Cette étape ne devient visible que si "type" ET "ancrage" ont été choisis
    showIf: ({ selection }) => !!selection.type && !!selection.ancrage,

    // Un seul champ "forme" (cards)
    fields: [{
      id: "forme",
      label: "Forme",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "droit",     label: "Droit",     image: imgPath + "formes/droit.png" },
        { value: "en-v",      label: "En V",      image: imgPath + "formes/v.png" },
        { value: "en-l",      label: "En L",      image: imgPath + "formes/l.png" },
        { value: "en-u",      label: "En U",      image: imgPath + "formes/u.png" },
        { value: "en-s",      label: "En S",      image: imgPath + "formes/s.png" },
        { value: "complexe",  label: "Complexe",  image: imgPath + "formes/complexe.png" }
      ],
    }],
    // Preview : on laisse la même logique que pour les autres étapes (hors "type")
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 3 — TYPE DE VERRE (triple select → options recommandées)
  // --------------------------------------------------------------------------
  {
    id: "typeDeVerre",
    label: "Type de Verre",
    description: "Choisissez le lieu, le type de projet et la hauteur de chute. Ensuite, sélectionnez l’une des options proposées.",
    // Ne s’affiche que si la forme est définie
    showIf: ({ selection }) => !!selection.forme,

    // 4 champs :
    //   1) lieuInstallation (select)
    //   2) typeProjet      (select)
    //   3) hauteurChute    (select)
    //   4) verreOption     (cards) → apparaît seulement quand les 3 premiers sont choisis
    fields: [
      // 1) Lieu d’installation
      {
        id: "lieuInstallation",
        label: "Lieu d'installation",
        type: "choice",
        ui: "select",           // rendu <select>
        required: true,
        placeholder: "Sélectionnez un lieu…",
        options: [
          { value: "1", label: "Intérieur / Extérieur à l'abri de la pluie" },
          { value: "2", label: "Extérieur" },
          { value: "3", label: "Extérieur (Expositions aux vents forts)" },
        ],
      },

      // 2) Type de projet
      {
        id: "typeProjet",
        label: "Type de projet",
        type: "choice",
        ui: "select",
        required: true,
        placeholder: "Sélectionnez un type…",
        options: [
          { value: "1", label: "Habitation privée - Résidentiel" },
          { value: "2", label: "Public (Etablissement Recevant du Public)" },
        ],
      },

      // 3) Hauteur de chute potentielle
      {
        id: "hauteurChute",
        label: "Hauteur de chute potentielle",
        type: "choice",
        ui: "select",
        required: true,
        placeholder: "Sélectionnez une hauteur…",
        options: [
          { value: "1", label: "Sans danger de chute (plain-pied, hauteur < 1 m)" },
          { value: "2", label: "Chute limitée (1 à 6 m de hauteur)" },
          { value: "3", label: "Chute importante (> 6 m de hauteur)" },
        ],
      },

      // 4) Options proposées (cards) — s’affiche seulement quand 3 selects sont choisis
      {
        id: "verreOption",
        label: "Optez pour le verre recommandé conforme aux normes",
        type: "choice",
        ui: "cards",                                 // rendu sous forme de cartes (avec images)
        required: true,
        showIf: ({ selection }) => !!comboKey(selection), // visible seulement si comboKey() existe
        options: ({ selection }) => {
          // Construit la clé (ex: "2-1-3") selon la sélection des 3 selects
          const key = comboKey(selection);
          // Récupère la liste de codes depuis la table VERRE_COMBOS (ou tableau vide sinon)
          const codes = key && VERRE_COMBOS[key] ? VERRE_COMBOS[key] : [];
          // Convertit les codes en options cartes (value/label/image)
          return makeGlassOptions(codes);
        },
      },
    ],
    // Le preview conserve la logique générique (forme + type)
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 4 — MESURES
  // --------------------------------------------------------------------------
  {
    id: "mesures",
    label: "Mesures",
    description: "Indiquez les mesures souhaitées",
    // N’apparait que si une option de verre a été sélectionnée (garantie d’un choix normé)
    showIf: ({ selection }) => !!selection.verreOption,

    // Champs numériques dynamiques (required si présents selon la forme)
    fields: [
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 350",
        required: true,
        showIf: ({ selection }) => selection.forme !== "complexe"      // A obligatoire sauf si "complexe"
      },
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,
        showIf: ({ selection }) => (selection.forme !== "droit") && selection.forme !== "complexe" // B requis si pas "droit" ni "complexe"
      },
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,
        showIf: ({ selection }) => (selection.forme === "en-s" || selection.forme === "en-u") && selection.forme !== "complexe" // C seulement pour "en-s" et "en-u"
      },
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true    // Hauteur toujours requise
      },
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",
        placeholder: "Ex: 30",
        required: true,
        showIf: ({ selection }) => selection.forme === "en-v" && selection.forme !== "complexe" // Angle requis uniquement si "en-v"
      },
    ],
    // Le preview reste cohérent avec les choix (type + forme)
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];


// ============================================================================
// Helpers d’aperçu (preview) — utilisés dans plusieurs étapes
// ============================================================================

/**
 * Construit le chemin de l’image de preview en fonction du type et de la forme.
 * Règles spécifiques :
 * - Certains types imposent toujours l’image "*-decoupe.png" (ex: "autoreglable-lateral-y")
 * - Sinon, on affiche l’image "{type}-{forme}.png" (forme par défaut "droit" si absente)
 *
 * @param {Object} selection
 * @returns {string|null} URL relative de l’image à afficher, ou null si pas de type
 */
function buildPreviewPath(selection) {
  if (!selection.type) return null;              // sans type, pas d’aperçu
  const type  = selection.type;                  // ex: "sol-en-u"
  const forme = selection.forme || "droit";      // par défaut, "droit" si non défini

  // Cas particuliers où on force l’image "decoupe" (schéma explicatif)
  if (selection.type === "autoreglable-sol-en-f") {
    return `${imgPath}previews/verre-a-profile/autoreglable-sol-en-f/autoreglable-sol-en-f-decoupe.png`;
  } else if (selection.type === "autoreglable-lateral-y") {
    return `${imgPath}previews/verre-a-profile/autoreglable-lateral-y/autoreglable-lateral-y-decoupe.png`;
  } else if (selection.type === "profil-muret" ) {
    return `${imgPath}previews/verre-a-profile/profil-muret/profil-muret-decoupe.png`;
  } else {
    // Cas standard : on compose avec {type}-{forme}.png
    return `${imgPath}previews/verre-a-profile/${type}/${type}-${forme}.png`;
  }
}

/**
 * Preview dédié à l’étape "type" :
 * - On montre systématiquement l’image "*-decoupe.png" pour aider le choix du système.
 * @param {Object} selection
 * @returns {string|null}
 */
function buildTypePreview(selection) {
  // ⇢ utilisé UNIQUEMENT par l'étape "type"
  if (!selection.type) return null;              // pas de type => pas d’aperçu
  const type = selection.type;                   // ex: "lateral-y"
  // Toujours l’image “découpe” pour le choix de type
  return `${imgPath}previews/verre-a-profile/${type}/${type}-decoupe.png`;
}

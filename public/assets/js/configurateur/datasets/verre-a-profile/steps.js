// assets/js/datasets/verre-a-profile/steps.js
// ============================================================================
// Jeu d'étapes (steps) pour le configurateur "Verre à profilé".
// Objectif : proposer des choix structurés (type → forme → type de verre → mesures)
// avec previews dynamiques et contraintes métier (combinaisons de verre selon contexte).
// Ajout demandé : exposer un "verreId" pour chaque type de verre afin de le stocker en BDD.
// ============================================================================


/**
 * ========================================================================== *
 * 1) CATALOGUE CENTRAL — code technique → ID numérique (BDD)
 * --------------------------------------------------------------------------
 * - Ce mapping est la "source de vérité" pour les IDs.
 * - REMPLACE les valeurs 1001, 1002, ... par tes vrais IDs (ex: gc_verres.id_verre).
 * - Avantage : tu n'as à maintenir les IDs qu'ici, pas partout dans les combos.
 * ========================================================================== *
 */
const GLASS_CATALOG = {
    "88-4-eva-hst":                1,
    "88-4-eva-hst-extra-clair":    2,
    "88-4-eva-extra-clair":        3,
    "88-4-eva-opale":              7,
    "88-4-eva":                    8,
    "88-4-pvb-extra-clair":        10,
    "88-4-pvb-hst-extra-clair":    11,
    "88-4-pvb-hst":                12,
    "88-4-pvb":                    13,
    "1010-4-eva-extra-clair":      14,
    "1010-4-eva-hst-extra-clair":  15,
    "1010-4-eva-hst":              16,
    "1010-4-eva-opale":            17,
    "1010-4-eva":                  18,
    "1010-4-pvb-extra-clair":      19,
    "1010-4-pvb-hst-extra-clair":  20,
    "1010-4-pvb-hst":              21,
    "1010-4-pvb":                  22,
};


/**
 * ========================================================================== *
 * 2) COMBOS "BRUTS" — inchangés : uniquement les codes strings
 * --------------------------------------------------------------------------
 * - On garde la simplicité d'édition ici (que des codes).
 * - Ensuite, on "enrichit" automatiquement avec les IDs via GLASS_CATALOG.
 * ========================================================================== *
 */
const RAW_VERRE_COMBOS = {
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


/**
 * ========================================================================== *
 * 3) COMBOS "ENRICHIS" — même structure de clés, mais chaque entrée est {code, verreId}
 * --------------------------------------------------------------------------
 * - On enrichit automatiquement chaque code via GLASS_CATALOG.
 * - Si un code n'existe pas dans le catalogue, verreId = null (pense à le compléter).
 * ========================================================================== *
 */
const VERRE_COMBOS = Object.fromEntries(
  Object.entries(RAW_VERRE_COMBOS).map(([key, codes]) => {
    const enriched = codes.map(code => ({ code, verreId: GLASS_CATALOG[code] ?? null }));
    return [key, enriched];
  })
);


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
  if (!a || !b || !c) return null;
  return `${a}-${b}-${c}`;              // ex: "2-1-3"
}

/**
 * Transforme un code de verre "technique" en label lisible.
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
 * Normalise un item pouvant être soit une string (code),
 * soit un objet { code, verreId } (après enrichissement).
 * @param {string|{code:string,verreId:number|null}} item
 * @returns {{code:string, verreId:number|null}}
 */
function normalizeGlassItem(item) {
  if (typeof item === "string") {
    return { code: item, verreId: GLASS_CATALOG[item] ?? null };
  }
  return {
    code: item?.code ?? "",
    verreId: item?.verreId ?? (item?.code ? (GLASS_CATALOG[item.code] ?? null) : null)
  };
}

/**
 * Convertit une liste d'items (codes ou {code, verreId}) en options UI (cards).
 * On ajoute meta.verreId pour permettre au moteur / au backend de le récupérer facilement.
 * @param {Array<string|{code:string,verreId:number|null}>} items
 * @returns {Array<{value:string,label:string,image:string,meta:{verreId:number|null}}>}
 */
function makeGlassOptions(items = []) {
  return items.map((item) => {
    const { code, verreId } = normalizeGlassItem(item);
    return {
      id: verreId,                                        // 👈 IMPORTANT: expose l'ID numérique
      value: code,                                        // code technique (ex: "1010-4-eva")
      label: labelFromCode(code),                         // label propre pour l'UI
      image: `assets/images/configurateur/verres/${code}.jpg`,
      meta: { verreId }                                   // 👈 ID BDD directement disponible
    };
  });
}

/**
 * Utilitaire pour récupérer l'ID du verre sélectionné à partir de selection.verreOption.
 * À appeler lors de l'export final (ex: dans "configurator:done").
 * @param {Object} selection
 * @returns {number|null}
 */
export function getSelectedVerreId(selection) {
  // const code = selection?.verreOption;
  const code = selection?.typeDeVerre ?? selection?.verreOption; // fallback si ancien state
  if (!code) return null;
  return GLASS_CATALOG[code] ?? null;
}


// ============================================================================
// Export principal : tableau d’étapes pour le dataset "verre-a-profile"
// ============================================================================

export default [
  // --------------------------------------------------------------------------
  // ÉTAPE 1 — TYPE
  // --------------------------------------------------------------------------
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et l'ancrage souhaité.",
    defaultPreview: "assets/images/configurateur/previews/verre-a-profile/autoreglable-sol/autoreglable-sol-decoupe.png",
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 18, typeId: 18, value: "autoreglable-sol",       label: "Autoréglable Sol",       image: "assets/images/configurateur/types/verre-a-profile/autoreglable-sol.jpg" },
        { id: 19, typeId: 19, value: "autoreglable-lateral",   label: "Autoréglable Latéral",   image: "assets/images/configurateur/types/verre-a-profile/autoreglable-lateral.jpg" },
        { id: 20, typeId: 20, value: "autoreglable-sol-en-f",  label: "Autoréglable Sol en F",  image: "assets/images/configurateur/types/verre-a-profile/autoreglable-sol-en-f.jpg" },
        { id: 21, typeId: 21, value: "autoreglable-lateral-y", label: "Autoréglable Latéral Y", image: "assets/images/configurateur/types/verre-a-profile/autoreglable-lateral-y.jpg" },
        { id: 22, typeId: 22, value: "sol-en-f",               label: "Sol en F",               image: "assets/images/configurateur/types/verre-a-profile/sol-en-f.jpg" },
        { id: 23, typeId: 23, value: "sol-en-u",               label: "Sol en U",               image: "assets/images/configurateur/types/verre-a-profile/sol-en-u.jpg" },
        { id: 24, typeId: 24, value: "lateral",                label: "Latéral",                image: "assets/images/configurateur/types/verre-a-profile/lateral.jpg" },
        { id: 25, typeId: 25, value: "lateral-y",              label: "Latéral Y",              image: "assets/images/configurateur/types/verre-a-profile/lateral-y.jpg" },
        { id: 26, typeId: 26, value: "profil-muret",           label: "Profil Muret",           image: "assets/images/configurateur/types/verre-a-profile/profil-muret.jpg" },
      ]
    },
    {
      id: "ancrage",
      label: "Ancrage",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 4, ancrageId: 4, value: "beton-m10x100", label: "Béton M10 x 100", image: "assets/images/configurateur/ancrages/beton-m10x100.jpg" },
        { id: 5, ancrageId: 5, value: "vis-bois-10mm", label: "Bois Ø10 mm",     image: "assets/images/configurateur/ancrages/vis-bois-10mm.jpg" },
        { id: 6, ancrageId: 6, value: "aucun",         label: "Aucun",           image: "assets/images/configurateur/ancrages/aucun.jpg" }
      ]
    }],
    preview: ({ selection }) => buildTypePreview(selection),
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 2 — FORME
  // --------------------------------------------------------------------------
  {
    id: "forme",
    label: "Forme",
    description: "Choisissez la forme souhaitée.",
    showIf: ({ selection }) => !!selection.type && !!selection.ancrage,
    fields: [{
      id: "forme",
      label: "Forme",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 1, formeId: 1, value: "droit",    label: "Droit",    image: "assets/images/configurateur/formes/droit.png" },
        { id: 2, formeId: 2, value: "en-v",     label: "En V",     image: "assets/images/configurateur/formes/v.png" },
        { id: 3, formeId: 3, value: "en-l",     label: "En L",     image: "assets/images/configurateur/formes/l.png" },
        { id: 4, formeId: 4, value: "en-u",     label: "En U",     image: "assets/images/configurateur/formes/u.png" },
        { id: 5, formeId: 5, value: "en-s",     label: "En S",     image: "assets/images/configurateur/formes/s.png" },
        { id: 6, formeId: 6, value: "complexe", label: "Complexe", image: "assets/images/configurateur/formes/complexe.png" }
      ],
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 3 — TYPE DE VERRE (triple select → options recommandées)
  // --------------------------------------------------------------------------
  {
    id: "typeDeVerre",
    label: "Type de Verre",
    description: "Choisissez le lieu, le type de projet et la hauteur de chute. Ensuite, sélectionnez l’une des options proposées.",
    showIf: ({ selection }) => !!selection.forme,
    fields: [
      {
        id: "lieuInstallation",
        label: "Lieu d'installation",
        type: "choice",
        ui: "select",
        required: true,
        placeholder: "Sélectionnez un lieu…",
        options: [
          { value: "1", label: "Intérieur / Extérieur à l'abri de la pluie" },
          { value: "2", label: "Extérieur" },
          { value: "3", label: "Extérieur (Expositions aux vents forts)" },
        ],
      },
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
        id: "typeDeVerre",
        label: "Optez pour le verre recommandé conforme aux normes",
        type: "choice",
        ui: "cards",
        required: true,
        showIf: ({ selection }) => !!comboKey(selection),
        options: ({ selection }) => {
          const key = comboKey(selection);
          // Liste enrichie: [{ code, verreId }, ...] ou [] si non trouvé
          const items = key && VERRE_COMBOS[key] ? VERRE_COMBOS[key] : [];
          // On convertit en options UI ; chaque option inclut meta.verreId
          return makeGlassOptions(items);
        },
      },
    ],
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // --------------------------------------------------------------------------
  // ÉTAPE 4 — MESURES
  // --------------------------------------------------------------------------
  {
    id: "mesures",
    label: "Mesures",
    description: "Indiquez les mesures souhaitées",
    showIf: ({ selection }) => !!selection.typeDeVerre,
    fields: [
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 350",
        required: true,
        showIf: ({ selection }) => selection.forme !== "complexe"
      },
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,
        showIf: ({ selection }) => (selection.forme !== "droit") && selection.forme !== "complexe"
      },
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,
        showIf: ({ selection }) => (selection.forme === "en-s" || selection.forme === "en-u") && selection.forme !== "complexe"
      },
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true
      },
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",
        placeholder: "Ex: 30",
        required: true,
        showIf: ({ selection }) => selection.forme === "en-v" && selection.forme !== "complexe"
      },
    ],
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];


// ============================================================================
// Helpers d’aperçu (preview) — utilisés dans plusieurs étapes
// ============================================================================

function buildPreviewPath(selection) {
  if (!selection.type) return null;
  const type  = selection.type;
  const forme = selection.forme || "droit";

  if (selection.type === "autoreglable-sol-en-f") {
    return `assets/images/configurateur/previews/verre-a-profile/autoreglable-sol-en-f/autoreglable-sol-en-f-decoupe.png`;
  } else if (selection.type === "autoreglable-lateral-y") {
    return `assets/images/configurateur/previews/verre-a-profile/autoreglable-lateral-y/autoreglable-lateral-y-decoupe.png`;
  } else if (selection.type === "profil-muret" ) {
    return `assets/images/configurateur/previews/verre-a-profile/profil-muret/profil-muret-decoupe.png`;
  } else {
    return `assets/images/configurateur/previews/verre-a-profile/${type}/${type}-${forme}.png`;
  }
}

function buildTypePreview(selection) {
  if (!selection.type) return null;
  const type = selection.type;
  return `assets/images/configurateur/previews/verre-a-profile/${type}/${type}-decoupe.png`;
}

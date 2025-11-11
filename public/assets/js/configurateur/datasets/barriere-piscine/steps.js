// assets/js/datasets/barriere-piscine/steps.js

export default [
  // --------------------------------------------------------------------------
  // ÉTAPE 1 — TYPE
  // --------------------------------------------------------------------------
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et l'ancrage souhaité.",
    defaultPreview: "assets/images/configurateur/previews/barriere-piscine/pince-ronde/barriere-piscine-pince-ronde-droit.webp", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 27, typeId: 27, value: "pince-ronde",      label: "Pince ronde",      image: "assets/images/configurateur/types/barriere-piscine/pince-ronde.webp" },
        { id: 28, typeId: 28, value: "pince-carree",      label: "Pince carrée",      image: "assets/images/configurateur/types/barriere-piscine/pince-carree.webp" },
      ]
    },
  {
      id: "ancrage",
      label: "Ancrage",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 1, ancrageId: 1, value: "goujon-a-frapper", label: "Goujon à frapper pour béton", image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp" },
        { id: 6, ancrageId: 6, value: "aucun",           label: "Aucun",                       image: "assets/images/configurateur/ancrages/aucun.webp" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
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
        { id: 1, formeId: 1, value: "droit", label: "Droit", image: "assets/images/configurateur/formes/droit.webp" },
        { id: 2, formeId: 2, value: "en-v",  label: "En V",  image: "assets/images/configurateur/formes/v.webp" },
        { id: 3, formeId: 3, value: "en-l",  label: "En L",  image: "assets/images/configurateur/formes/l.webp" },
        { id: 4, formeId: 4, value: "en-u",  label: "En U",  image: "assets/images/configurateur/formes/u.webp" },
        { id: 5, formeId: 5, value: "en-s",  label: "En S",  image: "assets/images/configurateur/formes/s.webp" },
        { id: 6, formeId: 6, value: "complexe", label: "Complexe", image: "assets/images/configurateur/formes/complexe.webp" }
      ],
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  // --------------------------------------------------------------------------
  // ÉTAPE 3 — TYPE DE VERRE
  // --------------------------------------------------------------------------
  {
    id: "typeDeVerre",
    label: "Type de Verre",
    description: "Choisissez le type de verre.",
    showIf: ({ selection }) => !!selection.forme,
    fields: [{
      id: "typeDeVerre",
      label: "Type de Verre",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 4, verreId: 4, value: "88-4-clair", label: "Clair 88-4 EVA",         image: "assets/images/configurateur/verres/88-4-clair.webp" },
        { id: 9, verreId: 9, value: "88-4-extra-clair", label: "Extra clair 88-4 EVA",        image: "assets/images/configurateur/verres/88-4-extra-clair.webp" },
        { id: 23, verreId: 23, value: "aucun",  label: "Aucun",  image: "assets/images/configurateur/verres/aucun.webp" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  // --------------------------------------------------------------------------
  // ÉTAPE 4 — MESURES
  // --------------------------------------------------------------------------
  {
    id: "mesures",
    label: "Mesures",
    showIf: ({ selection }) => !!selection.typeDeVerre,
    fields: [
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 350",
        required: true,
        showIf: ({ selection }) => selection.forme !== "complexe" },
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,
        showIf: ({ selection }) => (selection.forme !== "droit") && selection.forme !== "complexe"},
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,
        showIf: ({ selection }) => (selection.forme === "en-s" || selection.forme === "en-u") && selection.forme !== "complexe"},
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true,
        showIf: ({ selection }) => selection.type === "pince-ronde" || selection.type === "pince-carree" },
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",
        placeholder: "Ex: 30",
        required: true,
        showIf: ({ selection }) => selection.forme === "en-v" && selection.forme !== "complexe" },
    ],
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// Petit helper centralisé (réutilisable à Forme, Pose, Mesures)
function buildPreviewPath(selection) {
  if (!selection.type) return null;
  const type  = selection.type;
  // const finition  = selection.finition;
  const forme = selection.forme || "droit";
  // const pose  = selection.pose || "sol";
  // const ancrage  = selection.ancrage;
  return `assets/images/configurateur/previews/barriere-piscine/${type}/barriere-piscine-${type}-${forme}.webp`;
}
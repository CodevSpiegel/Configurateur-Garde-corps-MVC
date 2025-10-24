// assets/js/datasets/barriere-piscine/steps.js

const imgPath = "/public/assets/images/gardecorps/";

export default [
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et l'ancrage souhaité.",
    defaultPreview: imgPath + "previews/barriere-piscine/pince-ronde/barriere-piscine-pince-ronde-droit.jpg", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "pince-ronde",      label: "Pince ronde",      image: imgPath + "types/barriere-piscine/pince-ronde.jpg" },
        { value: "pince-carree",      label: "Pince carrée",      image: imgPath + "types/barriere-piscine/pince-carree.jpg" },
      ]
    },
  {
      id: "ancrage",
      label: "Ancrage",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "goujon-a-frapper", label: "Goujon à frapper pour béton", image: imgPath + "ancrages/goujon-a-frapper.png" },
        { value: "aucuns",           label: "Aucun",                       image: imgPath + "ancrages/aucun.jpg" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
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
        { value: "droit", label: "Droit", image: imgPath + "formes/droit.png" },
        { value: "en-v",  label: "En V",  image: imgPath + "formes/v.png" },
        { value: "en-l",  label: "En L",  image: imgPath + "formes/l.png" },
        { value: "en-u",  label: "En U",  image: imgPath + "formes/u.png" },
        { value: "en-s",  label: "En S",  image: imgPath + "formes/s.png" },
        { value: "complexe", label: "Complexe", image: imgPath + "formes/complexe.png" }
      ],
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
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
        { value: "88-4-clair", label: "Clair 88-4 EVA",         image: imgPath + "verres/88-4-clair.jpg" },
        { value: "88-4-extra-clair", label: "Extra clair 88-4 EVA",        image: imgPath + "verres/88-4-extra-clair.jpg" },
        { value: "aucun",  label: "Sans verre",  image: imgPath + "verres/aucun.jpg" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
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
  return `${imgPath}previews/barriere-piscine/${type}/barriere-piscine-${type}-${forme}.jpg`;
}
// assets/js/datasets/filet-inox/steps.js

const imgPath = "/public/assets/images/gardecorps/";

export default [
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et la finition souhaitée.",
    defaultPreview: imgPath + "previews/filet-inox/filet-inox/sol/filet-inox-droit-sol.png", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "filet-inox",           label: "Filet inox",           image: imgPath + "types/filet-inox/filet-inox.png" },
        { value: "filet-inox-et-cables", label: "Filet Inox et Cables", image: imgPath + "types/filet-inox/filet-inox-et-cables.png" },
        { value: "filet-inox-et-barres", label: "Filet Inox et Barres", image: imgPath + "types/filet-inox/filet-inox-et-barres.png" },
        { value: "filet-inox-muret",     label: "Filet Inox Muret",     image: imgPath + "types/filet-inox/filet-inox-muret.png" }
      ]
    },
    {
      id: "finition",
      label: "Finition",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "tube-inox-304l", label: "Inox 304 Brossé (Intérieur)",         image: imgPath + "finitions/tube-inox-304l.png" },
        { value: "tube-inox-316l", label: "Inox 316L Brossé (Extérieur)",        image: imgPath + "finitions/tube-inox-316l.png" },
        { value: "tube-inox-316",  label: "Inox 316 Poli Miroir (Mer/Piscine)",  image: imgPath + "finitions/tube-inox-316.png" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  {
    id: "forme",
    label: "Forme",
    description: "Choisissez la forme souhaitée.",
    showIf: ({ selection }) => !!selection.type && !!selection.finition,

    // 🟢 NE PAS effacer 'pose' quand on change la forme (pour garder le preview cohérent)
    preserveOnChange: ["pose"],

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
      // 🔔 Si la pose préservée n'est plus valide avec la nouvelle forme, on l'invalide
      onChange: ({ selection }) => {
        if (!selection.pose) return;
        if (!isPoseValidForForme(selection.pose, selection.forme)) {
          // Option 1 : on efface la pose (l’utilisateur devra la re-choisir à l’étape Pose)
          selection.pose = undefined;
          // Option 2 (si tu préfères garder l’aperçu fluide) : on laisse undefined,
          // mais le preview ci-dessous tombera sur 'sol' de toute façon.
        }
      }
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  {
    id: "pose",
    label: "Pose",
    description: "Choisissez la pose et l'ancrage souhaité",
    showIf: ({ selection }) => !!selection.forme,
    fields: [{
      id: "pose",
      label: "Pose",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "sol",     label: "Sol", image: imgPath + "poses/sol.png" },
        { value: "lateral", label: "Latérale", image: imgPath + "poses/lateral.png" }
      ],
    },
    {
      id: "ancrage",
      label: "Ancrage",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "goujon-a-frapper", label: "Goujon à frapper pour béton",         image: imgPath + "ancrages/goujon-a-frapper.png" },
        { value: "tirefonds-pour-bois", label: "Tirefonds pour bois",        image: imgPath + "ancrages/tirefonds-pour-bois.png" },
        { value: "scellement-chimique",  label: "Tiges Filetées pour scellement Chimique",  image: imgPath + "ancrages/scellement-chimique.png" }
      ]
    }],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  {
    id: "mesures",
    label: "Mesures",
    showIf: ({ selection }) => !!selection.pose && !!selection.ancrage,
    fields: [
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 350",
        required: true,
        showIf: ({ selection }) => (selection.pose === "sol" || selection.pose === "lateral") && selection.forme !== "complexe" },
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,
        showIf: ({ selection }) => ((selection.pose === "sol" || selection.pose === "lateral") && selection.forme !== "droit") && selection.forme !== "complexe"},
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,
        showIf: ({ selection }) => ((selection.pose === "sol" || selection.pose === "lateral") && (selection.forme === "en-s" || selection.forme === "en-u")) && selection.forme !== "complexe"},
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true,
        showIf: ({ selection }) => selection.pose === "sol" || selection.pose === "lateral" },
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
  const pose  = selection.pose || "sol";
  // const ancrage  = selection.ancrage;
  return `${imgPath}previews/filet-inox/${type}/${pose}/${type}-${forme}-${pose}.png`;
}


function isPoseValidForForme(pose, forme) {
  // Règle métier actuelle (ex.): "incline" uniquement valide pour "droit".
  if (pose === "incline") return forme === "droit";
  // "sol" et "lateral" valables pour toutes les formes ici
  return pose === "sol" || pose === "lateral";
}
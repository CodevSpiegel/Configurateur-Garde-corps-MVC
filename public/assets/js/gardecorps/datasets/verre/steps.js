// assets/js/datasets/barres/steps.js

const imgPath = "/public/assets/images/gardecorps/";

export default [
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet, le type de verre et la finition souhaitée.",
    defaultPreview: imgPath + "previews/verre/verre-et-mc/sol/verre-et-mc-droit-sol.png", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "verre-et-mc",         label: "Verre et Main-courante",         image: imgPath + "types/verre/verre-et-mc.png" },
        { value: "verre-et-2-barres",   label: "Verre et 2 barres",              image: imgPath + "types/verre/verre-et-2-barres.png" },
        { value: "verre-et-2-cables",   label: "Verre et 2 cables",              image: imgPath + "types/verre/verre-et-2-cables.png" },
        { value: "verre-sans-mc",       label: "Verre sans Main-Courante",       image: imgPath + "types/verre/verre-sans-mc.png" },
        { value: "verre-muret-sans-mc", label: "Verre Muret sans Main Courante", image: imgPath + "types/verre/verre-muret-sans-mc.png" },
        { value: "verre-sur-muret",     label: "Verre sur Muret",                image: imgPath + "types/verre/verre-sur-muret.png" }
      ]
    },
    {
      id: "typeDeVerre",
      label: "Type de Verre",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { value: "44-2-clair", label: "Feuilleté clair 44-2 (8,76mm)",         image: imgPath + "verres/44-2-clair.jpg" },
        { value: "55-2-clair", label: "Feuilleté clair 55-2 (10,76mm)",        image: imgPath + "verres/55-2-clair.jpg" },
        { value: "aucun",  label: "Aucun",  image: imgPath + "verres/aucun.jpg" }
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
    showIf: ({ selection }) => !!selection.type && !!selection.typeDeVerre && !!selection.finition,

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
      options: ({ selection }) => {
        const base = [
          { value: "sol",     label: "Sol" },
          { value: "lateral", label: "Latérale" }
        ];
        return base.map(opt => ({
          ...opt,
          image: `${imgPath}poses/${opt.value}.png`, // ← important
        }));
      }
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
        required: true },
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
  // const typeDeVerre  = selection.typeDeVerre;
  // const finition  = selection.finition;
  const forme = selection.forme || "droit";
  const pose  = selection.pose || "sol";
  // const ancrage  = selection.ancrage;
  return `${imgPath}previews/verre/${type}/${pose}/${type}-${forme}-${pose}.png`;
}


function isPoseValidForForme(pose, forme) {
  // Règle métier actuelle (ex.): "incline" uniquement valide pour "droit".
  if (pose === "incline") return forme === "droit";
  // "sol" et "lateral" valables pour toutes les formes ici
  return pose === "sol" || pose === "lateral";
}
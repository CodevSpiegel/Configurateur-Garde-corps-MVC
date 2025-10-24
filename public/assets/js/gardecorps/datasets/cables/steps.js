// assets/js/datasets/cables/steps.js

const imgPath = "/public/assets/images/gardecorps/";

export default [
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et la finition souhaitée.",
    defaultPreview: imgPath + "previews/cables/5-cables/sol/5-cables-droit-sol.png", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        // ⚠️ Les value DOIVENT matcher les dossiers/fichiers :
        { value: "5-cables",      label: "5 Câbles",      image: imgPath + "types/cables/5-cables.png" },
        { value: "7-cables",      label: "7 Câbles",      image: imgPath + "types/cables/7-cables.png" },
        { value: "8-cables",      label: "8 Câbles",      image: imgPath + "types/cables/8-cables.png" },
        { value: "11-cables",     label: "11 Câbles",     image: imgPath + "types/cables/11-cables.png" },
        { value: "2-cables-muret",label: "2 Câbles Muret",image: imgPath + "types/cables/2-cables-muret.png" },
        { value: "3-cables-muret",label: "3 Câbles Muret",image: imgPath + "types/cables/3-cables-muret.png" }
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
    }
  ],
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
      options: ({ selection }) => {
        const base = [
          { value: "sol",     label: "Sol" },
          { value: "lateral", label: "Latérale" }
        ];
        if (
          selection.forme === "droit" &&
          (selection.type === "5-cables" ||
          selection.type === "2-cables-muret" ||
          selection.type === "3-cables-muret")
        ) {
          base.push({ value: "incline", label: "Inclinée" });
        }
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
        showIf: ({ selection }) => (selection.pose === "incline" || selection.pose === "sol" || selection.pose === "lateral") && selection.forme !== "complexe" },
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
        showIf: ({ selection }) => selection.pose === "incline" || selection.pose === "sol" || selection.pose === "lateral" },
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",
        placeholder: "Ex: 30",
        required: true,
        showIf: ({ selection }) => (selection.pose === "incline" || selection.forme === "en-v") && selection.forme !== "complexe" },
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
  return `${imgPath}previews/cables/${type}/${pose}/${type}-${forme}-${pose}.png`;
}


function isPoseValidForForme(pose, forme) {
  // Règle métier actuelle (ex.): "incline" uniquement valide pour "droit".
  if (pose === "incline") return forme === "droit";
  // "sol" et "lateral" valables pour toutes les formes ici
  return pose === "sol" || pose === "lateral";
}
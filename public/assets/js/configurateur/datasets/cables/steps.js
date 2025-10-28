// assets/js/datasets/cables/steps.js


export default [
  // --------------------------------------------------------------------------
  // ÉTAPE 1 — TYPE
  // --------------------------------------------------------------------------
  {
    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et la finition souhaitée.",
    defaultPreview: "assets/images/configurateur/previews/cables/5-cables/sol/5-cables-droit-sol.png", // 🆕 image de base
    fields: [{
      id: "type",
      label: "Type",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        // ⚠️ Les value DOIVENT matcher les dossiers/fichiers :
        { id: 1, typeId: 1, value: "5-cables",      label: "5 Câbles",      image: "assets/images/configurateur/types/cables/5-cables.png" },
        { id: 2, typeId: 2, value: "7-cables",      label: "7 Câbles",      image: "assets/images/configurateur/types/cables/7-cables.png" },
        { id: 3, typeId: 3, value: "8-cables",      label: "8 Câbles",      image: "assets/images/configurateur/types/cables/8-cables.png" },
        { id: 4, typeId: 4, value: "11-cables",     label: "11 Câbles",     image: "assets/images/configurateur/types/cables/11-cables.png" },
        { id: 5, typeId: 5, value: "2-cables-muret",label: "2 Câbles Muret",image: "assets/images/configurateur/types/cables/2-cables-muret.png" },
        { id: 6, typeId: 6, value: "3-cables-muret",label: "3 Câbles Muret",image: "assets/images/configurateur/types/cables/3-cables-muret.png" }
      ]
    },
    {
      id: "finition",
      label: "Finition",
      type: "choice",
      ui: "cards",
      required: true,
      options: [
        { id: 1, finitionId: 1, value: "tube-inox-304l", label: "Inox 304 Brossé (Intérieur)",         image: "assets/images/configurateur/finitions/tube-inox-304l.png" },
        { id: 2, finitionId: 2, value: "tube-inox-316l", label: "Inox 316L Brossé (Extérieur)",        image: "assets/images/configurateur/finitions/tube-inox-316l.png" },
        { id: 3, finitionId: 3, value: "tube-inox-316",  label: "Inox 316 Poli Miroir (Mer/Piscine)",  image: "assets/images/configurateur/finitions/tube-inox-316.png" }
      ]
    }
  ],
    preview: ({ selection }) => buildPreviewPath(selection)
  },
  // --------------------------------------------------------------------------
  // ÉTAPE 2 — FORME
  // --------------------------------------------------------------------------
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
        { id: 1, formeId: 1, value: "droit", label: "Droit", image: "assets/images/configurateur/formes/droit.png" },
        { id: 2, formeId: 2, value: "en-v",  label: "En V",  image: "assets/images/configurateur/formes/v.png" },
        { id: 3, formeId: 3, value: "en-l",  label: "En L",  image: "assets/images/configurateur/formes/l.png" },
        { id: 4, formeId: 4, value: "en-u",  label: "En U",  image: "assets/images/configurateur/formes/u.png" },
        { id: 5, formeId: 5, value: "en-s",  label: "En S",  image: "assets/images/configurateur/formes/s.png" },
        { id: 6, formeId: 6, value: "complexe", label: "Complexe", image: "assets/images/configurateur/formes/complexe.png" }
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
  // --------------------------------------------------------------------------
  // ÉTAPE 3 — POSE
  // --------------------------------------------------------------------------
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
          { poseId: 1, value: "sol",     label: "Sol" },
          { poseId: 2, value: "lateral", label: "Latérale" }
        ];
        if (
          selection.forme === "droit" &&
          (selection.type === "5-cables" ||
          selection.type === "2-cables-muret" ||
          selection.type === "3-cables-muret")
        ) {
          base.push({ poseId: 3, value: "incline", label: "Inclinée" });
        }
        return base.map(opt => ({
          ...opt,
          id: opt.poseId,
          image: `assets/images/configurateur/poses/${opt.value}.png`, // ← important
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
        { id: 1, ancrageId: 1, value: "goujon-a-frapper", label: "Goujon à frapper pour béton",         image: "assets/images/configurateur/ancrages/goujon-a-frapper.png" },
        { id: 2, ancrageId: 2, value: "tirefonds-pour-bois", label: "Tirefonds pour bois",        image: "assets/images/configurateur/ancrages/tirefonds-pour-bois.png" },
        { id: 3, ancrageId: 3, value: "scellement-chimique",  label: "Tiges Filetées pour scellement Chimique",  image: "assets/images/configurateur/ancrages/scellement-chimique.png" }
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
  return `assets/images/configurateur/previews/cables/${type}/${pose}/${type}-${forme}-${pose}.png`;
}


function isPoseValidForForme(pose, forme) {
  // Règle métier actuelle (ex.): "incline" uniquement valide pour "droit".
  if (pose === "incline") return forme === "droit";
  // "sol" et "lateral" valables pour toutes les formes ici
  return pose === "sol" || pose === "lateral";
}
// ============================================================================
// 📋 CONFIGURATION DES ÉTAPES DU CONFIGURATEUR - BARRIÈRE PISCINE
// ============================================================================
// Ce fichier définit toutes les étapes du parcours de configuration
// pour les barrières de piscine (type 27 et 28)
// ============================================================================

export default [
  // ==========================================================================
  // 🎯 ÉTAPE 1 — SÉLECTION DU TYPE ET DE L'ANCRAGE
  // ==========================================================================
  {
    // Identifiant unique de l'étape (utilisé pour la navigation)
    id: "type",

    // Titre affiché en haut de l'étape
    label: "Type",

    // Texte d'aide pour guider l'utilisateur
    description: "Choisissez le type de projet et l'ancrage souhaité.",

    // Image affichée par défaut avant toute sélection (preview initiale)
    defaultPreview: "assets/images/configurateur/previews/barriere-piscine/pince-ronde/barriere-piscine-pince-ronde-droit.webp",

    // Liste des champs de formulaire de cette étape
    fields: [
      // --- Champ 1 : Type de barrière ---
      {
        // Identifiant du champ (clé dans l'objet selection)
        id: "type",

        // Label affiché au-dessus du champ
        label: "Type",

        // Type de champ : "choice" = choix multiple
        type: "choice",

        // Interface utilisateur : "cards" = cartes visuelles cliquables
        ui: "cards",

        // Ce champ est obligatoire pour passer à l'étape suivante
        required: true,

        // Liste des options disponibles (2 types de barrières)
        options: [
          {
            id: 27,                    // ID unique de l'option
            typeId: 27,                // ID du type dans la base de données
            value: "pince-ronde",      // Valeur technique (utilisée dans le code)
            label: "Pince ronde",      // Texte affiché à l'utilisateur
            image: "assets/images/configurateur/types/barriere-piscine/pince-ronde.webp" // Image de la carte
          },
          {
            id: 28,
            typeId: 28,
            value: "pince-carree",
            label: "Pince carrée",
            image: "assets/images/configurateur/types/barriere-piscine/pince-carree.webp"
          },
        ]
      },

      // --- Champ 2 : Type d'ancrage ---
      {
        // Identifiant du champ d'ancrage
        id: "ancrage",

        // Label du champ
        label: "Ancrage",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 2 options d'ancrage disponibles
        options: [
          {
            id: 1,                           // ID unique de l'option
            ancrageId: 1,                    // ID de l'ancrage en base de données
            value: "goujon-a-frapper",       // Valeur technique
            label: "Goujon à frapper pour béton", // Texte affiché
            image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp"
          },
          {
            id: 6,
            ancrageId: 6,
            value: "aucun",
            label: "Aucun",
            image: "assets/images/configurateur/ancrages/aucun.webp"
          }
        ]
      }
    ],

    // Fonction qui génère le chemin de l'image de prévisualisation
    // Elle reçoit l'objet { selection } contenant les choix de l'utilisateur
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // 📐 ÉTAPE 2 — SÉLECTION DE LA FORME
  // ==========================================================================
  {
    // Identifiant de l'étape forme
    id: "forme",

    // Titre de l'étape
    label: "Forme",

    // Description pour guider l'utilisateur
    description: "Choisissez la forme souhaitée.",

    // Condition d'affichage : cette étape ne s'affiche que si type ET ancrage sont sélectionnés
    // !! convertit une valeur en booléen (true si la valeur existe)
    showIf: ({ selection }) => !!selection.type && !!selection.ancrage,

    // Champs de cette étape
    fields: [
      {
        // Identifiant du champ forme
        id: "forme",

        // Label du champ
        label: "Forme",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 6 formes disponibles
        options: [
          {
            id: 1,              // ID unique
            formeId: 1,         // ID de la forme en BDD
            value: "droit",     // Valeur technique
            label: "Droit",     // Texte affiché
            image: "assets/images/configurateur/formes/droit.webp"
          },
          {
            id: 2,
            formeId: 2,
            value: "en-v",
            label: "En V",
            image: "assets/images/configurateur/formes/v.webp"
          },
          {
            id: 3,
            formeId: 3,
            value: "en-l",
            label: "En L",
            image: "assets/images/configurateur/formes/l.webp"
          },
          {
            id: 4,
            formeId: 4,
            value: "en-u",
            label: "En U",
            image: "assets/images/configurateur/formes/u.webp"
          },
          {
            id: 5,
            formeId: 5,
            value: "en-s",
            label: "En S",
            image: "assets/images/configurateur/formes/s.webp"
          },
          {
            id: 6,
            formeId: 6,
            value: "complexe",
            label: "Complexe",
            image: "assets/images/configurateur/formes/complexe.webp"
          }
        ],
      }
    ],

    // Fonction de prévisualisation qui met à jour l'image selon la forme choisie
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // 🪟 ÉTAPE 3 — SÉLECTION DU TYPE DE VERRE
  // ==========================================================================
  {
    // Identifiant de l'étape
    id: "typeDeVerre",

    // Titre de l'étape
    label: "Type de Verre",

    // Description explicative
    description: "Choisissez le type de verre.",

    // Cette étape ne s'affiche que si la forme a été sélectionnée
    showIf: ({ selection }) => !!selection.forme,

    // Champs de l'étape
    fields: [
      {
        // Identifiant du champ type de verre
        id: "typeDeVerre",

        // Label du champ
        label: "Type de Verre",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 3 types de verre disponibles
        options: [
          {
            id: 4,                    // ID unique
            verreId: 4,               // ID du verre en BDD
            value: "88-4-clair",      // Valeur technique
            label: "Clair 88-4 EVA",  // Texte affiché (épaisseur + type)
            image: "assets/images/configurateur/verres/88-4-clair.webp"
          },
          {
            id: 9,
            verreId: 9,
            value: "88-4-extra-clair",
            label: "Extra clair 88-4 EVA",
            image: "assets/images/configurateur/verres/88-4-extra-clair.webp"
          },
          {
            id: 23,
            verreId: 23,
            value: "aucun",
            label: "Aucun",
            image: "assets/images/configurateur/verres/aucun.webp"
          }
        ]
      }
    ],

    // Fonction de prévisualisation
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // 📏 ÉTAPE 4 — SAISIE DES MESURES
  // ==========================================================================
  {
    // Identifiant de l'étape
    id: "mesures",

    // Titre de l'étape
    label: "Mesures",

    // Cette étape ne s'affiche que si le type de verre a été sélectionné
    showIf: ({ selection }) => !!selection.typeDeVerre,

    // Liste de tous les champs de mesure (affichage conditionnel selon la forme)
    fields: [
      // --- Champ : Longueur A ---
      {
        // Identifiant du champ
        id: "longueur_a",

        // Label affiché
        label: "Longueur A (cm)",

        // Type : champ numérique
        type: "number",

        // Unité affichée à côté du champ
        unit: "cm",

        // Texte d'exemple dans le champ vide
        placeholder: "Ex: 350",

        // Champ obligatoire
        required: true,

        // Condition d'affichage : on cache ce champ si la forme est "complexe"
        // (pour les formes complexes, les mesures sont gérées différemment)
        showIf: ({ selection }) => selection.forme !== "complexe"
      },

      // --- Champ : Longueur B ---
      {
        // Identifiant du champ
        id: "longueur_b",

        // Label affiché
        label: "Longueur B (cm)",

        // Type : numérique
        type: "number",

        // Unité
        unit: "cm",

        // Placeholder
        placeholder: "Ex: 250",

        // Obligatoire
        required: true,

        // Condition d'affichage : 
        // - Ne s'affiche PAS si forme = "droit" (une seule longueur suffit)
        // - Ne s'affiche PAS si forme = "complexe"
        showIf: ({ selection }) => (selection.forme !== "droit") && selection.forme !== "complexe"
      },

      // --- Champ : Longueur C ---
      {
        // Identifiant du champ
        id: "longueur_c",

        // Label affiché
        label: "Longueur C (cm)",

        // Type : numérique
        type: "number",

        // Unité
        unit: "cm",

        // Placeholder
        placeholder: "Ex: 280",

        // Obligatoire
        required: true,

        // Condition d'affichage :
        // - S'affiche UNIQUEMENT pour les formes en "S" ou en "U" (3 côtés)
        // - Ne s'affiche PAS si forme = "complexe"
        showIf: ({ selection }) => (selection.forme === "en-s" || selection.forme === "en-u") && selection.forme !== "complexe"
      },

      // --- Champ : Hauteur ---
      {
        // Identifiant du champ
        id: "hauteur",

        // Label affiché
        label: "Hauteur (cm)",

        // Type : numérique
        type: "number",

        // Unité
        unit: "cm",

        // Placeholder
        placeholder: "Ex: 100",

        // Obligatoire
        required: true,

        // Condition d'affichage :
        // - S'affiche pour les 2 types de barrières (pince ronde et pince carrée)
        showIf: ({ selection }) => selection.type === "pince-ronde" || selection.type === "pince-carree"
      },

      // --- Champ : Angle ---
      {
        // Identifiant du champ
        id: "angle",

        // Label affiché
        label: "Angle (°)",

        // Type : numérique
        type: "number",

        // Unité (symbole degré)
        unit: "°",

        // Placeholder
        placeholder: "Ex: 30",

        // Obligatoire
        required: true,

        // Condition d'affichage :
        // - S'affiche UNIQUEMENT si la forme est "en-v" (angle entre 2 côtés)
        // - Ne s'affiche PAS pour les formes complexes
        showIf: ({ selection }) => selection.forme === "en-v" && selection.forme !== "complexe" 
      },
    ],

    // Fonction de prévisualisation (image mise à jour selon les choix)
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// ============================================================================
// 🛠️ FONCTION UTILITAIRE : CONSTRUCTION DU CHEMIN DE L'IMAGE DE PRÉVISUALISATION
// ============================================================================
/**
 * Génère dynamiquement le chemin de l'image de prévisualisation
 * en fonction des sélections de l'utilisateur
 *
 * @param {Object} selection - Objet contenant tous les choix de l'utilisateur
 * @returns {string|null} - Chemin de l'image ou null si pas de type sélectionné
 */
function buildPreviewPath(selection) {
  // Si aucun type n'est sélectionné, on ne peut pas générer d'image
  if (!selection.type) return null;

  // On récupère le type sélectionné (ex: "pince-ronde")
  const type = selection.type;

  // On récupère la forme sélectionnée, ou "droit" par défaut
  // L'opérateur || retourne la première valeur "truthy" (qui existe)
  const forme = selection.forme || "droit";

  // On construit le chemin complet de l'image selon ce pattern :
  // assets/images/configurateur/previews/barriere-piscine/{TYPE}/barriere-piscine-{TYPE}-{FORME}.webp
  // Exemple : assets/images/configurateur/previews/barriere-piscine/pince-ronde/barriere-piscine-pince-ronde-en-l.webp
  return `assets/images/configurateur/previews/barriere-piscine/${type}/barriere-piscine-${type}-${forme}.webp`;
}
// ============================================================================
// 📋 CONFIGURATION DES ÉTAPES DU CONFIGURATEUR - TÔLE INOX
// ============================================================================
// Ce fichier définit toutes les étapes du parcours de configuration
// pour les tôles inox perforées (types 33, 34, 35 et 36)
// ============================================================================

export default [
  // ==========================================================================
  // 🎯 ÉTAPE 1 — SÉLECTION DU TYPE ET DE LA FINITION
  // ==========================================================================
  {
    // Identifiant unique de l'étape (utilisé pour la navigation)
    id: "type",

    // Titre affiché en haut de l'étape
    label: "Type",

    // Texte d'aide pour guider l'utilisateur
    description: "Choisissez le type de projet et la finition souhaitée.",

    // Image affichée par défaut avant toute sélection (preview initiale)
    // On part sur une tôle inox standard, pose au sol, forme droite
    defaultPreview: "assets/images/configurateur/previews/tole-inox/tole-inox/sol/tole-inox-droit-sol.webp",

    // Liste des champs de formulaire de cette étape
    fields: [
      // --- Champ 1 : Type de tôle inox ---
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

        // Liste des 4 types de tôles inox disponibles
        options: [
          {
            id: 33,                        // ID unique de l'option
            typeId: 33,                    // ID du type dans la base de données
            value: "tole-inox",            // Valeur technique (utilisée dans le code)
            label: "Tôle inox",            // Texte affiché à l'utilisateur
            image: "assets/images/configurateur/types/tole-inox/tole-inox.webp" // Image de la carte
          },
          {
            id: 34,
            typeId: 34,
            value: "tole-inox-et-cables",
            label: "Tôle inox et Câbles",  // Tôle combinée avec des câbles tendus
            image: "assets/images/configurateur/types/tole-inox/tole-inox-et-cables.webp"
          },
          {
            id: 35,
            typeId: 35,
            value: "tole-inox-et-barres",
            label: "Tôle inox et Barres",  // Tôle combinée avec des barres horizontales
            image: "assets/images/configurateur/types/tole-inox/tole-inox-et-barres.webp"
          },
          {
            id: 36,
            typeId: 36,
            value: "tole-inox-muret",
            label: "Tôle inox Muret",      // Tôle pour installation sur muret
            image: "assets/images/configurateur/types/tole-inox/tole-inox-muret.webp"
          }
        ]
      },

      // --- Champ 2 : Finition de l'inox ---
      {
        // Identifiant du champ finition
        id: "finition",

        // Label du champ
        label: "Finition",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 3 types de finitions selon l'environnement (intérieur, extérieur, mer/piscine)
        options: [
          {
            id: 1,                         // ID unique de l'option
            finitionId: 1,                 // ID de la finition en base de données
            value: "tube-inox-304l",       // Valeur technique
            label: "Inox 304 Brossé (Intérieur)",  // Finition standard pour usage intérieur
            image: "assets/images/configurateur/finitions/tube-inox-304l.webp"
          },
          {
            id: 2,
            finitionId: 2,
            value: "tube-inox-316l", 
            label: "Inox 316L Brossé (Extérieur)",  // Finition renforcée pour usage extérieur
            image: "assets/images/configurateur/finitions/tube-inox-316l.webp"
          },
          {
            id: 3,
            finitionId: 3,
            value: "tube-inox-316", 
            label: "Inox 316 Poli Miroir (Mer/Piscine)",  // Finition haute résistance à la corrosion
            image: "assets/images/configurateur/finitions/tube-inox-316.webp"
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

    // Condition d'affichage : cette étape ne s'affiche que si type ET finition sont sélectionnés
    // !! convertit une valeur en booléen (true si la valeur existe)
    showIf: ({ selection }) => !!selection.type && !!selection.finition,

    // ⚠️ IMPORTANT : Préservation de la pose lors du changement de forme
    // Normalement, quand on change de step, les sélections suivantes sont effacées
    // Ici, on demande à NE PAS effacer la "pose" pour garder l'aperçu cohérent
    // Cela évite que l'image de preview disparaisse temporairement
    preserveOnChange: ["pose"],

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

        // 6 formes disponibles (identiques aux autres modules)
        options: [
          {
            id: 1,              // ID unique
            formeId: 1,         // ID de la forme en BDD
            value: "droit",     // Valeur technique
            label: "Droit",     // Garde-corps linéaire simple
            image: "assets/images/configurateur/formes/droit.webp"
          },
          {
            id: 2,
            formeId: 2,
            value: "en-v",
            label: "En V",      // Forme en angle (2 côtés qui se rejoignent)
            image: "assets/images/configurateur/formes/v.webp"
          },
          {
            id: 3,
            formeId: 3,
            value: "en-l",
            label: "En L",      // Forme en équerre (angle droit)
            image: "assets/images/configurateur/formes/l.webp"
          },
          {
            id: 4,
            formeId: 4,
            value: "en-u",
            label: "En U",      // Forme en U (3 côtés parallèles)
            image: "assets/images/configurateur/formes/u.webp"
          },
          {
            id: 5,
            formeId: 5,
            value: "en-s",
            label: "En S",      // Forme sinueuse (3 côtés avec courbure)
            image: "assets/images/configurateur/formes/s.webp"
          },
          {
            id: 6,
            formeId: 6,
            value: "complexe",
            label: "Complexe",  // Forme personnalisée nécessitant un devis sur mesure
            image: "assets/images/configurateur/formes/complexe.webp"
          }
        ],

        // ⚙️ Fonction callback déclenchée quand l'utilisateur change de forme
        // Permet de valider que la pose sélectionnée est toujours compatible
        onChange: ({ selection }) => {
          // Si aucune pose n'a été sélectionnée, pas besoin de validation
          if (!selection.pose) return;

          // On vérifie si la pose actuelle est compatible avec la nouvelle forme
          // Exemple : la pose "incline" n'est valide que pour la forme "droit"
          if (!isPoseValidForForme(selection.pose, selection.forme)) {
            // La pose n'est plus valide → on l'efface
            // L'utilisateur devra la re-sélectionner à l'étape Pose
            selection.pose = undefined;

            // Alternative possible (commentée) :
            // On pourrait laisser undefined et buildPreviewPath utilisera "sol" par défaut
            // ce qui maintient un aperçu visuel même si la sélection est invalide
          }
        }
      }
    ],

    // Fonction de prévisualisation qui met à jour l'image selon la forme choisie
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // 🔧 ÉTAPE 3 — SÉLECTION DE LA POSE ET DE L'ANCRAGE
  // ==========================================================================
  {
    // Identifiant de l'étape
    id: "pose",

    // Titre de l'étape
    label: "Pose",

    // Description explicative
    description: "Choisissez la pose et l'ancrage souhaité",

    // Cette étape ne s'affiche que si la forme a été sélectionnée
    showIf: ({ selection }) => !!selection.forme,

    // Champs de l'étape
    fields: [
      // --- Champ 1 : Type de pose ---
      {
        // Identifiant du champ pose
        id: "pose",

        // Label du champ
        label: "Pose",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 2 types de pose disponibles pour la tôle inox perforée
        options: [
          {
            id: 1,                  // ID unique
            poseId: 1,              // ID de la pose en BDD
            value: "sol",           // Valeur technique
            label: "Sol",           // Pose fixée au sol (installation classique)
            image: "assets/images/configurateur/poses/sol.webp"
          },
          {
            id: 2,
            poseId: 2,
            value: "lateral",       // Pose fixée latéralement (sur mur ou façade)
            label: "Latérale",
            image: "assets/images/configurateur/poses/lateral.webp"
          }
        ],
      },

      // --- Champ 2 : Type d'ancrage ---
      {
        // Identifiant du champ ancrage
        id: "ancrage",

        // Label du champ
        label: "Ancrage",

        // Type : choix multiple
        type: "choice",

        // Interface : cartes visuelles
        ui: "cards",

        // Champ obligatoire
        required: true,

        // 3 types d'ancrage disponibles selon le matériau du support
        options: [
          {
            id: 1,                           // ID unique
            ancrageId: 1,                    // ID de l'ancrage en BDD
            value: "goujon-a-frapper",       // Valeur technique
            label: "Goujon à frapper pour béton",  // Ancrage mécanique pour béton
            image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp"
          },
          {
            id: 2,
            ancrageId: 2,
            value: "tirefonds-pour-bois",
            label: "Tirefonds pour bois",    // Vis spéciales pour support bois
            image: "assets/images/configurateur/ancrages/tirefonds-pour-bois.webp"
          },
          {
            id: 3,
            ancrageId: 3,
            value: "scellement-chimique",
            label: "Tiges Filetées pour scellement Chimique",  // Ancrage chimique haute résistance
            image: "assets/images/configurateur/ancrages/scellement-chimique.webp"
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

    // Cette étape ne s'affiche que si pose ET ancrage ont été sélectionnés
    showIf: ({ selection }) => !!selection.pose && !!selection.ancrage,

    // Liste de tous les champs de mesure (affichage conditionnel selon forme et pose)
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

        // Condition d'affichage :
        // - S'affiche pour pose "sol" OU "lateral"
        // - Ne s'affiche PAS si forme = "complexe" (mesures gérées au cas par cas)
        showIf: ({ selection }) => (selection.pose === "sol" || selection.pose === "lateral") && selection.forme !== "complexe" 
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
        // - S'affiche pour pose "sol" OU "lateral"
        // - Ne s'affiche PAS si forme = "droit" (une seule longueur suffit)
        // - Ne s'affiche PAS si forme = "complexe"
        showIf: ({ selection }) => ((selection.pose === "sol" || selection.pose === "lateral") && selection.forme !== "droit") && selection.forme !== "complexe"
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
        // - S'affiche pour pose "sol" OU "lateral"
        // - S'affiche UNIQUEMENT pour formes "en-s" ou "en-u" (nécessitant 3 mesures)
        // - Ne s'affiche PAS si forme = "complexe"
        showIf: ({ selection }) => ((selection.pose === "sol" || selection.pose === "lateral") && (selection.forme === "en-s" || selection.forme === "en-u")) && selection.forme !== "complexe"
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
        required: true

        // ⚠️ PAS de condition showIf : la hauteur est TOUJOURS nécessaire
        // Contrairement aux autres datasets, on ne filtre pas ce champ selon la pose
        // La hauteur de la tôle perforée est un paramètre essentiel quel que soit le type d'installation
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
        // - S'affiche UNIQUEMENT si la forme est "en-v" (angle entre les 2 côtés)
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

  // On récupère le type sélectionné (ex: "tole-inox")
  const type = selection.type;

  // Variable commentée car non utilisée actuellement dans le path
  // mais peut être utile pour des évolutions futures (ex: images différentes par finition)
  // const finition = selection.finition;

  // On récupère la forme sélectionnée, ou "droit" par défaut
  // L'opérateur || retourne la première valeur "truthy" (qui existe et n'est pas nulle/false/0)
  const forme = selection.forme || "droit";

  // On récupère la pose sélectionnée, ou "sol" par défaut
  const pose = selection.pose || "sol";

  // Variable commentée car non utilisée actuellement dans le path
  // const ancrage = selection.ancrage;

  // On construit le chemin complet de l'image selon ce pattern :
  // assets/images/configurateur/previews/tole-inox/{TYPE}/{POSE}/{TYPE}-{FORME}-{POSE}.webp
  //
  // Exemple : 
  // assets/images/configurateur/previews/tole-inox/tole-inox/lateral/tole-inox-en-l-lateral.webp
  //
  // ⚠️ Note : L'arborescence inclut la pose dans le chemin, ce qui permet d'avoir
  // des visuels différents selon que la tôle est posée au sol ou latéralement
  // (orientation et perspective différentes sur l'image)
  return `assets/images/configurateur/previews/tole-inox/${type}/${pose}/${type}-${forme}-${pose}.webp`;
}

// ============================================================================
// 🛠️ FONCTION UTILITAIRE : VALIDATION DE LA COMPATIBILITÉ POSE/FORME
// ============================================================================
/**
 * Vérifie si une pose est compatible avec une forme donnée
 * Empêche les combinaisons invalides techniquement ou non réalisables
 *
 * @param {string} pose - Type de pose sélectionné ("sol", "lateral", "incline")
 * @param {string} forme - Forme sélectionnée ("droit", "en-v", "en-l", etc.)
 * @returns {boolean} - true si la combinaison est valide, false sinon
 */
function isPoseValidForForme(pose, forme) {
  // Règle métier : la pose "incline" n'est valide QUE pour la forme "droit"
  // Raison : il est techniquement impossible d'incliner une forme complexe (en-v, en-l, etc.)
  // Une forme angulaire ne peut pas être uniformément inclinée
  if (pose === "incline") return forme === "droit";

  // Les poses "sol" et "lateral" sont valables pour TOUTES les formes
  // (droit, en-v, en-l, en-u, en-s, complexe)
  // Toutes les formes peuvent être installées au sol ou fixées latéralement
  return pose === "sol" || pose === "lateral";
}
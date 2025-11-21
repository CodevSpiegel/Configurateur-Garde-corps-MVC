/**
 * ============================================================================
 * datasets/verre/steps.js — Configuration pour garde-corps à panneaux de verre
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier définit les étapes de configuration spécifiques aux garde-corps
 * avec panneaux de verre feuilleté securit.
 *
 * 📚 SPÉCIFICITÉS DU VERRE :
 * - Ajout d'un champ "Type de Verre" (épaisseur et composition)
 * - Plusieurs combinaisons possibles (verre seul, verre + main courante, verre + barres/câbles)
 * - Pas de pose inclinée (le verre ne convient pas aux escaliers)
 * - Hauteur toujours demandée (détermine la taille des panneaux)
 *
 * 💡 PRINCIPE DU VERRE FEUILLETÉ :
 * Le verre est composé de plusieurs couches collées entre elles.
 * En cas de bris, les morceaux restent collés au film, évitant les chutes.
 * 44-2 = 2 verres de 4mm + 1 film = 8,76mm total
 * 55-2 = 2 verres de 5mm + 1 film = 10,76mm total
 */

// ============================================================================
// EXPORT PAR DÉFAUT : TABLEAU DES ÉTAPES
// ============================================================================

export default [

  // ==========================================================================
  // ÉTAPE 1 : CHOIX DU TYPE, DU VERRE ET DE LA FINITION
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    id: "type",
    label: "Type",
    description: "Choisissez le type de projet, le type de verre et la finition souhaitée.",

    // Image d'aperçu par défaut (verre avec main courante, pose au sol, forme droite)
    defaultPreview: "assets/images/configurateur/previews/verre/verre-et-mc/sol/verre-et-mc-droit-sol.webp",

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      // ======================================================================
      // CHAMP 1 : TYPE DE GARDE-CORPS EN VERRE
      // ======================================================================
      {
        id: "type",
        label: "Type",
        type: "choice",
        ui: "cards",
        required: true,

        // Options : différentes combinaisons verre + accessoires
        options: [
          {
            id: 12,                       // ID en base de données
            typeId: 12,                   // ID répété pour compatibilité
            value: "verre-et-mc",         // Verre + main courante (MC)
            label: "Verre et Main-courante",
            image: "assets/images/configurateur/types/verre/verre-et-mc.webp"
          },
          {
            id: 13,
            typeId: 13,
            value: "verre-et-2-barres",   // Verre + 2 barres horizontales
            label: "Verre et 2 barres",
            image: "assets/images/configurateur/types/verre/verre-et-2-barres.webp"
          },
          {
            id: 14,
            typeId: 14,
            value: "verre-et-2-cables",   // Verre + 2 câbles tendus
            label: "Verre et 2 cables",
            image: "assets/images/configurateur/types/verre/verre-et-2-cables.webp"
          },
          {
            id: 15,
            typeId: 15,
            value: "verre-sans-mc",       // Verre seul sans main courante
            label: "Verre sans Main-Courante",
            image: "assets/images/configurateur/types/verre/verre-sans-mc.webp"
          },
          {
            id: 16,
            typeId: 16,
            value: "verre-muret-sans-mc", // Verre sur muret sans MC
            label: "Verre Muret sans Main Courante",
            image: "assets/images/configurateur/types/verre/verre-muret-sans-mc.webp"
          },
          {
            id: 17,
            typeId: 17,
            value: "verre-sur-muret",     // Verre sur muret avec MC
            label: "Verre sur Muret",
            image: "assets/images/configurateur/types/verre/verre-sur-muret.webp"
          }
        ]
      },

      // ======================================================================
      // CHAMP 2 : TYPE DE VERRE (ÉPAISSEUR)
      // ======================================================================
      {
        id: "typeDeVerre",
        label: "Type de Verre",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de verre feuilleté
        // L'épaisseur détermine la résistance et le poids
        options: [
          {
            id: 6,
            verreId: 6,                   // ID spécifique pour le verre
            value: "44-2-clair",          // 2 verres de 4mm
            label: "Feuilleté clair 44-2 (8,76mm)",  // Épaisseur totale
            image: "assets/images/configurateur/verres/44-2-clair.webp"
          },
          {
            id: 5,
            verreId: 5,
            value: "55-2-clair",          // 2 verres de 5mm (plus épais)
            label: "Feuilleté clair 55-2 (10,76mm)",
            image: "assets/images/configurateur/verres/55-2-clair.webp"
          },
          {
            id: 23,
            verreId: 23,
            value: "aucun",               // Option "sans verre" (pour devis spéciaux)
            label: "Aucun",
            image: "assets/images/configurateur/verres/aucun.webp"
          }
        ]
      },

      // ======================================================================
      // CHAMP 3 : FINITION DE L'INOX (POTEAUX ET ACCESSOIRES)
      // ======================================================================
      {
        id: "finition",
        label: "Finition",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de finition des éléments inox (identiques aux autres types)
        options: [
          {
            id: 1,
            finitionId: 1,                // ID spécifique pour la finition
            value: "tube-inox-304l",
            label: "Inox 304 Brossé (Intérieur)",  // Usage intérieur
            image: "assets/images/configurateur/finitions/tube-inox-304l.webp"
          },
          {
            id: 2,
            finitionId: 2,
            value: "tube-inox-316l",
            label: "Inox 316L Brossé (Extérieur)",  // Usage extérieur
            image: "assets/images/configurateur/finitions/tube-inox-316l.webp"
          },
          {
            id: 3,
            finitionId: 3,
            value: "tube-inox-316",
            label: "Inox 316 Poli Miroir (Mer/Piscine)",  // Environnement marin
            image: "assets/images/configurateur/finitions/tube-inox-316.webp"
          }
        ]
      }
    ],

    // Fonction d'aperçu dynamique
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // ÉTAPE 2 : CHOIX DE LA FORME
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    id: "forme",
    label: "Forme",
    description: "Choisissez la forme souhaitée.",

    // Cette étape apparaît si type, typeDeVerre ET finition sont sélectionnés
    // Contrairement aux barres/câbles, on attend 3 choix au lieu de 2
    showIf: ({ selection }) => 
      !!selection.type && 
      !!selection.typeDeVerre && 
      !!selection.finition,

    // Préserver la pose lors du changement de forme
    preserveOnChange: ["pose"],

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      {
        id: "forme",
        label: "Forme",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de formes (identiques aux autres types)
        options: [
          {
            id: 1,
            formeId: 1,                   // ID spécifique pour la forme
            value: "droit",
            label: "Droit",
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

    // Aperçu dynamique
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // ÉTAPE 3 : CHOIX DE LA POSE ET DE L'ANCRAGE
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    id: "pose",
    label: "Pose",
    description: "Choisissez la pose et l'ancrage souhaité",

    // Cette étape apparaît si la forme a été choisie
    showIf: ({ selection }) => !!selection.forme,

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      // ======================================================================
      // CHAMP 1 : TYPE DE POSE
      // ======================================================================
      {
        id: "pose",
        label: "Pose",
        type: "choice",
        ui: "cards",
        required: true,

        // --------------------------------------------------------------------
        // OPTIONS DYNAMIQUES
        // --------------------------------------------------------------------

        // Pour le verre, seulement 2 poses disponibles (pas d'inclinée)
        // Le verre ne convient pas aux escaliers pour des raisons techniques
        options: ({ selection }) => {
          // Tableau de base avec les poses disponibles
          const base = [
            {
              poseId: 1,              // ID numérique
              value: "sol",           // Pose au sol (la plus courante)
              label: "Sol"
            },
            {
              poseId: 2,
              value: "lateral",       // Pose latérale (fixation sur le côté)
              label: "Latérale"
            }
          ];

          // ⚠️ NOTE : Contrairement aux barres/câbles, PAS de pose inclinée
          // Le verre ne peut pas être installé sur un escalier car :
          // - Poids trop important
          // - Difficulté de découpe en angle
          // - Risque de bris accru

          // Transformer les options pour ajouter l'id et l'image
          return base.map(opt => ({
            ...opt,                   // Copier toutes les propriétés
            id: opt.poseId,           // Ajouter l'id
            // Template string pour le chemin de l'image
            image: `assets/images/configurateur/poses/${opt.value}.webp`,
          }));
        }
      },

      // ======================================================================
      // CHAMP 2 : TYPE D'ANCRAGE
      // ======================================================================
      {
        id: "ancrage",
        label: "Ancrage",
        type: "choice",
        ui: "cards",
        required: true,

        // Options d'ancrage (identiques aux autres types)
        options: [
          {
            id: 1,
            ancrageId: 1,             // ID spécifique pour l'ancrage
            value: "goujon-a-frapper",
            label: "Goujon à frapper pour béton",
            image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp"
          },
          {
            id: 2,
            ancrageId: 2,
            value: "tirefonds-pour-bois",
            label: "Tirefonds pour bois",
            image: "assets/images/configurateur/ancrages/tirefonds-pour-bois.webp" 
          },
          {
            id: 3,
            ancrageId: 3,
            value: "scellement-chimique", 
            label: "Tiges Filetées pour scellement Chimique", 
            image: "assets/images/configurateur/ancrages/scellement-chimique.webp" 
          }
        ]
      }
    ],

    // Aperçu dynamique
    preview: ({ selection }) => buildPreviewPath(selection)
  },

  // ==========================================================================
  // ÉTAPE 4 : SAISIE DES MESURES
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    id: "mesures",
    label: "Mesures",

    // Cette étape apparaît si pose ET ancrage sont choisis
    showIf: ({ selection }) => !!selection.pose && !!selection.ancrage,

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      // ======================================================================
      // CHAMP 1 : LONGUEUR A (PREMIER SEGMENT)
      // ======================================================================
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 350",
        required: true,

        // Longueur A demandée pour toutes les poses sauf complexe
        // Détermine la largeur des panneaux de verre
        showIf: ({ selection }) =>
          (selection.pose === "sol" || selection.pose === "lateral") &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 2 : LONGUEUR B (DEUXIÈME SEGMENT)
      // ======================================================================
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,

        // Longueur B seulement pour les formes non-droites
        showIf: ({ selection }) =>
          ((selection.pose === "sol" || selection.pose === "lateral") &&
           selection.forme !== "droit") &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 3 : LONGUEUR C (TROISIÈME SEGMENT)
      // ======================================================================
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,

        // Longueur C seulement pour les formes en-s et en-u
        showIf: ({ selection }) =>
          ((selection.pose === "sol" || selection.pose === "lateral") &&
           (selection.forme === "en-s" || selection.forme === "en-u")) &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 4 : HAUTEUR
      // ======================================================================
      {
        id: "hauteur",
        label: "Hauteur (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 100",
        required: true

        // ⚠️ NOTE : Hauteur TOUJOURS requise pour le verre
        // Contrairement aux barres/câbles, pas de condition showIf
        // La hauteur détermine la taille des panneaux de verre
      },

      // ======================================================================
      // CHAMP 5 : ANGLE
      // ======================================================================
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",
        placeholder: "Ex: 30",
        required: true,

        // Angle seulement pour la forme en V
        // Note : pas d'angle pour pose inclinée car cette pose n'existe pas pour le verre
        showIf: ({ selection }) =>
          selection.forme === "en-v" &&
          selection.forme !== "complexe"
      },
    ],

    // Aperçu dynamique avec toutes les mesures
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// ============================================================================
// FONCTION UTILITAIRE : CONSTRUCTION DU CHEMIN D'APERÇU
// ============================================================================

/**
 * buildPreviewPath() = construire le chemin de l'image d'aperçu
 *
 * Pattern du chemin :
 * assets/images/configurateur/previews/verre/{type}/{pose}/{type}-{forme}-{pose}.webp
 *
 * Exemple :
 * assets/images/configurateur/previews/verre/verre-et-mc/sol/verre-et-mc-droit-sol.webp
 *
 * 💡 NOTE SUR LES VARIABLES COMMENTÉES :
 * Les variables typeDeVerre, finition et ancrage sont récupérées mais non utilisées
 * dans le chemin de l'image. Elles sont commentées mais conservées pour d'éventuelles
 * évolutions futures (par exemple : aperçus différents selon le type de verre).
 *
 * @param {Object} selection - Les choix de l'utilisateur
 * @returns {string|null} - Le chemin de l'image ou null
 */
function buildPreviewPath(selection) {
  // Si le type n'est pas encore sélectionné, pas d'aperçu
  if (!selection.type) return null;

  // Extraire les valeurs utilisées dans le chemin
  const type  = selection.type;

  // Variables récupérées mais non utilisées (commentées pour documentation)
  // const typeDeVerre = selection.typeDeVerre;  // Type de verre (44-2, 55-2...)
  // const finition = selection.finition;        // Finition inox

  // Valeurs par défaut si non définies
  const forme = selection.forme || "droit";
  const pose  = selection.pose || "sol";

  // Variable récupérée mais non utilisée
  // const ancrage = selection.ancrage;          // Type d'ancrage

  // Construire et retourner le chemin
  return `assets/images/configurateur/previews/verre/${type}/${pose}/${type}-${forme}-${pose}.webp`;
}

// ============================================================================
// FONCTION UTILITAIRE : VALIDATION DE COMPATIBILITÉ
// ============================================================================

/**
 * isPoseValidForForme() = vérifier si une pose est compatible avec une forme
 *
 * Cette fonction est identique aux autres datasets mais pourrait être
 * supprimée car la pose inclinée n'existe pas pour le verre.
 *
 * Elle est conservée pour maintenir la cohérence du code et au cas où
 * des évolutions futures ajouteraient d'autres contraintes.
 *
 * @param {string} pose - Le type de pose
 * @param {string} forme - La forme du garde-corps
 * @returns {boolean} - true si compatible
 */
function isPoseValidForForme(pose, forme) {
  // Règle pour la pose inclinée (non utilisée pour le verre)
  if (pose === "incline") {
    return forme === "droit";
  }

  // Poses sol et lateral valables pour toutes les formes
  return pose === "sol" || pose === "lateral";
}

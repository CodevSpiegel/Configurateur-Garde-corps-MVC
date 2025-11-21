/**
 * ============================================================================
 * datasets/cables/steps.js — Configuration pour garde-corps à câbles tendus
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier définit les étapes de configuration spécifiques aux garde-corps
 * avec câbles tendus en inox.
 *
 * 📚 DIFFÉRENCES AVEC BARRES :
 * - Options de types différentes (5, 7, 8, 11 câbles au lieu de barres)
 * - Mêmes finitions (inox 304, 316L, 316)
 * - Mêmes formes et poses
 * - Chemins d'images différents (dossier "cables" au lieu de "barres")
 *
 * 💡 PRINCIPE DES CÂBLES TENDUS :
 * Les câbles en inox sont tendus horizontalement entre des poteaux.
 * Ils offrent une vue dégagée tout en assurant la sécurité.
 * Plus il y a de câbles, plus le garde-corps est haut.
 */

// ============================================================================
// EXPORT PAR DÉFAUT : TABLEAU DES ÉTAPES
// ============================================================================

export default [

  // ==========================================================================
  // ÉTAPE 1 : CHOIX DU TYPE ET DE LA FINITION
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    id: "type",
    label: "Type",
    description: "Choisissez le type de projet et la finition souhaitée.",

    // Image d'aperçu par défaut (5 câbles, pose au sol, forme droite)
    defaultPreview: "assets/images/configurateur/previews/cables/5-cables/sol/5-cables-droit-sol.webp",

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      // ======================================================================
      // CHAMP 1 : TYPE DE GARDE-CORPS (NOMBRE DE CÂBLES)
      // ======================================================================
      {
        id: "type",
        label: "Type",
        type: "choice",
        ui: "cards",
        required: true,

        // Options : nombre de câbles
        // Plus il y a de câbles, plus le garde-corps est haut
        options: [
          {
            id: 1,                    // ID en base de données
            value: "5-cables",        // 5 câbles = hauteur standard (~100cm)
            label: "5 Câbles",
            image: "assets/images/configurateur/types/cables/5-cables.webp"
          },
          {
            id: 2,
            value: "7-cables",        // 7 câbles = hauteur supérieure (~120cm)
            label: "7 Câbles",
            image: "assets/images/configurateur/types/cables/7-cables.webp"
          },
          {
            id: 3,
            value: "8-cables",        // 8 câbles = hauteur importante (~140cm)
            label: "8 Câbles",
            image: "assets/images/configurateur/types/cables/8-cables.webp"
          },
          {
            id: 4,
            value: "11-cables",       // 11 câbles = hauteur maximale (~160cm)
            label: "11 Câbles",
            image: "assets/images/configurateur/types/cables/11-cables.webp"
          },
          {
            id: 5, 
            value: "2-cables-muret",  // 2 câbles sur muret (complément de sécurité)
            label: "2 Câbles Muret", 
            image: "assets/images/configurateur/types/cables/2-cables-muret.webp"
          },
          {
            id: 6, 
            value: "3-cables-muret",  // 3 câbles sur muret
            label: "3 Câbles Muret",
            image: "assets/images/configurateur/types/cables/3-cables-muret.webp"
          }
        ]
      },

      // ======================================================================
      // CHAMP 2 : FINITION DE L'INOX
      // ======================================================================
      {
        id: "finition",
        label: "Finition",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de finition identiques aux barres
        // La finition s'applique aux poteaux et accessoires (pas aux câbles)
        options: [
          {
            id: 1,
            value: "tube-inox-304l",
            label: "Inox 304 Brossé (Intérieur)",  // Usage intérieur
            image: "assets/images/configurateur/finitions/tube-inox-304l.webp"
          },
          {
            id: 2,
            value: "tube-inox-316l",
            label: "Inox 316L Brossé (Extérieur)",  // Usage extérieur
            image: "assets/images/configurateur/finitions/tube-inox-316l.webp"
          },
          {
            id: 3,
            value: "tube-inox-316",
            label: "Inox 316 Poli Miroir (Mer/Piscine)",  // Environnement salin
            image: "assets/images/configurateur/finitions/tube-inox-316.webp"
          }
        ]
      }
    ],

    // Fonction d'aperçu dynamique
    // Construit le chemin de l'image selon les choix de l'utilisateur
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

    // Cette étape apparaît seulement si type ET finition sont sélectionnés
    // !! = convertir en booléen (!!null = false, !!"value" = true)
    showIf: ({ selection }) => !!selection.type && !!selection.finition,

    // Préserver le champ "pose" lors du changement de forme
    // Cela évite de réinitialiser l'aperçu à chaque changement
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

        // Options de formes (identiques aux barres)
        options: [
          {
            id: 1,
            value: "droit",      // Garde-corps rectiligne
            label: "Droit",
            image: "assets/images/configurateur/formes/droit.webp"
          },
          {
            id: 2,
            value: "en-v",       // Deux segments formant un angle
            label: "En V",
            image: "assets/images/configurateur/formes/v.webp"
          },
          {
            id: 3,
            value: "en-l",       // Deux segments perpendiculaires
            label: "En L",
            image: "assets/images/configurateur/formes/l.webp"
          },
          {
            id: 4,
            value: "en-u",       // Trois segments (U)
            label: "En U",
            image: "assets/images/configurateur/formes/u.webp"
          },
          {
            id: 5,
            value: "en-s",       // Trois segments (S)
            label: "En S",
            image: "assets/images/configurateur/formes/s.webp"
          },
          {
            id: 6,
            value: "complexe",   // Forme personnalisée (devis sur mesure)
            label: "Complexe",
            image: "assets/images/configurateur/formes/complexe.webp"
          }
        ],

        // --------------------------------------------------------------------
        // HOOK onChange : VÉRIFICATION DE COMPATIBILITÉ
        // --------------------------------------------------------------------

        // Cette fonction s'exécute quand l'utilisateur change de forme
        // Elle vérifie que la pose sélectionnée reste valide
        onChange: ({ selection }) => {
          // Si aucune pose n'a été sélectionnée, rien à faire
          if (!selection.pose) return;

          // Vérifier la compatibilité pose/forme
          if (!isPoseValidForForme(selection.pose, selection.forme)) {
            // Si incompatible, effacer la pose
            // L'utilisateur devra la re-choisir à l'étape suivante
            selection.pose = undefined;
          }
        }
      }
    ],

    // Aperçu dynamique mis à jour selon la forme choisie
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

    // Cette étape apparaît seulement si la forme a été choisie
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

        // Les options changent selon le type et la forme sélectionnés
        // Cette fonction est appelée à chaque fois que l'utilisateur
        // arrive sur cette étape ou change un choix précédent
        options: ({ selection }) => {
          // Options de base (disponibles pour tous les types/formes)
          const base = [
            {
              poseId: 1,         // ID numérique pour la base de données
              value: "sol",      // Valeur interne (slug)
              label: "Sol"       // Texte affiché
            },
            {
              poseId: 2,
              value: "lateral",  // Pose latérale (fixation sur le côté)
              label: "Latérale"
            }
          ];

          // --------------------------------------------------------------------
          // AJOUT CONDITIONNEL DE LA POSE INCLINÉE
          // --------------------------------------------------------------------

          // La pose inclinée n'est disponible que pour :
          // - Forme droite (pas d'angle, pas de tournant)
          // - ET type 5-cables, 2-cables-muret ou 3-cables-muret
          if (
            selection.forme === "droit" &&
            (selection.type === "5-cables" ||
             selection.type === "2-cables-muret" ||
             selection.type === "3-cables-muret")
          ) {
            // push() = ajouter un élément à la fin du tableau
            base.push({
              poseId: 3,
              value: "incline",  // Pose inclinée (escalier)
              label: "Inclinée"
            });
          }

          // --------------------------------------------------------------------
          // TRANSFORMATION DES OPTIONS POUR AJOUTER L'ID ET L'IMAGE
          // --------------------------------------------------------------------

          // map() = transformer chaque élément du tableau
          return base.map(opt => ({
            ...opt,                    // ... = spread (copier toutes les propriétés)
            id: opt.poseId,            // Ajouter l'id (requis par le système)
            // Template string pour construire le chemin de l'image
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

        // Options d'ancrage (identiques aux barres)
        // Le type d'ancrage dépend du matériau du support
        options: [
          {
            id: 1,
            value: "goujon-a-frapper",
            label: "Goujon à frapper pour béton",  // Pour dalle béton
            image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp"
          },
          {
            id: 2,
            value: "tirefonds-pour-bois",
            label: "Tirefonds pour bois",  // Pour terrasse bois
            image: "assets/images/configurateur/ancrages/tirefonds-pour-bois.webp"
          },
          {
            id: 3,
            value: "scellement-chimique",
            label: "Tiges Filetées pour scellement Chimique",  // Pour pierre/carrelage
            image: "assets/images/configurateur/ancrages/scellement-chimique.webp"
          }
        ]
      }
    ],

    // Aperçu dynamique mis à jour selon la pose et l'ancrage
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

    // Cette étape apparaît seulement si pose ET ancrage sont choisis
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
        type: "number",              // Champ numérique
        unit: "cm",                  // Unité (affichée à l'utilisateur)
        placeholder: "Ex: 350",      // Exemple dans le champ vide
        required: true,

        // Ce champ apparaît pour toutes les poses sauf forme complexe
        // Les formes complexes nécessitent un devis personnalisé
        showIf: ({ selection }) =>
          (selection.pose === "incline" ||
           selection.pose === "sol" ||
           selection.pose === "lateral") &&
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

        // Ce champ apparaît seulement pour les formes non-droites
        // (en-v, en-l, en-u, en-s nécessitent un 2ème segment)
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

        // Ce champ apparaît seulement pour les formes en-s et en-u
        // Ces formes ont 3 segments
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
        required: true,

        // Hauteur demandée pour toutes les poses
        // Elle détermine l'espace entre le sol et le premier câble
        showIf: ({ selection }) =>
          selection.pose === "incline" ||
          selection.pose === "sol" ||
          selection.pose === "lateral"
      },

      // ======================================================================
      // CHAMP 5 : ANGLE
      // ======================================================================
      {
        id: "angle",
        label: "Angle (°)",
        type: "number",
        unit: "°",                   // Unité en degrés
        placeholder: "Ex: 30",
        required: true,

        // Angle demandé seulement pour :
        // - Pose inclinée (angle de l'escalier)
        // - OU forme en V (angle entre les deux segments)
        showIf: ({ selection }) =>
          (selection.pose === "incline" || selection.forme === "en-v") &&
          selection.forme !== "complexe"
      },
    ],

    // Aperçu dynamique avec toutes les informations
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// ============================================================================
// FONCTION UTILITAIRE : CONSTRUCTION DU CHEMIN D'APERÇU
// ============================================================================

/**
 * buildPreviewPath() = construire le chemin de l'image d'aperçu
 *
 * Cette fonction suit la même logique que pour les barres,
 * mais utilise le dossier "cables" au lieu de "barres".
 *
 * Pattern du chemin :
 * assets/images/configurateur/previews/cables/{type}/{pose}/{type}-{forme}-{pose}.webp
 *
 * Exemple :
 * assets/images/configurateur/previews/cables/5-cables/sol/5-cables-droit-sol.webp
 *
 * 💡 ORGANISATION DES IMAGES :
 * Les images sont organisées par type (nombre de câbles),
 * puis par pose (sol/lateral/incline),
 * puis par combinaison type-forme-pose.
 *
 * @param {Object} selection - Les choix de l'utilisateur
 * @returns {string|null} - Le chemin de l'image ou null
 */
function buildPreviewPath(selection) {
  // Si le type n'est pas encore sélectionné, pas d'aperçu
  if (!selection.type) return null;

  // Extraire les valeurs avec valeurs par défaut
  const type  = selection.type;
  const forme = selection.forme || "droit";    // Par défaut : droit
  const pose  = selection.pose || "sol";       // Par défaut : sol

  // Construire et retourner le chemin
  // Template string : ${variable} insère la valeur dans la chaîne
  return `assets/images/configurateur/previews/cables/${type}/${pose}/${type}-${forme}-${pose}.webp`;
}

// ============================================================================
// FONCTION UTILITAIRE : VALIDATION DE COMPATIBILITÉ
// ============================================================================

/**
 * isPoseValidForForme() = vérifier si une pose est compatible avec une forme
 *
 * Cette fonction implémente les règles métier de compatibilité.
 * Elle est identique à la version pour les barres.
 *
 * 📐 RÈGLES MÉTIER :
 * - Pose "incline" : uniquement pour forme "droit"
 *   Raison : les câbles doivent suivre l'angle de l'escalier
 *   sans tourner
 *
 * - Poses "sol" et "lateral" : valables pour toutes les formes
 *   Raison : ces poses peuvent gérer les angles et tournants
 *
 * @param {string} pose - Le type de pose (sol, lateral, incline)
 * @param {string} forme - La forme du garde-corps
 * @returns {boolean} - true si compatible, false sinon
 */
function isPoseValidForForme(pose, forme) {
  // Règle métier actuelle (ex.): "incline" uniquement valide pour "droit".
  if (pose === "incline") {
    // La pose inclinée n'est valable que pour la forme droite
    return forme === "droit";
  }

  // Pour les autres poses, toutes les formes sont acceptées
  // || = OU logique (au moins une condition vraie)
  return pose === "sol" || pose === "lateral";
}

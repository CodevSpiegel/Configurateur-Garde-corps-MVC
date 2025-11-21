/**
 * ============================================================================
 * datasets/barres/steps.js — Configuration pour garde-corps à barres horizontales
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier définit les étapes de configuration spécifiques aux garde-corps
 * avec barres horizontales en inox.
 *
 * 📚 STRUCTURE :
 * Le fichier exporte un tableau d'étapes (steps), chaque étape contenant :
 * - id : identifiant unique de l'étape
 * - label : titre affiché à l'utilisateur
 * - description : texte d'explication
 * - fields : liste des champs du formulaire
 * - showIf : condition d'affichage (optionnelle)
 * - preview : fonction ou URL pour l'aperçu visuel
 * - preserveOnChange : champs à ne pas effacer lors du changement
 *
 * 💡 CONCEPTS JAVASCRIPT UTILISÉS :
 * - Export default (module ES6)
 * - Objets et tableaux
 * - Fonctions fléchées
 * - Conditions dynamiques
 * - Template strings
 */

// ============================================================================
// EXPORT PAR DÉFAUT : TABLEAU DES ÉTAPES
// ============================================================================

// export default = exporter une valeur par défaut du module
// Cette syntaxe permet d'importer avec : import steps from "./steps.js"
export default [

  // ==========================================================================
  // ÉTAPE 1 : CHOIX DU TYPE ET DE LA FINITION
  // ==========================================================================
  {
    // ------------------------------------------------------------------------
    // MÉTADONNÉES DE L'ÉTAPE
    // ------------------------------------------------------------------------

    // Identifiant unique de l'étape
    id: "type",

    // Titre affiché dans la sidebar et en haut du formulaire
    label: "Type",

    // Description affichée sous le titre
    description: "Choisissez le type de projet et la finition souhaitée.",

    // Image d'aperçu par défaut (avant que l'utilisateur fasse des choix)
    defaultPreview: "assets/images/configurateur/previews/barres/5-barres/sol/5-barres-droit-sol.webp",

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    // fields = tableau des champs du formulaire
    fields: [
      // ======================================================================
      // CHAMP 1 : TYPE DE GARDE-CORPS
      // ======================================================================
      {
        // Identifiant unique du champ (utilisé dans selection[id])
        id: "type",

        // Label affiché au-dessus du champ
        label: "Type",

        // Type de champ : "choice" = choix parmi plusieurs options
        type: "choice",

        // Interface utilisateur : "cards" = cartes cliquables avec images
        ui: "cards",

        // required: true = ce champ doit être rempli pour passer à l'étape suivante
        required: true,

        // Liste des options disponibles
        // Chaque option est un objet avec :
        // - id : identifiant numérique (correspond à la base de données)
        // - value : valeur interne (utilisée dans le code)
        // - label : texte affiché à l'utilisateur
        // - image : chemin de l'image à afficher
        options: [
          // ⚠️ IMPORTANT : Les value DOIVENT correspondre aux noms de dossiers
          // dans assets/images/configurateur/previews/barres/
          {
            id: 7,                    // ID en base de données
            value: "5-barres",        // Valeur interne
            label: "5 Barres",        // Texte affiché
            image: "assets/images/configurateur/types/barres/5-barres.webp"  // Image
          },
          {
            id: 8,
            value: "7-barres",
            label: "7 Barres",
            image: "assets/images/configurateur/types/barres/7-barres.webp"
          },
          {
            id: 9,
            value: "11-barres",
            label: "11 Barres",
            image: "assets/images/configurateur/types/barres/11-barres.webp"
          },
          {
            id: 10,
            value: "2-barres-muret",
            label: "2 Barres Muret",
            image: "assets/images/configurateur/types/barres/2-barres-muret.webp"
          },
          {
            id: 11,
            value: "3-barres-muret",
            label: "3 Barres Muret",
            image: "assets/images/configurateur/types/barres/3-barres-muret.webp"
          }
        ]
      },

      // ======================================================================
      // CHAMP 2 : FINITION DE L'INOX
      // ======================================================================
      {
        id: "finition",
        label: "Finition",
        description: "Choisissez la finition",
        type: "choice",
        ui: "cards",
        required: true,

        // Options de finition selon l'utilisation (intérieur, extérieur, piscine)
        options: [
          {
            id: 1,
            value: "tube-inox-304l",
            label: "Inox 304 Brossé (Intérieur)",  // Pour usage intérieur
            image: "assets/images/configurateur/finitions/tube-inox-304l.webp"
          },
          {
            id: 2,
            value: "tube-inox-316l",
            label: "Inox 316L Brossé (Extérieur)",  // Pour usage extérieur
            image: "assets/images/configurateur/finitions/tube-inox-316l.webp" 
          },
          {
            id: 3,
            value: "tube-inox-316", 
            label: "Inox 316 Poli Miroir (Mer/Piscine)",  // Pour bord de mer/piscine
            image: "assets/images/configurateur/finitions/tube-inox-316.webp"
          }
        ]
      }
    ],

    // ------------------------------------------------------------------------
    // FONCTION D'APERÇU DYNAMIQUE
    // ------------------------------------------------------------------------

    // preview = fonction qui calcule le chemin de l'image d'aperçu
    // ({ selection }) = destructuration : on extrait selection du paramètre
    // => = fonction fléchée (arrow function)
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

    // ------------------------------------------------------------------------
    // CONDITION D'AFFICHAGE
    // ------------------------------------------------------------------------

    // showIf = condition pour afficher cette étape
    // Cette étape n'apparaît que si type ET finition sont remplis
    // !! = double négation (convertir en booléen)
    // !!value = true si value existe et n'est pas vide, false sinon
    // && = ET logique (les deux conditions doivent être vraies)
    showIf: ({ selection }) => !!selection.type && !!selection.finition,

    // ------------------------------------------------------------------------
    // PRÉSERVATION DE CHAMPS
    // ------------------------------------------------------------------------

    // preserveOnChange = liste des champs à ne PAS effacer quand on change de forme
    // Ici, on garde "pose" pour maintenir la cohérence de l'aperçu
    // Sans cela, changer la forme effacerait la pose et l'aperçu reviendrait à "sol"
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

        // Options de formes disponibles
        options: [
          {
            id: 1,
            value: "droit",      // Garde-corps tout droit
            label: "Droit",
            image: "assets/images/configurateur/formes/droit.webp"
          },
          {
            id: 2,
            value: "en-v",       // Forme en V (angle)
            label: "En V",
            image: "assets/images/configurateur/formes/v.webp"
          },
          {
            id: 3,
            value: "en-l",       // Forme en L (deux segments perpendiculaires)
            label: "En L",
            image: "assets/images/configurateur/formes/l.webp"
          },
          {
            id: 4,
            value: "en-u",       // Forme en U (trois segments)
            label: "En U",
            image: "assets/images/configurateur/formes/u.webp"
          },
          {
            id: 5,
            value: "en-s",       // Forme en S (trois segments)
            label: "En S",
            image: "assets/images/configurateur/formes/s.webp"
          },
          {
            id: 6,
            value: "complexe",   // Forme complexe (sur mesure)
            label: "Complexe",
            image: "assets/images/configurateur/formes/complexe.webp"
          }
        ],

        // --------------------------------------------------------------------
        // HOOK onChange : APPELÉ QUAND L'UTILISATEUR CHANGE DE FORME
        // --------------------------------------------------------------------

        // onChange = fonction exécutée quand la valeur du champ change
        // Ici, on vérifie que la pose sélectionnée est toujours compatible
        onChange: ({ selection }) => {
          // Si aucune pose n'a été sélectionnée, ne rien faire
          if (!selection.pose) return;

          // Vérifier si la pose est valide pour la nouvelle forme
          if (!isPoseValidForForme(selection.pose, selection.forme)) {
            // Si la pose n'est plus valide, l'effacer
            // L'utilisateur devra la re-choisir à l'étape Pose
            selection.pose = undefined;

            // Note : On pourrait aussi choisir de garder une valeur invalide
            // pour maintenir l'aperçu, mais c'est moins propre
          }
        }
      }
    ],

    // Aperçu dynamique basé sur la sélection actuelle
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

    // Cette étape n'apparaît que si la forme a été choisie
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
        // OPTIONS DYNAMIQUES SELON LES CHOIX PRÉCÉDENTS
        // --------------------------------------------------------------------

        // options = fonction qui retourne les options disponibles
        // Les options changent selon le type et la forme sélectionnés
        options: ({ selection }) => {
          // Tableau de base avec les poses communes à tous
          const base = [
            {
              poseId: 1,        // ID en base de données
              value: "sol",     // Valeur interne
              label: "Sol"      // Texte affiché
            },
            {
              poseId: 2,
              value: "lateral",
              label: "Latérale"
            }
          ];

          // Condition pour ajouter la pose "inclinée"
          // Elle n'est disponible que pour :
          // - Forme droite
          // - ET type 5-barres, 2-barres-muret ou 3-barres-muret
          if (
            selection.forme === "droit" &&
            (selection.type === "5-barres" ||
             selection.type === "2-barres-muret" ||
             selection.type === "3-barres-muret")
          ) {
            // push() = ajouter un élément à la fin du tableau
            base.push({
              poseId: 3,
              value: "incline",
              label: "Inclinée"
            });
          }

          // Transformer chaque option pour ajouter l'id et l'image
          // map() = créer un nouveau tableau transformé
          return base.map(opt => ({
            ...opt,                    // ... = spread operator (copier toutes les propriétés)
            id: opt.poseId,            // Ajouter la propriété id
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

        // Options d'ancrage selon le type de sol/support
        options: [
          {
            id: 1,
            value: "goujon-a-frapper",
            label: "Goujon à frapper pour béton",  // Pour béton
            image: "assets/images/configurateur/ancrages/goujon-a-frapper.webp"
          },
          {
            id: 2,
            value: "tirefonds-pour-bois",
            label: "Tirefonds pour bois",  // Pour bois (terrasse)
            image: "assets/images/configurateur/ancrages/tirefonds-pour-bois.webp"
          },
          {
            id: 3,
            value: "scellement-chimique",
            label: "Tiges Filetées pour scellement Chimique",  // Pour pierre, carrelage
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

    // Cette étape n'apparaît que si pose ET ancrage sont choisis
    showIf: ({ selection }) => !!selection.pose && !!selection.ancrage,

    // ------------------------------------------------------------------------
    // CHAMPS DE L'ÉTAPE
    // ------------------------------------------------------------------------

    fields: [
      // ======================================================================
      // CHAMP 1 : LONGUEUR A
      // ======================================================================
      {
        id: "longueur_a",
        label: "Longueur A (cm)",
        type: "number",              // Champ numérique
        unit: "cm",                  // Unité affichée
        placeholder: "Ex: 350",      // Texte indicatif dans le champ vide
        required: true,

        // Condition d'affichage complexe :
        // Ce champ apparaît si :
        // - La pose est incline, sol ou lateral
        // - ET la forme n'est pas complexe
        showIf: ({ selection }) =>
          (selection.pose === "incline" ||
           selection.pose === "sol" ||
           selection.pose === "lateral") &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 2 : LONGUEUR B
      // ======================================================================
      {
        id: "longueur_b",
        label: "Longueur B (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 250",
        required: true,

        // Ce champ apparaît si :
        // - La pose est sol ou lateral
        // - ET la forme n'est pas droit ni complexe
        showIf: ({ selection }) =>
          ((selection.pose === "sol" || selection.pose === "lateral") &&
           selection.forme !== "droit") &&
          selection.forme !== "complexe"
      },

      // ======================================================================
      // CHAMP 3 : LONGUEUR C
      // ======================================================================
      {
        id: "longueur_c",
        label: "Longueur C (cm)",
        type: "number",
        unit: "cm",
        placeholder: "Ex: 280",
        required: true,

        // Ce champ apparaît seulement pour les formes en S ou en U
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

        // Hauteur demandée pour toutes les poses sauf complexe
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
        // - Pose inclinée
        // - OU forme en V
        showIf: ({ selection }) =>
          (selection.pose === "incline" || selection.forme === "en-v") &&
          selection.forme !== "complexe"
      },
    ],

    // Aperçu dynamique
    preview: ({ selection }) => buildPreviewPath(selection)
  }
];

// ============================================================================
// FONCTION UTILITAIRE : CONSTRUCTION DU CHEMIN D'APERÇU
// ============================================================================

/**
 * buildPreviewPath() = construire le chemin de l'image d'aperçu
 *
 * Cette fonction centralise la logique de construction du chemin.
 * Elle est réutilisée par toutes les étapes pour éviter la duplication.
 *
 * Le chemin suit ce pattern :
 * assets/images/configurateur/previews/barres/{type}/{pose}/{type}-{forme}-{pose}.webp
 *
 * Exemple :
 * assets/images/configurateur/previews/barres/5-barres/sol/5-barres-droit-sol.webp
 *
 * @param {Object} selection - L'objet contenant tous les choix de l'utilisateur
 * @returns {string|null} - Le chemin de l'image ou null si le type n'est pas sélectionné
 */
function buildPreviewPath(selection) {
  // Si le type n'est pas encore sélectionné, pas d'aperçu
  if (!selection.type) return null;

  // Extraire les valeurs (avec valeurs par défaut si non définies)
  const type  = selection.type;
  const forme = selection.forme || "droit";    // Par défaut : droit
  const pose  = selection.pose || "sol";       // Par défaut : sol

  // Construire le chemin avec un template string
  // ${variable} = insérer la valeur de la variable dans la string
  return `assets/images/configurateur/previews/barres/${type}/${pose}/${type}-${forme}-${pose}.webp`;
}

// ============================================================================
// FONCTION UTILITAIRE : VALIDATION DE COMPATIBILITÉ POSE/FORME
// ============================================================================

/**
 * isPoseValidForForme() = vérifier si une pose est compatible avec une forme
 *
 * Cette fonction implémente les règles métier de compatibilité.
 *
 * Règles actuelles :
 * - Pose "incline" : uniquement valable pour forme "droit"
 * - Poses "sol" et "lateral" : valables pour toutes les formes
 *
 * @param {string} pose - Le type de pose (sol, lateral, incline)
 * @param {string} forme - La forme du garde-corps (droit, en-v, en-l, etc.)
 * @returns {boolean} - true si la combinaison est valide, false sinon
 */
function isPoseValidForForme(pose, forme) {
  // Règle spéciale : pose inclinée seulement pour forme droite
  if (pose === "incline") {
    // return = retourner true ou false selon la condition
    return forme === "droit";
  }

  // Pour les autres poses (sol, lateral), toutes les formes sont OK
  // || = OU logique (au moins une condition doit être vraie)
  return pose === "sol" || pose === "lateral";
}

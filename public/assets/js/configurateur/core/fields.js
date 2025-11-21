/**
 * ============================================================================
 * core/fields.js — Générateur de champs de formulaire
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier crée les différents types de champs du formulaire :
 * - Choix multiples (cards, radios, select)
 * - Nombres (input number)
 * - Texte (input text)
 * - Cases à cocher (checkbox)
 * - Curseurs (range slider)
 *
 * 📚 FONCTIONNEMENT :
 * Pour chaque champ défini dans steps.js, cette fonction :
 * 1. Crée l'élément HTML approprié (boutons, input, select...)
 * 2. Gère les événements (clic, changement, saisie)
 * 3. Met à jour la sélection de l'utilisateur
 * 4. Déclenche le rafraîchissement de l'interface
 *
 * 💡 CONCEPTS JAVASCRIPT UTILISÉS :
 * - Switch/case pour gérer différents types
 * - Event listeners (addEventListener)
 * - Manipulation du DOM
 * - Gestion d'état (selection)
 */

// ============================================================================
// IMPORTATIONS
// ============================================================================

// Importer les fonctions utilitaires nécessaires
import {
  el,                   // Créer des éléments HTML
  text,                 // Créer des nœuds de texte
  normalizeOptions,     // Uniformiser le format des options
  resolveMaybeFn        // Résoudre une valeur ou une fonction
} from "./utils.js";

// ============================================================================
// FONCTION PRINCIPALE : RENDU D'UN CHAMP
// ============================================================================

/**
 * renderField() = créer l'élément HTML d'un champ de formulaire
 *
 * Cette fonction est appelée pour chaque champ de l'étape courante.
 * Elle analyse le type du champ et crée l'interface correspondante.
 *
 * @param {Object} params - Paramètres
 * @param {Object} params.step - L'étape courante
 * @param {Object} params.field - La définition du champ à créer
 * @param {Object} params.ctx - Le contexte global (selection, data, fonctions...)
 * @returns {HTMLElement} - L'élément HTML du champ prêt à être inséré
 */
export function renderField({ step, field, ctx }) {
  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES DU CONTEXTE
  // --------------------------------------------------------------------------

  // Destructuration = extraire plusieurs propriétés d'un objet en une ligne
  const { selection, stepsArr, data, clearSelectionsBeyond, rerenderAll } = ctx;

  // --------------------------------------------------------------------------
  // CRÉATION DU CONTENEUR DU CHAMP
  // --------------------------------------------------------------------------

  // Chaque champ est enveloppé dans un <div> avec un id unique
  // Cet id permet de cibler le champ pour le scroll ou le focus
  const $wrap = el("div", { 
    id: `field-${field.id}`,      // Ex: field-typeId, field-longueur_a
    className: "cfg-field"          // Classe CSS pour le style
  });

  // --------------------------------------------------------------------------
  // GESTION DES ERREURS DE VALIDATION
  // --------------------------------------------------------------------------

  // Vérifier si ce champ est dans la liste des champs invalides
  // has() = méthode des Set pour tester la présence d'une valeur
  const hasError = ctx.invalidFields.has(field.id);

  // Si le champ a une erreur, ajouter une classe CSS pour le style
  if (hasError) {
    // classList.add() = ajouter une classe CSS
    $wrap.classList.add("cfg-field-error");
  }

  // --------------------------------------------------------------------------
  // CRÉATION DE L'ÉTIQUETTE (LABEL)
  // --------------------------------------------------------------------------

  // L'étiquette affiche le nom du champ
  // ?? = si field.label n'existe pas, utiliser field.id
  const $label = el("div", { class: "cfg-label" }, text(field.label ?? field.id));

  // --------------------------------------------------------------------------
  // CRÉATION DE L'AIDE (DESCRIPTION OPTIONNELLE)
  // --------------------------------------------------------------------------

  // Si le champ a une aide (field.help), on crée un élément pour l'afficher
  // ? : = opérateur ternaire (si condition ? valeur_si_vrai : valeur_si_faux)
  const $help = field.help 
    ? el("div", { class: "cfg-help" }, text(field.help)) 
    : null;  // null = pas d'aide

  // --------------------------------------------------------------------------
  // ASSEMBLAGE DU LABEL ET DE L'AIDE
  // --------------------------------------------------------------------------

  // appendChild() = ajouter un élément enfant
  $wrap.appendChild($label);    // Ajouter l'étiquette

  // Si l'aide existe (n'est pas null), l'ajouter aussi
  if ($help) {
    $wrap.appendChild($help);
  }

  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DE LA VALEUR ACTUELLE
  // --------------------------------------------------------------------------

  // Chercher si l'utilisateur a déjà saisi une valeur pour ce champ
  // selection[field.id] peut être undefined si jamais rempli
  const value = selection[field.id];

  // --------------------------------------------------------------------------
  // CRÉATION DU CHAMP SELON SON TYPE
  // --------------------------------------------------------------------------

  // switch = structure de contrôle pour gérer plusieurs cas
  // On crée un champ différent selon field.type
  switch (field.type) {

    // ========================================================================
    // TYPE 1 : CHOICE (Choix parmi plusieurs options)
    // ========================================================================
    case "choice": {
      // ----------------------------------------------------------------------
      // NORMALISATION DES OPTIONS
      // ----------------------------------------------------------------------

      // Les options peuvent être :
      // - Un tableau : ["Option 1", "Option 2"]
      // - Des objets : [{ value: 1, label: "Option 1" }]
      // - Une fonction : (ctx) => [...options dynamiques...]

      // resolveMaybeFn() = si field.options est une fonction, l'exécuter
      // normalizeOptions() = convertir en format uniforme [{ value, label, image }]
      const opts = normalizeOptions(
        resolveMaybeFn(field.options, { selection, step, steps: stepsArr, data })
      );

      // ----------------------------------------------------------------------
      // CHOIX DU TYPE D'INTERFACE
      // ----------------------------------------------------------------------

      // field.ui détermine comment afficher les options :
      // - "cards" = cartes cliquables avec images (par défaut)
      // - "radios" = boutons radio classiques
      // - "select" = liste déroulante <select>
      const ui = field.ui || "cards";

      // ====================================================================
      // INTERFACE "CARDS" (Cartes cliquables)
      // ====================================================================
      if (ui === "cards") {
        // Conteneur en grille pour les cartes
        const $grid = el("div", { class: "cfg-cards" });

        // Boucle sur chaque option pour créer une carte
        // forEach() = parcourir le tableau
        opts.forEach(opt => {
          // Créer un élément carte
          // Active si la valeur correspond à la sélection actuelle
          const $card = el("div", {
            // Classe "active" si cette carte est sélectionnée
            class: `cfg-card ${value === opt.value ? "active" : ""}`,
            role: "button",        // Pour l'accessibilité (lecteur d'écran)
            tabIndex: 0            // Permettre la navigation au clavier
          });

          // Si l'option a une image, l'ajouter à la carte
          if (opt.image) {
            // new Image() = créer un élément <img>
            const img = new Image();
            img.src = opt.image;                      // URL de l'image
            img.alt = opt.label ?? opt.value;         // Texte alternatif
            $card.appendChild(img);                   // Ajouter l'image à la carte
          }

          // Ajouter le label (texte de l'option)
          $card.appendChild(el("div", {}, text(opt.label ?? opt.value)));

          // ------------------------------------------------------------------
          // GESTION DU CLIC SUR LA CARTE
          // ------------------------------------------------------------------

          // addEventListener() = écouter un événement
          $card.addEventListener("click", () => {
            // ----------------------------------------------------------------
            // ÉTAPE 1 : METTRE À JOUR LA SÉLECTION
            // ----------------------------------------------------------------

            // Enregistrer le choix de l'utilisateur
            selection[field.id] = opt.value;

            // ----------------------------------------------------------------
            // ÉTAPE 2 : EFFACER L'ERREUR DE VALIDATION SI PRÉSENTE
            // ----------------------------------------------------------------

            // delete() = retirer un élément d'un Set
            ctx.invalidFields.delete(field.id);

            // Effacer le message d'erreur global
            ctx.requiredErrorMessage = "";

            // ----------------------------------------------------------------
            // ÉTAPE 3 : EXÉCUTER LE HOOK onChange (SI DÉFINI)
            // ----------------------------------------------------------------

            // try/catch = gérer les erreurs
            try {
              // Si le dataset a défini une fonction onChange pour ce champ
              if (typeof field.onChange === "function") {
                // Exécuter cette fonction avec le contexte
                field.onChange({ selection, step, steps: stepsArr, data });
              }
            } catch (e) {
              // En cas d'erreur, l'afficher dans la console mais continuer
              console.warn("onChange error:", e);
            }

            // ----------------------------------------------------------------
            // ÉTAPE 4 : NETTOYER LES ÉTAPES SUIVANTES
            // ----------------------------------------------------------------

            // Quand on change un choix, les étapes suivantes peuvent devenir invalides
            // Par exemple : si on change le type, la finition doit être recalculée

            // preserveOnChange = liste des champs à ne pas effacer (optionnel)
            const preserve = step.preserveOnChange || [];

            // Effacer les sélections des étapes d'après
            clearSelectionsBeyond(step, { preserve });

            // ----------------------------------------------------------------
            // ÉTAPE 5 : RAFRAÎCHIR L'INTERFACE
            // ----------------------------------------------------------------

            // Redessiner toute l'interface pour refléter les changements
            rerenderAll();
          });

          // Ajouter la carte à la grille
          $grid.appendChild($card);
        });

        // Ajouter la grille au conteneur du champ
        $wrap.appendChild($grid);

      // ====================================================================
      // INTERFACE "RADIOS" (Boutons radio)
      // ====================================================================
      } else if (ui === "radios") {
        // Conteneur en grille pour les boutons radio
        const $list = el("div", { style: "display:grid; gap:6px" });

        // Boucle sur chaque option
        opts.forEach(opt => {
          // Créer un id unique pour le bouton radio
          // replace(/\W+/g, "") = enlever tous les caractères non alphanumériques
          const id = `r_${field.id}_${String(opt.value).replace(/\W+/g, "")}`;

          // Créer un label (étiquette cliquable)
          const $row = el("label", {
            for: id,  // Associer au bouton radio
            style: "display:flex; gap:8px; align-items:center;"
          });

          // Créer le bouton radio (<input type="radio">)
          const $input = el("input", {
            id,                              // Id unique
            type: "radio",                   // Type radio
            name: field.id,                  // Groupe (un seul sélectionnable)
            checked: value === opt.value     // Coché si c'est la valeur actuelle
          });

          // ------------------------------------------------------------------
          // GESTION DU CHANGEMENT
          // ------------------------------------------------------------------

          // addEventListener("change") = quand on clique sur un radio
          $input.addEventListener("change", () => {
            // Mettre à jour la sélection
            selection[field.id] = opt.value;

            // Effacer les erreurs
            ctx.invalidFields.delete(field.id);
            ctx.requiredErrorMessage = "";

            // Nettoyer les étapes suivantes et rafraîchir
            clearSelectionsBeyond(step);
            rerenderAll();
          });

          // Ajouter le bouton radio au label
          $row.appendChild($input);

          // Si l'option a une image, l'ajouter
          if (opt.image) {
            const img = new Image();
            img.src = opt.image;
            img.alt = opt.label ?? opt.value;
            img.style.height = "40px";       // Taille fixe
            $row.appendChild(img);
          }

          // Ajouter le texte de l'option
          $row.appendChild(text(opt.label ?? opt.value));

          // Ajouter la ligne à la liste
          $list.appendChild($row);
        });

        // Ajouter la liste au conteneur du champ
        $wrap.appendChild($list);

      // ====================================================================
      // INTERFACE "SELECT" (Liste déroulante)
      // ====================================================================
      } else {
        // Créer un élément <select>
        const $sel = el("select");

        // Ajouter une première option vide "-- Choisir --"
        $sel.appendChild(el("option", { value: "" }, text("-- Choisir --")));

        // Ajouter chaque option
        opts.forEach(opt => {
          const $o = el("option", {
            value: opt.value,                // Valeur de l'option
            selected: value === opt.value    // Sélectionnée si c'est la valeur actuelle
          }, text(opt.label ?? opt.value));

          $sel.appendChild($o);
        });

        // ------------------------------------------------------------------
        // GESTION DU CHANGEMENT
        // ------------------------------------------------------------------

        $sel.addEventListener("change", () => {
          // $sel.value = valeur sélectionnée (string)
          // || undefined = si vide, stocker undefined
          selection[field.id] = $sel.value || undefined;

          // Effacer les erreurs
          ctx.invalidFields.delete(field.id);
          ctx.requiredErrorMessage = "";

          // Nettoyer et rafraîchir
          clearSelectionsBeyond(step);
          rerenderAll();
        });

        // Ajouter le select au conteneur
        $wrap.appendChild($sel);
      }

      // break = sortir du switch (ne pas exécuter les autres cas)
      break;
    }

    // ========================================================================
    // TYPE 2 : NUMBER (Champ numérique)
    // ========================================================================
    case "number": {
      // Créer un input de type number
      const $inp = el("input", {
        type: "number",                      // Type numérique
        value: value ?? "",                  // Valeur actuelle (ou vide)
        placeholder: field.placeholder ?? "", // Texte indicatif
        min: field.min ?? undefined,         // Valeur minimale
        max: field.max ?? undefined,         // Valeur maximale
        step: field.step ?? "any"            // Incrément (any = décimales autorisées)
      });

      // ----------------------------------------------------------------------
      // GESTION DE LA SAISIE
      // ----------------------------------------------------------------------

      // "input" = déclenché à chaque caractère tapé
      $inp.addEventListener("input", () => {
        // Convertir en nombre, ou undefined si vide
        // Number() = convertir une string en nombre
        selection[field.id] = $inp.value === "" ? undefined : Number($inp.value);

        // Effacer les erreurs
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      // Ajouter l'input au conteneur
      $wrap.appendChild($inp);

      // Si le champ a une unité (cm, kg...), l'afficher
      if (field.unit) {
        $wrap.appendChild(
          el("div", { class: "cfg-help" }, text(`Unité : ${field.unit}`))
        );
      }

      break;
    }

    // ========================================================================
    // TYPE 3 : TEXT (Champ texte)
    // ========================================================================
    case "text": {
      // Créer un input de type text
      const $inp = el("input", {
        type: "text",                        // Type texte
        value: value ?? "",                  // Valeur actuelle
        placeholder: field.placeholder ?? "" // Placeholder
      });

      // ----------------------------------------------------------------------
      // GESTION DE LA SAISIE
      // ----------------------------------------------------------------------

      $inp.addEventListener("input", () => {
        // Stocker la valeur (ou undefined si vide)
        selection[field.id] = $inp.value || undefined;

        // Effacer les erreurs
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      // Ajouter l'input au conteneur
      $wrap.appendChild($inp);
      break;
    }

    // ========================================================================
    // TYPE 4 : BOOLEAN (Case à cocher)
    // ========================================================================
    case "boolean": {
      // Créer une checkbox
      const $inp = el("input", { 
        type: "checkbox",              // Type checkbox
        checked: Boolean(value)        // Coché si value est true
      });

      // ----------------------------------------------------------------------
      // GESTION DU CHANGEMENT
      // ----------------------------------------------------------------------

      // "change" = déclenché quand on coche/décoche
      $inp.addEventListener("change", () => {
        // $inp.checked = true si coché, false sinon
        selection[field.id] = $inp.checked;

        // Effacer les erreurs
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      // Ajouter la checkbox au conteneur
      $wrap.appendChild($inp);
      break;
    }

    // ========================================================================
    // TYPE 5 : RANGE (Curseur)
    // ========================================================================
    case "range": {
      // Créer un curseur (slider)
      const $inp = el("input", {
        type: "range",                       // Type range (curseur)
        value: value ?? field.min ?? 0,      // Valeur actuelle (ou min)
        min: field.min ?? 0,                 // Minimum
        max: field.max ?? 100,               // Maximum
        step: field.step ?? 1                // Pas (incrément)
      });

      // Créer un élément pour afficher la valeur
      const $out = el("span", {}, text(String($inp.value)));

      // ----------------------------------------------------------------------
      // GESTION DU DÉPLACEMENT DU CURSEUR
      // ----------------------------------------------------------------------

      $inp.addEventListener("input", () => {
        // Mettre à jour la sélection
        selection[field.id] = Number($inp.value);

        // Mettre à jour l'affichage de la valeur
        // textContent = modifier le contenu texte d'un élément
        $out.textContent = String($inp.value);

        // Effacer les erreurs
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      // Ajouter le curseur et l'affichage de la valeur
      $wrap.appendChild($inp);
      $wrap.appendChild(el("div", {}, $out));
      break;
    }

    // ========================================================================
    // TYPE INCONNU (Par défaut)
    // ========================================================================
    default: {
      // Si le type n'est pas reconnu, afficher un message d'erreur
      $wrap.appendChild(
        el("div", { class: "cfg-help" }, text(`Type de champ inconnu: ${field.type}`))
      );
    }
  }

  // --------------------------------------------------------------------------
  // AFFICHAGE DU MESSAGE D'ERREUR SI NÉCESSAIRE
  // --------------------------------------------------------------------------

  // Si le champ a une erreur, ajouter un message sous le champ
  if (hasError) {
    $wrap.appendChild(
      el("div", { class: "cfg-field-error-msg" }, text("Ce champ est requis."))
    );
  }

  // --------------------------------------------------------------------------
  // RETOUR DU CONTENEUR COMPLET
  // --------------------------------------------------------------------------

  // Retourner l'élément HTML complet prêt à être inséré dans la page
  return $wrap;
}

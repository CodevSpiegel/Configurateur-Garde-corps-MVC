/**
 * ============================================================================
 * core/renderers.js — Moteur de rendu de l'interface utilisateur (PARTIE 1/2)
 * ============================================================================
 *
 * 🎯 RÔLE DE CE FICHIER :
 * Ce fichier contient toutes les fonctions qui "dessinent" l'interface :
 * - La barre latérale (sidebar) avec les étapes
 * - Le formulaire de l'étape courante
 * - Les boutons de navigation (Précédent/Suivant)
 * - La modal de résumé final
 * - La notification de succès (toast)
 *
 * 📚 FONCTIONS PRINCIPALES :
 * - showSummaryModal() = afficher le résumé avant validation
 * - renderSidebar() = dessiner la liste des étapes
 * - renderStep() = dessiner le formulaire de l'étape courante
 * - renderNav() = dessiner les boutons de navigation
 * - makePredicates() = créer les fonctions de test de visibilité
 * - showToast() = afficher une notification de succès/erreur
 *
 * 💡 CONCEPTS JAVASCRIPT UTILISÉS :
 * - Manipulation du DOM
 * - Événements (addEventListener)
 * - Fetch API (requêtes HTTP)
 * - Async/await (promesses)
 * - Gestion d'erreurs (try/catch)
 */

// ============================================================================
// IMPORTATIONS
// ============================================================================

// Importer les fonctions utilitaires
import {
  el,               // Créer des éléments HTML
  text,             // Créer des nœuds de texte
  escapeHtml,       // Sécuriser du texte HTML
  resolveMaybeFn    // Résoudre une valeur ou une fonction
} from "./utils.js";

// Importer la fonction de rendu des champs
import { renderField } from "./fields.js";

// ============================================================================
// FONCTION : MODAL DE RÉSUMÉ FINAL
// ============================================================================

/**
 * showSummaryModal() = afficher une fenêtre modale avec le résumé de la configuration
 *
 * Cette modal s'affiche quand l'utilisateur clique sur "Terminer".
 * Elle récapitule tous les choix effectués et propose de :
 * - Modifier = retourner au configurateur
 * - Confirmer = envoyer le devis au serveur
 *
 * @param {Object} params - Paramètres
 * @param {Object} params.containers - Les conteneurs DOM
 * @param {Object} params.ctx - Le contexte (selection, steps, data...)
 * @param {Function} params.onConfirm - Fonction à appeler si l'utilisateur confirme
 */
function showSummaryModal({ containers, ctx, onConfirm }) {
  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES
  // --------------------------------------------------------------------------

  // Destructuration pour extraire les éléments nécessaires
  const { mount } = containers;
  const { stepsArr, selection, shouldShowField, isStepVisible, data } = ctx;

  // --------------------------------------------------------------------------
  // CRÉATION DE LA STRUCTURE DE LA MODAL
  // --------------------------------------------------------------------------

  // Backdrop = fond sombre semi-transparent qui couvre toute la page
  const $backdrop = el("div", { class: "cfg-modal-backdrop" });

  // La modal elle-même (fenêtre centrale)
  // role et ariaModal = attributs d'accessibilité pour les lecteurs d'écran
  const $modal = el("div", {
    class: "cfg-modal",
    role: "dialog",       // Indique que c'est une boîte de dialogue
    ariaModal: "true"     // Indique que c'est une modal (bloque l'interaction avec le reste)
  });

  // --------------------------------------------------------------------------
  // EN-TÊTE DE LA MODAL
  // --------------------------------------------------------------------------

  // Header avec le titre
  const $header = el("header", {},
    el("h3", {}, text("Résumé de votre configuration"))
  );

  // --------------------------------------------------------------------------
  // CONTENU DE LA MODAL
  // --------------------------------------------------------------------------

  // Main = zone principale qui contiendra le résumé
  const $main = el("main");

  // --------------------------------------------------------------------------
  // PIED DE PAGE DE LA MODAL (BOUTONS)
  // --------------------------------------------------------------------------

  // Footer avec les boutons d'action
  const $footer = el("footer", {},
    el("div", { class: "actions" },
      // Bouton "Modifier" = fermer la modal et retourner au configurateur
      el("button", {
        className: "cfg-btn-secondary",
        // onclick = événement au clic
        // removeChild() = supprimer un élément du DOM
        onclick: () => document.body.removeChild($backdrop) 
      }, text("Modifier")),

      // Bouton "Confirmer" = fermer la modal et appeler onConfirm
      el("button", {
        className: "cfg-btn-primary",
        onclick: () => {
          document.body.removeChild($backdrop);  // Fermer la modal
          onConfirm?.();  // ?. = optional chaining (appeler seulement si onConfirm existe)
        }
      }, text("Confirmer"))
    )
  );

  // --------------------------------------------------------------------------
  // CONSTRUCTION DU RÉSUMÉ
  // --------------------------------------------------------------------------

  // <dl> = definition list (liste de définitions HTML)
  // Structure : <dt>Terme</dt><dd>Définition</dd>
  const $dl = el("dl", { class: "cfg-summary-grid" });

  // Parcourir toutes les étapes
  // forEach() = boucle sur chaque élément du tableau
  stepsArr.forEach(step => {
    // Si l'étape n'est pas visible, l'ignorer
    // return = sortir de la fonction (passer à l'étape suivante)
    if (!isStepVisible(step)) return;

    // Parcourir tous les champs de l'étape
    // ?? [] = si fields est null/undefined, utiliser un tableau vide
    (step.fields ?? []).forEach(field => {
      // Si le champ n'est pas visible, l'ignorer
      if (!shouldShowField(field)) return;

      // Récupérer le label du champ (nom affiché à l'utilisateur)
      const label = field.label ?? field.id;

      // Récupérer la valeur sélectionnée par l'utilisateur
      let value = selection[field.id];

      // Si la valeur est vide (undefined, "", null), l'ignorer
      if (value === undefined || value === "" || value === null) return;

      // ----------------------------------------------------------------------
      // AMÉLIORATION : AFFICHER LE LABEL HUMAIN AU LIEU DE LA VALEUR BRUTE
      // ----------------------------------------------------------------------

      // Pour les champs de type "choice", essayer de trouver le label
      // Exemple : au lieu d'afficher "1", afficher "Barres horizontales"

      try {
        if (field.type === "choice") {
          // Récupérer les options du champ
          // Si field.options est une fonction, l'exécuter pour obtenir les options
          const optsRaw = typeof field.options === "function"
            ? field.options({ selection, step, steps: stepsArr, data })
            : field.options;

          // Normaliser les options en tableau
          const opts = Array.isArray(optsRaw)
            ? optsRaw  // Déjà un tableau
            : (optsRaw && typeof optsRaw === "object")
              // Si c'est un objet, convertir en tableau
              ? Object.keys(optsRaw).map(k => optsRaw[k])
              : [];  // Sinon tableau vide

          // Chercher l'option qui correspond à la valeur sélectionnée
          // find() = trouver le premier élément qui satisfait la condition
          const found = opts.find(o =>
            (o?.value ?? o?.id ?? o) === value
          );

          // Si trouvé, utiliser le label de l'option
          if (found) {
            value = found.label ?? String(found.value ?? value);
          }
        }
      } catch {
        // En cas d'erreur, on garde simplement la valeur brute
        // Pas grave, c'est juste un bonus d'afficher le label
      }

      // ----------------------------------------------------------------------
      // AJOUT AU RÉSUMÉ
      // ----------------------------------------------------------------------

      // <dt> = term (terme de la définition) = le label du champ
      $dl.appendChild(el("dt", {}, text(label)));

      // <dd> = definition (définition du terme) = la valeur
      // String() = convertir en chaîne de caractères
      $dl.appendChild(el("dd", {}, text(String(value))));
    });
  });

  // --------------------------------------------------------------------------
  // ASSEMBLAGE DE LA MODAL
  // --------------------------------------------------------------------------

  // Ajouter le résumé au contenu principal
  $main.appendChild($dl);

  // Assembler la modal : header + main + footer
  $modal.appendChild($header);
  $modal.appendChild($main);
  $modal.appendChild($footer);

  // Ajouter la modal au backdrop
  $backdrop.appendChild($modal);

  // Ajouter le backdrop au body (afficher la modal à l'écran)
  document.body.appendChild($backdrop);
}

// ============================================================================
// FONCTION : RENDU DE LA BARRE LATÉRALE (SIDEBAR)
// ============================================================================

/**
 * renderSidebar() = dessiner la liste des étapes dans la barre latérale
 *
 * La sidebar affiche toutes les étapes avec :
 * - Un emoji ✅ si l'étape est complète
 * - Un emoji ⏳ si l'étape est incomplète
 * - Une classe "active" pour l'étape courante
 *
 * @param {Object} params - Paramètres
 * @param {Object} params.containers - Les conteneurs DOM
 * @param {Object} params.ctx - Le contexte
 */
export function renderSidebar({ containers, ctx }) {
  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES
  // --------------------------------------------------------------------------

  const { $sidebarContainer } = containers;
  const { 
    stepsArr,           // Liste des étapes
    isStepVisible,      // Fonction pour tester si une étape est visible
    isStepComplete,     // Fonction pour tester si une étape est complète
    getCurrentIndex,    // Fonction pour obtenir l'index de l'étape courante
    setCurrentIndex,    // Fonction pour changer d'étape
    rerenderAll         // Fonction pour rafraîchir l'interface
  } = ctx;

  // --------------------------------------------------------------------------
  // NETTOYAGE DU CONTENEUR
  // --------------------------------------------------------------------------

  // Vider le contenu existant
  // innerHTML = "" efface tout le HTML à l'intérieur
  $sidebarContainer.innerHTML = "";

  // Créer un conteneur pour la liste des étapes
  const $ul = el("div", {});

  // --------------------------------------------------------------------------
  // CRÉATION DES ÉLÉMENTS D'ÉTAPES
  // --------------------------------------------------------------------------

  // Parcourir toutes les étapes
  // forEach() avec index (idx) = position de l'étape dans le tableau
  stepsArr.forEach((step, idx) => {
    // Si l'étape n'est pas visible, l'ignorer
    if (!isStepVisible(step)) return;

    // ----------------------------------------------------------------------
    // DÉTERMINER SI L'ÉTAPE EST ACTIVE
    // ----------------------------------------------------------------------

    // isActive = true si c'est l'étape courante
    // === = égalité stricte (même type et même valeur)
    const isActive = idx === getCurrentIndex();

    // Créer l'élément de l'étape avec la classe appropriée
    // Template string avec ${...} pour insérer des variables
    const $li = el("div", {
      class: `cfg-step-item ${isActive ? "active" : ""}`
    });

    // ----------------------------------------------------------------------
    // GESTION DU CLIC SUR L'ÉTAPE
    // ----------------------------------------------------------------------

    // Quand on clique sur une étape, y naviguer
    $li.addEventListener("click", () => {
      // Changer l'index de l'étape courante
      setCurrentIndex(idx);

      // Effacer les erreurs de validation (car on change d'étape)
      ctx.clearRequiredErrors();

      // Rafraîchir toute l'interface
      rerenderAll();
    });

    // ----------------------------------------------------------------------
    // AFFICHAGE DU STATUT ET DU LABEL
    // ----------------------------------------------------------------------

    // Déterminer l'emoji selon si l'étape est complète ou non
    // ? : = opérateur ternaire (condition ? si_vrai : si_faux)
    const status = isStepComplete(step) ? "✅" : "⏳";

    // Ajouter le texte : emoji + label de l'étape
    $li.appendChild(text(`${status} ${step.label ?? step.id}`));

    // Ajouter l'élément à la liste
    $ul.appendChild($li);
  });

  // --------------------------------------------------------------------------
  // INSERTION DANS LE CONTENEUR
  // --------------------------------------------------------------------------

  // Ajouter la liste complète au conteneur de la sidebar
  $sidebarContainer.appendChild($ul);
}
/**
 * ============================================================================
 * core/renderers.js — Moteur de rendu de l'interface utilisateur (PARTIE 2/2)
 * ============================================================================
 *
 * Cette partie contient :
 * - renderStep() = affichage du formulaire de l'étape courante
 * - renderNav() = affichage des boutons de navigation
 * - makePredicates() = fonctions de test de visibilité
 * - showToast() = notification de succès/erreur
 */

// ============================================================================
// FONCTION : RENDU DE L'ÉTAPE COURANTE
// ============================================================================

/**
 * renderStep() = dessiner le formulaire de l'étape courante
 *
 * Cette fonction affiche :
 * - Le titre et la description de l'étape
 * - Les champs du formulaire
 * - L'aperçu visuel (preview)
 * - Les messages d'erreur éventuels
 *
 * @param {Object} params - Paramètres
 * @param {Object} params.containers - Les conteneurs DOM
 * @param {Object} params.ctx - Le contexte
 */
export function renderStep({ containers, ctx }) {
  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES
  // --------------------------------------------------------------------------

  const { $fieldsContainer, $previewContainer } = containers;
  const {
    stepsArr,           // Liste des étapes
    selection,          // Sélections de l'utilisateur
    data,               // Données externes
    getCurrentIndex,    // Index de l'étape courante
    shouldShowField     // Fonction pour tester si un champ est visible
  } = ctx;

  // --------------------------------------------------------------------------
  // NETTOYAGE DES CONTENEURS
  // --------------------------------------------------------------------------

  // Vider le contenu existant des deux zones
  $fieldsContainer.innerHTML = "";
  $previewContainer.innerHTML = "";

  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DE L'ÉTAPE COURANTE
  // --------------------------------------------------------------------------

  // Obtenir l'étape à afficher depuis le tableau
  const step = stepsArr[getCurrentIndex()];

  // Si l'étape n'existe pas, sortir de la fonction
  // (ne devrait pas arriver, mais sécurité)
  if (!step) return;

  // --------------------------------------------------------------------------
  // CRÉATION DES ÉLÉMENTS DE BASE
  // --------------------------------------------------------------------------

  // Titre de l'étape (h2 = heading level 2)
  const $title = el("h2", {}, text(step.label ?? step.id));

  // Description optionnelle de l'étape
  // ? : = si step.description existe, créer un élément, sinon null
  const $desc = step.description 
    ? el("div", { class: "cfg-help" }, text(step.description)) 
    : null;

  // Conteneur pour tous les champs
  const $fields = el("div", { class: "cfg-fields" });

  // Conteneur pour les messages d'erreur de validation
  const $errors = el("div", { class: "cfg-error" });

  // --------------------------------------------------------------------------
  // BANDEAU D'ALERTE POUR CHAMPS REQUIS MANQUANTS
  // --------------------------------------------------------------------------

  // Si ctx.requiredErrorMessage contient un message, créer un bandeau
  const $banner = ctx.requiredErrorMessage
    ? el("div", { 
        class: "cfg-error-banner",  // Classe CSS pour le style
        role: "alert",              // Attribut d'accessibilité
        tabIndex: -1                // Permettre le focus programmatique
      },
        // Icône et texte en gras
        el("strong", {}, text("⚠️ Informations manquantes : ")),

        // Le message d'erreur
        el("span", {}, text(ctx.requiredErrorMessage)),

        // Bouton pour fermer le bandeau
        el("button", {
          type: "button",
          className: "cfg-error-banner-close",
          // Au clic, effacer les erreurs et rafraîchir
          onclick: () => { 
            ctx.clearRequiredErrors(); 
            renderStep({ containers, ctx }); 
          }
        }, text("×"))  // × = symbole de fermeture
      )
    : null;  // Pas d'erreur = pas de bandeau

  // --------------------------------------------------------------------------
  // RENDU DES CHAMPS
  // --------------------------------------------------------------------------

  // Filtrer les champs pour ne garder que les visibles
  // filter() = créer un nouveau tableau avec seulement les éléments qui passent le test
  const fields = (step.fields ?? []).filter(f => shouldShowField(f));

  // Créer un élément HTML pour chaque champ et l'ajouter au conteneur
  fields.forEach(field => {
    // renderField() = fonction importée de fields.js
    // Elle crée l'élément HTML du champ (input, select, cards...)
    const $f = renderField({ step, field, ctx });

    // Si l'élément a bien été créé, l'ajouter
    if ($f) {
      $fields.appendChild($f);
    }
  });

  // --------------------------------------------------------------------------
  // APERÇU VISUEL (PREVIEW)
  // --------------------------------------------------------------------------

  // Résoudre l'URL de l'aperçu
  // step.preview peut être une string ou une fonction
  // resolveMaybeFn() exécute la fonction si nécessaire
  let previewUrl = resolveMaybeFn(
    step.preview, 
    { selection, data, step, steps: stepsArr }
  );

  // Si aucun aperçu n'est défini, utiliser l'aperçu par défaut
  if ((!previewUrl || previewUrl === null) && step.defaultPreview) {
    previewUrl = step.defaultPreview;
  }

  // Créer le conteneur de l'aperçu
  const $preview = el("div", { class: "cfg-preview" }, text("Aperçu"));

  // Si on a une URL d'image, l'afficher
  if (previewUrl) {
    // Créer un élément Image
    const img = new Image();
    img.src = previewUrl;           // URL de l'image
    img.alt = "preview";            // Texte alternatif
    img.style.width = "100%";       // Largeur 100% du conteneur

    // Remplacer le texte "Aperçu" par l'image
    $preview.innerHTML = "";
    $preview.appendChild(img);
  }

  // --------------------------------------------------------------------------
  // VALIDATION MÉTIER OPTIONNELLE
  // --------------------------------------------------------------------------

  // Tableau pour collecter les erreurs de validation
  const errs = [];

  // Si l'étape a une fonction de validation personnalisée
  if (typeof step.validate === "function") {
    try {
      // Appeler la fonction validate()
      // Elle peut ajouter des erreurs via la fonction errors()
      step.validate({ 
        selection, 
        step, 
        steps: stepsArr, 
        data, 
        // Fonction callback pour ajouter des erreurs
        // (arr) => ... = fonction fléchée qui prend un tableau
        errors: (arr) => errs.push(...arr)  // ...arr = spread (étaler le tableau)
      });
    } catch (e) {
      // Si la validation plante, ajouter l'erreur au tableau
      errs.push(`Erreur validate(): ${e.message}`);
    }
  }

  // Si des erreurs ont été trouvées, les afficher
  if (errs.length) {
    // map() = transformer chaque élément du tableau
    // Créer un <div> pour chaque erreur, puis joindre en string
    $errors.innerHTML = errs
      .map(e => `<div>• ${escapeHtml(e)}</div>`)  // escapeHtml() = sécuriser le texte
      .join("");  // join() = convertir le tableau en string
  }

  // --------------------------------------------------------------------------
  // ASSEMBLAGE FINAL
  // --------------------------------------------------------------------------

  // Ajouter tous les éléments dans l'ordre
  $fieldsContainer.appendChild($title);           // 1. Titre

  if ($desc) {
    $fieldsContainer.appendChild($desc);          // 2. Description (si présente)
  }

  if ($banner) {
    $fieldsContainer.appendChild($banner);        // 3. Bandeau d'erreur (si présent)
  }

  $fieldsContainer.appendChild($fields);          // 4. Champs du formulaire

  $previewContainer.appendChild($preview);        // 5. Aperçu dans sa propre zone

  if (errs.length) {
    $fieldsContainer.appendChild($errors);        // 6. Erreurs de validation (si présentes)
  }
}

// ============================================================================
// FONCTION : RENDU DE LA NAVIGATION
// ============================================================================

/**
 * renderNav() = dessiner les boutons Précédent/Suivant
 *
 * Cette fonction gère :
 * - L'activation/désactivation des boutons
 * - La validation des champs requis
 * - L'envoi du devis au serveur (à la fin)
 *
 * @param {Object} params - Paramètres
 * @param {Object} params.containers - Les conteneurs DOM
 * @param {Object} params.ctx - Le contexte
 */
export function renderNav({ containers, ctx }) {
  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES
  // --------------------------------------------------------------------------

  const { $navContainer, mount } = containers;
  const {
    stepsArr,
    selection,
    data,
    getCurrentIndex,
    setCurrentIndex,
    shouldShowField,
    rerenderAll
  } = ctx;

  // --------------------------------------------------------------------------
  // NETTOYAGE DU CONTENEUR
  // --------------------------------------------------------------------------

  // Vider le contenu existant
  $navContainer.innerHTML = "";

  // --------------------------------------------------------------------------
  // CRÉATION DES BOUTONS
  // --------------------------------------------------------------------------

  // Bouton "Précédent"
  const $prev = el("button", {}, text("← Précédent"));

  // Vérifier si on est à la dernière étape
  const isLast = getCurrentIndex() === stepsArr.length - 1;

  // Bouton "Suivant" ou "Terminer" selon si on est à la dernière étape
  // ? : = opérateur ternaire
  const $next = el("button", {}, text(isLast ? "Terminer" : "Suivant →"));

  // Désactiver le bouton Précédent si on est à la première étape
  // disabled = attribut HTML qui désactive un bouton
  $prev.disabled = getCurrentIndex() === 0;

  // --------------------------------------------------------------------------
  // GESTION DU CLIC SUR "PRÉCÉDENT"
  // --------------------------------------------------------------------------

  $prev.addEventListener("click", () => {
    // Récupérer l'index actuel
    const i = getCurrentIndex();

    // Si on n'est pas à la première étape, reculer
    if (i > 0) {
      // Reculer d'une étape
      setCurrentIndex(i - 1);

      // Effacer les erreurs (car on change d'étape)
      ctx.clearRequiredErrors();

      // Rafraîchir l'interface
      rerenderAll();
    }
  });

  // --------------------------------------------------------------------------
  // GESTION DU CLIC SUR "SUIVANT" / "TERMINER"
  // --------------------------------------------------------------------------

  $next.addEventListener("click", () => {
    // Récupérer l'index actuel et l'étape
    const i = getCurrentIndex();
    const step = stepsArr[i];

    // ========================================================================
    // VALIDATION DES CHAMPS REQUIS
    // ========================================================================

    // Filtrer pour obtenir uniquement les champs visibles
    const visibleFields = (step.fields ?? []).filter(f => shouldShowField(f));

    // Trouver les champs requis qui ne sont pas remplis
    // filter() = garder seulement les champs qui passent le test
    const missing = visibleFields.filter(f =>
      // f.required = le champ est requis
      // && = ET logique (les deux conditions doivent être vraies)
      // === = égalité stricte
      f.required && (
        selection[f.id] === undefined ||
        selection[f.id] === "" ||
        selection[f.id] === null
      )
    );

    // Si des champs requis sont manquants
    if (missing.length) {
      // ----------------------------------------------------------------------
      // AFFICHER LES ERREURS
      // ----------------------------------------------------------------------

      // Extraire les id des champs manquants
      // map() = transformer chaque élément (ici, extraire juste l'id)
      const ids = missing.map(f => f.id);

      // Construire le message d'erreur
      // join(", ") = joindre avec des virgules
      const msg = "Veuillez compléter : " + missing
        .map(f => f.label ?? f.id)
        .join(", ");

      // Enregistrer les erreurs dans le contexte
      ctx.setRequiredErrors(ids, msg);

      // Rafraîchir pour afficher les erreurs
      rerenderAll();

      // ----------------------------------------------------------------------
      // SCROLL VERS LE PREMIER CHAMP INVALIDE
      // ----------------------------------------------------------------------

      // Récupérer l'id du premier champ manquant
      const firstId = missing[0].id;

      // Chercher l'élément HTML correspondant
      const $first = document.getElementById(`field-${firstId}`);

      if ($first) {
        // scrollIntoView() = faire défiler la page pour voir l'élément
        $first.scrollIntoView({
          behavior: "smooth",  // Animation fluide
          block: "center"      // Centrer l'élément dans la fenêtre
        });

        // Chercher un élément interactif à l'intérieur (input, select...)
        // querySelector() = chercher le premier élément qui correspond
        const focusable = $first.querySelector("input, select, button, [tabindex]");

        // focus() = donner le focus (activer) l'élément
        // ?. = optional chaining (appeler seulement si la fonction existe)
        (focusable || $first).focus?.();
      }

      // Sortir de la fonction (ne pas continuer)
      return;
    }

    // ========================================================================
    // VALIDATION MÉTIER OPTIONNELLE
    // ========================================================================

    // Si l'étape a une fonction de validation personnalisée
    if (typeof step.validate === "function") {
      // Tableau pour collecter les erreurs
      const errs = [];

      try {
        // Appeler la fonction de validation
        step.validate({
          selection,
          step,
          steps: stepsArr,
          data,
          errors: (arr) => errs.push(...arr)
        });
      } catch (e) {
        // En cas d'erreur, l'ajouter au tableau
        errs.push(e.message || String(e));
      }

      // Si des erreurs ont été trouvées
      if (errs.length) {
        // Afficher une alerte (popup native du navigateur)
        // join("\n- ") = joindre avec des retours à la ligne et des tirets
        alert("Erreurs:\n- " + errs.join("\n- "));

        // Sortir de la fonction (ne pas continuer)
        return;
      }
    }

    // ========================================================================
    // NAVIGATION OU TERMINAISON
    // ========================================================================

    // Si on n'est pas à la dernière étape
    if (i < stepsArr.length - 1) {
      // Avancer à l'étape suivante
      setCurrentIndex(i + 1);

      // Effacer les erreurs
      ctx.clearRequiredErrors();

      // Rafraîchir l'interface
      rerenderAll();

    } else {
      // ======================================================================
      // DERNIÈRE ÉTAPE : AFFICHER LA MODAL DE RÉSUMÉ
      // ======================================================================

      showSummaryModal({
        containers,
        ctx,
        // Fonction appelée quand l'utilisateur confirme
        // async = fonction asynchrone (peut utiliser await)
        onConfirm: async () => {
          // try/catch = gérer les erreurs
          try {
            // ==================================================================
            // FONCTIONS UTILITAIRES LOCALES
            // ==================================================================

            // S'assurer qu'une URL se termine par /
            const ensureSlash = (u) =>
              (u && u.endsWith('/')) ? u : (u ? u + '/' : '/');

            // Convertir une valeur en entier
            // isNaN() = tester si ce n'est pas un nombre
            const toInt = (v) =>
              (v === undefined || v === null || v === '' || isNaN(v))
                ? null
                : parseInt(v, 10);  // parseInt() = convertir en entier (base 10)

            // Tester si une valeur ressemble à un nombre
            // /^\d+$/ = regex qui teste si c'est uniquement des chiffres
            const isNumLike = (v) =>
              (typeof v === 'number') || (/^\d+$/).test(String(v ?? ''));

            // ==================================================================
            // FONCTION : RÉSOUDRE UN ID DEPUIS LA SÉLECTION
            // ==================================================================

            // Cette fonction cherche l'ID numérique d'une option sélectionnée
            // Elle essaie plusieurs stratégies car les datasets ne sont pas uniformes
            const resolveId = (fieldKey) => {
              // Récupérer la valeur brute
              const raw = selection?.[fieldKey];

              // Certains datasets stockent aussi un champ avec "Id" à la fin
              const rawId = selection?.[fieldKey + 'Id'];

              // Si raw ou rawId est déjà un nombre, le retourner
              if (isNumLike(raw)) return toInt(raw);
              if (isNumLike(rawId)) return toInt(rawId);

              // Sinon, chercher dans les options du champ
              // Récupérer la liste des étapes (avec sécurité)
              const steps = Array.isArray(ctx?.stepsArr) ? ctx.stepsArr : [];

              // Trouver l'étape qui contient ce champ
              // find() = trouver le premier élément qui passe le test
              // some() = tester si au moins un élément passe le test
              const stepDef = steps.find(st =>
                Array.isArray(st.fields) &&
                st.fields.some(f => f.id === fieldKey)
              );

              // Si l'étape n'existe pas, retourner null
              if (!stepDef) return null;

              // Trouver le champ dans l'étape
              const fieldDef = stepDef.fields.find(f => f.id === fieldKey);

              // Récupérer les options du champ
              const opts = Array.isArray(fieldDef?.options)
                ? fieldDef.options
                : (typeof fieldDef?.options === 'function'
                    ? (fieldDef.options({ selection }) || [])
                    : []);

              // Si la valeur est une string, chercher l'option correspondante
              if (typeof raw === 'string') {
                const opt = opts.find(o =>
                  o && (o.value === raw || o.slug === raw)
                );

                if (opt) {
                  // Retourner l'id de l'option (si c'est un nombre)
                  if (typeof opt.id === 'number') return opt.id;
                  if (opt.id && isNumLike(opt.id)) return toInt(opt.id);
                  if (opt.value && isNumLike(opt.value)) return toInt(opt.value);
                }
              }

              // Aucun ID trouvé
              return null;
            };

            // ==================================================================
            // CONSTRUCTION DU PAYLOAD (DONNÉES À ENVOYER)
            // ==================================================================

            // Construire l'objet contenant toutes les données à envoyer au serveur
            const payload = {
              // IDs des options sélectionnées
              typeId:     resolveId('type'),
              finitionId: resolveId('finition'),
              formeId:    resolveId('forme'),
              poseId:     resolveId('pose'),
              ancrageId:  resolveId('ancrage'),
              verreId:    resolveId('typeDeVerre'),

              // Mesures (dimensions)
              // ?? = si la première valeur est null/undefined, essayer la suivante
              longueur_a: toInt(selection?.longueur_a ?? selection?.mesures?.longueur_a),
              longueur_b: toInt(selection?.longueur_b ?? selection?.mesures?.longueur_b),
              longueur_c: toInt(selection?.longueur_c ?? selection?.mesures?.longueur_c),
              hauteur:    toInt(selection?.hauteur    ?? selection?.mesures?.hauteur),
              angle:      toInt(selection?.angle      ?? selection?.mesures?.angle),

              // Quantité (par défaut 1)
              quantity:   toInt(selection?.quantity) ?? 1
            };

            // ==================================================================
            // VALIDATION DU PAYLOAD
            // ==================================================================

            // Vérifier qu'on a au moins un ID
            // some() = tester si au moins un élément satisfait la condition
            const hasAnyId = [
              payload.typeId,
              payload.finitionId,
              payload.formeId,
              payload.poseId,
              payload.ancrageId,
              payload.verreId
            ].some(v => v !== null);

            // Vérifier qu'on a au moins une mesure
            const hasAnyMeasure = [
              payload.longueur_a,
              payload.longueur_b,
              payload.longueur_c,
              payload.hauteur,
              payload.angle
            ].some(v => v !== null);

            // Si on n'a ni ID ni mesure, afficher une erreur et sortir
            if (!hasAnyId && !hasAnyMeasure) {
              alert('Aucune donnée exploitable (IDs ou mesures manquants). Vérifiez vos options.');
              return;
            }

            // ==================================================================
            // CONSTRUCTION DE L'URL DE L'API
            // ==================================================================

            // Fonction pour construire l'URL complète de l'API
            function buildApiUrl(path) {
              // Récupérer l'URL de base depuis une variable globale
              // window.APP_BASE_URL peut être définie dans le HTML
              const base = (window.APP_BASE_URL || '').trim();

              // Si pas de base, retourner juste le chemin
              if (!base) {
                return path;  // Ex: "configurateur/createDevis"
              }

              // Si la base est une URL absolue (commence par http:// ou https://)
              if (/^https?:\/\//i.test(base) || base.startsWith('//')) {
                // Enlever le / final et ajouter le chemin
                return base.replace(/\/?$/, '/') + path;
              }

              // Si la base est relative (commence par /)
              if (base.startsWith('/')) {
                return base.replace(/\/?$/, '/') + path;
              }

              // Autre cas : forcer un / au début
              return '/' + base.replace(/^\/?/, '').replace(/\/?$/, '/') + path;
            }

            // Construire l'URL finale
            const url = buildApiUrl('configurateur/createDevis');

            // ==================================================================
            // ENVOI DE LA REQUÊTE HTTP
            // ==================================================================

            // fetch() = envoyer une requête HTTP
            // await = attendre la réponse avant de continuer
            const res = await fetch(url, {
              method: 'POST',  // Méthode HTTP POST (envoyer des données)

              // Headers = en-têtes HTTP
              headers: {
                'Content-Type': 'application/json',  // Format JSON
                'Accept': 'application/json'          // On attend du JSON en retour
              },

              // Body = corps de la requête (les données)
              // JSON.stringify() = convertir un objet JavaScript en JSON
              body: JSON.stringify(payload)
            });

            // ==================================================================
            // ANALYSE DE LA RÉPONSE
            // ==================================================================

            // Récupérer le type de contenu de la réponse
            const ct = res.headers.get('content-type') || '';

            // Lire le corps de la réponse (texte)
            const text = await res.text();

            // Vérifier que la réponse est bien du JSON
            if (!ct.includes('application/json')) {
              // Si ce n'est pas du JSON, afficher une erreur
              console.error('Réponse non-JSON (status', res.status, '):', text);
              showToast('Erreur réseau: la réponse n\'est pas JSON (voir console).', 4000, 'error');
              return;
            }

            // Essayer de parser le JSON
            let json;
            try {
              // JSON.parse() = convertir du JSON en objet JavaScript
              json = JSON.parse(text);
            } catch (e) {
              // Si le parsing échoue, afficher une erreur
              console.error('JSON.parse failed:', e, 'body:', text);
              showToast('Erreur réseau: JSON invalide (voir console).', 4000, 'error');
              return;
            }

            // Vérifier que la requête a réussi
            // res.ok = true si le code HTTP est 200-299
            if (!res.ok || !json.ok) {
              console.error('❌ Erreur API', json);
              showToast('❌ Erreur lors de la création du devis.', 4000, 'error');
              return;
            }

            // ==================================================================
            // SUCCÈS !
            // ==================================================================

            // Émettre un événement personnalisé pour notifier du succès
            // CustomEvent = créer un événement personnalisé
            // dispatchEvent() = émettre l'événement
            mount.dispatchEvent(new CustomEvent("configurator:done", {
              detail: { selection, devisId: json.devisId }
            }));

            // Logger dans la console
            console.log("✅ Devis créé, id =", json.devisId, "— sélection:", selection);

            // Afficher une notification de succès
            showToast(
              '✅ Votre Devis #' + json.devisId + ' a été créé avec succès !',
              4500,      // Durée en millisecondes
              'success'  // Type de notification
            );

          } catch (e) {
            // En cas d'erreur réseau ou autre
            console.error(e);
            showToast('Erreur réseau, merci de réessayer plus tard.', 4000, 'error');
          }
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // INSERTION DES BOUTONS
  // --------------------------------------------------------------------------

  // Ajouter les deux boutons au conteneur de navigation
  $navContainer.appendChild($prev);
  $navContainer.appendChild($next);
}

// ============================================================================
// FONCTION : CRÉATION DES PRÉDICATS DE VISIBILITÉ
// ============================================================================

/**
 * makePredicates() = créer les fonctions de test de visibilité
 *
 * Ces fonctions permettent de tester si une étape ou un champ
 * doit être visible selon les conditions définies (showIf)
 *
 * @param {Object} params - Paramètres
 * @returns {Object} - Objet avec les fonctions stepVisible et fieldVisible
 */
export function makePredicates({ selection, stepsArr, data, getCurrentIndex }) {
  return {
    /**
     * stepVisible() = tester si une étape doit être visible
     *
     * @param {Object} step - L'étape à tester
     * @param {Function} resolvePredicate - Fonction pour évaluer la condition
     * @returns {boolean} - true si l'étape est visible
     */
    stepVisible(step, resolvePredicate) {
      // Si showIf n'est pas défini, l'étape est toujours visible
      if (step.showIf === undefined) return true;

      // Sinon, évaluer la condition showIf
      return resolvePredicate(step.showIf, {
        selection,
        step,
        steps: stepsArr,
        data
      });
    },

    /**
     * fieldVisible() = tester si un champ doit être visible
     *
     * @param {Object} field - Le champ à tester
     * @param {Function} resolvePredicate - Fonction pour évaluer la condition
     * @returns {boolean} - true si le champ est visible
     */
    fieldVisible(field, resolvePredicate) {
      // Si showIf n'est pas défini, le champ est toujours visible
      if (field.showIf === undefined) return true;

      // Récupérer l'étape courante
      const step = stepsArr[getCurrentIndex()];

      // Évaluer la condition showIf
      return resolvePredicate(field.showIf, {
        selection,
        step,
        steps: stepsArr,
        data
      });
    }
  };
}

// ============================================================================
// FONCTION : NOTIFICATION (TOAST)
// ============================================================================

/**
 * showToast() = afficher une notification en popup centrale
 *
 * Cette fonction crée une notification style "toast" qui s'affiche
 * au centre de l'écran avec un fond semi-transparent
 *
 * @param {string} message - Le message à afficher
 * @param {number} duration - Durée d'affichage en millisecondes
 * @param {string} type - Type de notification : 'success', 'error', ou 'info'
 */
function showToast(message, duration, type) {
  try {
    // --------------------------------------------------------------------------
    // VALEURS PAR DÉFAUT
    // --------------------------------------------------------------------------

    // || = si la valeur est falsy (null, undefined, 0, ""), utiliser la valeur de droite
    duration = duration || 4000;
    type = type || 'success';

    // --------------------------------------------------------------------------
    // CRÉATION DE L'OVERLAY (FOND SOMBRE)
    // --------------------------------------------------------------------------

    // Créer un overlay qui couvre toute la page
    var overlay = document.createElement('div');
    overlay.className = 'cfg-overlay';

    // --------------------------------------------------------------------------
    // CRÉATION DE LA BOÎTE DE NOTIFICATION
    // --------------------------------------------------------------------------

    // Créer la boîte centrale avec le message
    var box = document.createElement('div');
    box.className = 'cfg-toast-center cfg-toast-' + type;  // Classes CSS selon le type
    box.innerHTML = '<div class="cfg-toast-inner">' + message + '</div>';

    // --------------------------------------------------------------------------
    // AJOUT AU DOM
    // --------------------------------------------------------------------------

    // Ajouter la boîte à l'overlay
    overlay.appendChild(box);

    // Ajouter l'overlay au body (afficher à l'écran)
    document.body.appendChild(overlay);

    // --------------------------------------------------------------------------
    // ANIMATION D'APPARITION
    // --------------------------------------------------------------------------

    // setTimeout() = exécuter du code après un délai
    // Petit délai pour forcer le reflow (nécessaire pour l'animation CSS)
    setTimeout(function () {
      // Ajouter la classe "show" pour déclencher l'animation
      overlay.classList.add('show');
      box.classList.add('show');
    }, 10);  // 10ms de délai

    // --------------------------------------------------------------------------
    // DISPARITION AUTOMATIQUE
    // --------------------------------------------------------------------------

    // Après la durée spécifiée, faire disparaître la notification
    setTimeout(function () {
      // Enlever la classe "show" pour déclencher l'animation de sortie
      overlay.classList.remove('show');
      box.classList.remove('show');

      // Après l'animation, supprimer complètement du DOM
      setTimeout(function () {
        // Vérifier que l'overlay existe encore avant de le supprimer
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }

        // Si c'est un succès, recharger la page pour réinitialiser le configurateur
        if (type === 'success') {
          // location.reload() = recharger la page actuelle
          window.location.reload();
        }
      }, 400);  // 400ms pour l'animation de sortie
    }, duration);  // Durée d'affichage

  } catch (e) {
    // En cas d'erreur, utiliser une alerte native
    alert(message);

    // Recharger quand même si c'est un succès
    if (type === 'success') {
      window.location.reload();
    }
  }
}

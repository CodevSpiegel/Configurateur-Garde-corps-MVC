/**
 * core/fields.js — Rendu d’UN champ (field) d’une étape.
 * -----------------------------------------------------------------------------
 * - Supporte : choice (cards/radios/select), number, text, boolean, range
 * - Met à jour selection[field.id] à chaque interaction
 * - Applique field.onChange() si défini (hook métier côté dataset)
 * - Peut déclencher le nettoyage des étapes suivantes (clearSelectionsBeyond)
 */

import { el, text, normalizeOptions, resolveMaybeFn } from "./utils.js";

/**
 * Rend un champ et renvoie un élément DOM prêt à insérer dans la zone des champs.
 *
 * @param {Object} params
 * @param {Object} params.step            - étape courante
 * @param {Object} params.field           - définition du champ
 * @param {Object} params.ctx             - contexte global { selection, stepsArr, data, clearSelectionsBeyond, rerenderAll, invalidFields, requiredErrorMessage }
 * @returns {HTMLElement}
 */
export function renderField({ step, field, ctx }) {
  const { selection, stepsArr, data, clearSelectionsBeyond, rerenderAll } = ctx;

  // Conteneur du champ (un simple <div>) + id stable pour scroll/focus
  const $wrap = el("div", { id: `field-${field.id}`, className: "cfg-field" });

  // Indication d'erreur champ si présent dans ctx.invalidFields
  const hasError = ctx.invalidFields.has(field.id);
  if (hasError) {
    $wrap.classList.add("cfg-field-error");
  }

  // Étiquette du champ (label prioritaire, sinon id)
  const $label = el("div", { class: "cfg-label" }, text(field.label ?? field.id));

  // Aide/description optionnelle du champ
  const $help  = field.help ? el("div", { class: "cfg-help" }, text(field.help)) : null;

  // On assemble label + help
  $wrap.appendChild($label);
  if ($help) $wrap.appendChild($help);

  // Valeur actuelle dans la sélection (peut être undefined si jamais saisie)
  const value = selection[field.id];

  // On switch selon le type de champ
  switch (field.type) {

    // -------------------------- CHOICE --------------------------
    case "choice": {
      // Normalise la liste d’options : array d’objets { value, label, image? }
      const opts = normalizeOptions(
        resolveMaybeFn(field.options, { selection, step, steps: stepsArr, data })
      );

      // UI choisie pour le rendu : "cards" (par défaut), "radios" ou "select"
      const ui = field.ui || "cards";

      if (ui === "cards") {
        const $grid = el("div", { class: "cfg-cards" });

        opts.forEach(opt => {
          const $card = el("div", {
            class: `cfg-card ${value === opt.value ? "active" : ""}`,
            role: "button",
            tabIndex: 0
          });

          if (opt.image) {
            const img = new Image();
            img.src = opt.image;
            img.alt = opt.label ?? opt.value;
            $card.appendChild(img);
          }

          $card.appendChild(el("div", {}, text(opt.label ?? opt.value)));

          $card.addEventListener("click", () => {
            selection[field.id] = opt.value; // 1) Mise à jour

            // 🆕 Nettoyage erreurs UX pour ce champ
            ctx.invalidFields.delete(field.id);
            ctx.requiredErrorMessage = "";

            // 2) Hook optionnel "onChange" côté dataset
            try {
              if (typeof field.onChange === "function") {
                field.onChange({ selection, step, steps: stepsArr, data });
              }
            } catch (e) {
              console.warn("onChange error:", e);
            }

            // 3) Nettoyage des étapes suivantes (cohérence)
            const preserve = step.preserveOnChange || [];
            clearSelectionsBeyond(step, { preserve });

            // 4) Rerender complet
            rerenderAll();
          });

          $grid.appendChild($card);
        });

        $wrap.appendChild($grid);

      } else if (ui === "radios") {
        const $list = el("div", { style: "display:grid; gap:6px" });

        opts.forEach(opt => {
          const id = `r_${field.id}_${String(opt.value).replace(/\W+/g, "")}`;
          const $row = el("label", {
            for: id,
            style: "display:flex; gap:8px; align-items:center;"
          });

          const $input = el("input", {
            id,
            type: "radio",
            name: field.id,
            checked: value === opt.value
          });

          $input.addEventListener("change", () => {
            selection[field.id] = opt.value;

            // 🆕 Nettoyage erreurs UX
            ctx.invalidFields.delete(field.id);
            ctx.requiredErrorMessage = "";

            clearSelectionsBeyond(step);
            rerenderAll();
          });

          $row.appendChild($input);

          if (opt.image) {
            const img = new Image();
            img.src = opt.image;
            img.alt = opt.label ?? opt.value;
            img.style.height = "40px";
            $row.appendChild(img);
          }

          $row.appendChild(text(opt.label ?? opt.value));
          $list.appendChild($row);
        });

        $wrap.appendChild($list);

      } else {
        const $sel = el("select");
        $sel.appendChild(el("option", { value: "" }, text("-- Choisir --")));

        opts.forEach(opt => {
          const $o = el("option", {
            value: opt.value,
            selected: value === opt.value
          }, text(opt.label ?? opt.value));
          $sel.appendChild($o);
        });

        $sel.addEventListener("change", () => {
          selection[field.id] = $sel.value || undefined;

          // 🆕 Nettoyage erreurs UX
          ctx.invalidFields.delete(field.id);
          ctx.requiredErrorMessage = "";

          clearSelectionsBeyond(step);
          rerenderAll();
        });

        $wrap.appendChild($sel);
      }
      break;
    }

    // -------------------------- NUMBER --------------------------
    case "number": {
      const $inp = el("input", {
        type: "number",
        value: value ?? "",
        placeholder: field.placeholder ?? "",
        min: field.min ?? undefined,
        max: field.max ?? undefined,
        step: field.step ?? "any"
      });

      $inp.addEventListener("input", () => {
        selection[field.id] = $inp.value === "" ? undefined : Number($inp.value);

        // 🆕 Nettoyage erreurs UX
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      $wrap.appendChild($inp);
      if (field.unit) {
        $wrap.appendChild(el("div", { class: "cfg-help" }, text(`Unité : ${field.unit}`)));
      }
      break;
    }

    // -------------------------- TEXT --------------------------
    case "text": {
      const $inp = el("input", {
        type: "text",
        value: value ?? "",
        placeholder: field.placeholder ?? ""
      });

      $inp.addEventListener("input", () => {
        selection[field.id] = $inp.value || undefined;

        // 🆕 Nettoyage erreurs UX
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      $wrap.appendChild($inp);
      break;
    }

    // -------------------------- BOOLEAN --------------------------
    case "boolean": {
      const $inp = el("input", { type: "checkbox", checked: Boolean(value) });

      $inp.addEventListener("change", () => {
        selection[field.id] = $inp.checked;

        // 🆕 Nettoyage erreurs UX
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      $wrap.appendChild($inp);
      break;
    }

    // -------------------------- RANGE --------------------------
    case "range": {
      const $inp = el("input", {
        type: "range",
        value: value ?? field.min ?? 0,
        min: field.min ?? 0,
        max: field.max ?? 100,
        step: field.step ?? 1
      });
      const $out = el("span", {}, text(String($inp.value)));

      $inp.addEventListener("input", () => {
        selection[field.id] = Number($inp.value);
        $out.textContent = String($inp.value);

        // 🆕 Nettoyage erreurs UX
        ctx.invalidFields.delete(field.id);
        ctx.requiredErrorMessage = "";
      });

      $wrap.appendChild($inp);
      $wrap.appendChild(el("div", {}, $out));
      break;
    }

    // -------------------------- PAR DÉFAUT --------------------------
    default: {
      $wrap.appendChild(
        el("div", { class: "cfg-help" }, text(`Type de champ inconnu: ${field.type}`))
      );
    }
  }

  // Si le champ est en erreur "requis manquant", affiche un petit message sous le champ
  if (hasError) {
    $wrap.appendChild(
      el("div", { class: "cfg-field-error-msg" }, text("Ce champ est requis."))
    );
  }

  return $wrap;
}
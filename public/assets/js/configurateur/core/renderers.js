/**
 * core/renderers.js — Rendus principaux (sidebar, étape, navigation).
 * -----------------------------------------------------------------------------
 * - Ces fonctions reçoivent un "ctx" (contexte) et des "containers" (#cfg-steps, etc.)
 * - Elles ne connaissent PAS l’init ni le bootstrap : elles font un rendu pur.
 */

import { el, text, escapeHtml, resolveMaybeFn } from "./utils.js";
import { renderField } from "./fields.js";

/* -------------------------------------------------------------------------- */
/* Modal Résumé final (léger)                                                 */
/* -------------------------------------------------------------------------- */
function showSummaryModal({ containers, ctx, onConfirm }) {
  const { mount } = containers;
  const { stepsArr, selection, shouldShowField, isStepVisible, data } = ctx;

  const $backdrop = el("div", { class: "cfg-modal-backdrop" });
  const $modal = el("div", { class: "cfg-modal", role: "dialog", ariaModal: "true" });

  const $header = el("header", {}, el("h3", {}, text("Résumé de votre configuration")));
  const $main = el("main");
  const $footer = el("footer", {},
    el("div", { class: "actions" },
      el("button", { className: "cfg-btn-secondary", onclick: () => document.body.removeChild($backdrop) }, text("Modifier")),
      el("button", { className: "cfg-btn-primary", onclick: () => { document.body.removeChild($backdrop); onConfirm?.(); } }, text("Confirmer"))
    )
  );

  // Contenu résumé (labels humains quand dispo)
  const $dl = el("dl", { class: "cfg-summary-grid" });
  stepsArr.forEach(step => {
    if (!isStepVisible(step)) return;

    (step.fields ?? []).forEach(field => {
      if (!shouldShowField(field)) return;

      const label = field.label ?? field.id;
      let value = selection[field.id];
      if (value === undefined || value === "" || value === null) return;

      // Si choice: essayer d'afficher le label humain
      try {
        if (field.type === "choice") {
          const optsRaw = typeof field.options === "function"
            ? field.options({ selection, step, steps: stepsArr, data })
            : field.options;

          const opts = Array.isArray(optsRaw)
            ? optsRaw
            : (optsRaw && typeof optsRaw === "object")
              ? Object.keys(optsRaw).map(k => optsRaw[k])
              : [];

          const found = opts.find(o => (o?.value ?? o?.id ?? o) === value);
          if (found) value = found.label ?? String(found.value ?? value);
        }
      } catch {
        // en cas d’erreur, on se contente de la value
      }

      $dl.appendChild(el("dt", {}, text(label)));
      $dl.appendChild(el("dd", {}, text(String(value))));
    });
  });

  $main.appendChild($dl);
  $modal.appendChild($header);
  $modal.appendChild($main);
  $modal.appendChild($footer);

  $backdrop.appendChild($modal);
  document.body.appendChild($backdrop);
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */
export function renderSidebar({ containers, ctx }) {
  const { $sidebarContainer } = containers;
  const { stepsArr, isStepVisible, isStepComplete, getCurrentIndex, setCurrentIndex, rerenderAll } = ctx;

  $sidebarContainer.innerHTML = "";
  const $ul = el("div", {});

  stepsArr.forEach((step, idx) => {
    if (!isStepVisible(step)) return;

    const isActive = idx === getCurrentIndex();
    const $li = el("div", { class: `cfg-step-item ${isActive ? "active" : ""}` });

    $li.addEventListener("click", () => {
      setCurrentIndex(idx);
      ctx.clearRequiredErrors();  // nettoie l'état d'erreurs en changeant d'étape
      rerenderAll();
    });

    const status = isStepComplete(step) ? "✅" : "⏳";
    $li.appendChild(text(`${status} ${step.label ?? step.id}`));
    $ul.appendChild($li);
  });

  $sidebarContainer.appendChild($ul);
}

/* -------------------------------------------------------------------------- */
/* Step                                                                       */
/* -------------------------------------------------------------------------- */
export function renderStep({ containers, ctx }) {
  const { $fieldsContainer, $previewContainer } = containers;
  const { stepsArr, selection, data, getCurrentIndex, shouldShowField } = ctx;

  $fieldsContainer.innerHTML = "";
  $previewContainer.innerHTML = "";

  const step = stepsArr[getCurrentIndex()];
  if (!step) return;

  const $title = el("h2", {}, text(step.label ?? step.id));
  const $desc  = step.description ? el("div", { class: "cfg-help" }, text(step.description)) : null;
  const $fields = el("div", { class: "cfg-fields" });
  const $errors = el("div", { class: "cfg-error" });

  // Bandeau d'alerte convivial si des champs requis manquent
  const $banner = ctx.requiredErrorMessage
    ? el("div", { class: "cfg-error-banner", role: "alert", tabIndex: -1 },
        el("strong", {}, text("⚠️ Informations manquantes : ")),
        el("span", {}, text(ctx.requiredErrorMessage)),
        el("button", {
          type: "button",
          className: "cfg-error-banner-close",
          onclick: () => { ctx.clearRequiredErrors(); renderStep({ containers, ctx }); }
        }, text("×"))
      )
    : null;

  const fields = (step.fields ?? []).filter(f => shouldShowField(f));
  fields.forEach(field => {
    const $f = renderField({ step, field, ctx });
    if ($f) $fields.appendChild($f);
  });

  // Preview
  let previewUrl = resolveMaybeFn(step.preview, { selection, data, step, steps: stepsArr });
  if ((!previewUrl || previewUrl === null) && step.defaultPreview) previewUrl = step.defaultPreview;

  const $preview = el("div", { class: "cfg-preview" }, text("Aperçu"));
  if (previewUrl) {
    const img = new Image();
    img.src = previewUrl;
    img.alt = "preview";
    img.style.width = "100%";
    $preview.innerHTML = "";
    $preview.appendChild(img);
  }

  // validate() optionnelle
  const errs = [];
  if (typeof step.validate === "function") {
    try {
      step.validate({ selection, step, steps: stepsArr, data, errors: (arr)=>errs.push(...arr) });
    } catch (e) {
      errs.push(`Erreur validate(): ${e.message}`);
    }
  }
  if (errs.length) $errors.innerHTML = errs.map(e => `<div>• ${escapeHtml(e)}</div>`).join("");

  // Assemble
  $fieldsContainer.appendChild($title);
  if ($desc) $fieldsContainer.appendChild($desc);
  if ($banner) $fieldsContainer.appendChild($banner);
  $fieldsContainer.appendChild($fields);
  $previewContainer.appendChild($preview);
  if (errs.length) $fieldsContainer.appendChild($errors);
}

/* -------------------------------------------------------------------------- */
/* Nav                                                                        */
/* -------------------------------------------------------------------------- */
export function renderNav({ containers, ctx }) {
  const { $navContainer, mount } = containers;
  const { stepsArr, selection, data, getCurrentIndex, setCurrentIndex, shouldShowField, rerenderAll } = ctx;

  $navContainer.innerHTML = "";

  const $prev = el("button", {}, text("← Précédent"));
  const isLast = getCurrentIndex() === stepsArr.length - 1;
  const $next = el("button", {}, text(isLast ? "Terminer" : "Suivant →"));

  $prev.disabled = getCurrentIndex() === 0;

  $prev.addEventListener("click", () => {
    const i = getCurrentIndex();
    if (i > 0) {
      setCurrentIndex(i - 1);
      ctx.clearRequiredErrors(); // nettoie les erreurs si on recule
      rerenderAll();
    }
  });

  $next.addEventListener("click", () => {
    const i = getCurrentIndex();
    const step = stepsArr[i];

    // Champs visibles requis manquants -> UX conviviale
    const visibleFields = (step.fields ?? []).filter(f => shouldShowField(f));
    const missing = visibleFields.filter(f =>
      f.required && (selection[f.id] === undefined || selection[f.id] === "" || selection[f.id] === null)
    );

    if (missing.length) {
      const ids = missing.map(f => f.id);
      const msg = "Veuillez compléter : " + missing.map(f => f.label ?? f.id).join(", ");

      ctx.setRequiredErrors(ids, msg);
      rerenderAll();

      // Scroll + focus vers le 1er champ invalide
      const firstId = missing[0].id;
      const $first = document.getElementById(`field-${firstId}`);
      if ($first) {
        $first.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = $first.querySelector("input, select, button, [tabindex]");
        (focusable || $first).focus?.();
      }
      return;
    }

    // Validation métier optionnelle
    if (typeof step.validate === "function") {
      const errs = [];
      try {
        step.validate({ selection, step, steps: stepsArr, data, errors:(arr)=>errs.push(...arr) });
      } catch (e) {
        errs.push(e.message || String(e));
      }
      if (errs.length) {
        // (option) tu peux remplacer cet alert par un autre bandeau si tu veux
        alert("Erreurs:\n- " + errs.join("\n- "));
        return;
      }
    }

    // Navigation / Terminaison avec modale Résumé
    if (i < stepsArr.length - 1) {
      setCurrentIndex(i + 1);
      ctx.clearRequiredErrors();
      rerenderAll();
    } else {
      // Au lieu d'alerter directement, on ouvre la modale de résumé
      showSummaryModal({
        containers, ctx,
        onConfirm: async () => {
          try {
            // -------- Helpers locaux (pas de pollution globale) ----------
            const ensureSlash = (u) => (u && u.endsWith('/')) ? u : (u ? u + '/' : '/');
            const toInt = (v) => (v === undefined || v === null || v === '' || isNaN(v)) ? null : parseInt(v, 10);
            const isNumLike = (v) => (typeof v === 'number') || (/^\d+$/).test(String(v ?? ''));

            // Résolution ID fiable depuis selection + ctx.stepsArr (options[].id numérique requis dans steps.js)
            const resolveId = (fieldKey) => {
              const raw   = selection?.[fieldKey];
              const rawId = selection?.[fieldKey + 'Id'];
              if (isNumLike(raw))   return toInt(raw);
              if (isNumLike(rawId)) return toInt(rawId);

              const steps = Array.isArray(ctx?.stepsArr) ? ctx.stepsArr : [];
              const stepDef = steps.find(st => Array.isArray(st.fields) && st.fields.some(f => f.id === fieldKey));
              if (!stepDef) return null;
              const fieldDef = stepDef.fields.find(f => f.id === fieldKey);
              const opts = Array.isArray(fieldDef?.options)
                ? fieldDef.options
                : (typeof fieldDef?.options === 'function' ? (fieldDef.options({ selection }) || []) : []);
              if (typeof raw === 'string') {
                const opt = opts.find(o => o && (o.value === raw || o.slug === raw));
                if (opt) {
                  if (typeof opt.id === 'number') return opt.id;
                  if (opt.id && isNumLike(opt.id)) return toInt(opt.id);
                  if (opt.value && isNumLike(opt.value)) return toInt(opt.value);
                }
              }
              return null;
            };

            // --------- Construire le payload attendu par l’API ----------
            const payload = {
              typeId:     resolveId('type'),
              finitionId: resolveId('finition'),
              formeId:    resolveId('forme'),
              poseId:     resolveId('pose'),
              ancrageId:  resolveId('ancrage'),
              verreId:    resolveId('typeDeVerre'),
              longueur_a: toInt(selection?.longueur_a ?? selection?.mesures?.longueur_a),
              longueur_b: toInt(selection?.longueur_b ?? selection?.mesures?.longueur_b),
              longueur_c: toInt(selection?.longueur_c ?? selection?.mesures?.longueur_c),
              hauteur:    toInt(selection?.hauteur    ?? selection?.mesures?.hauteur),
              angle:      toInt(selection?.angle      ?? selection?.mesures?.angle),
              quantity:   toInt(selection?.quantity) ?? 1
            };

            // ---------- Validation souple ----------
            const hasAnyId = [payload.typeId, payload.finitionId, payload.formeId, payload.poseId, payload.ancrageId, payload.verreId].some(v => v !== null);
            const hasAnyMeasure = [payload.longueur_a, payload.longueur_b, payload.longueur_c, payload.hauteur, payload.angle].some(v => v !== null);
            if (!hasAnyId && !hasAnyMeasure) {
              alert('Aucune donnée exploitable (IDs ou mesures manquants). Vérifiez vos options.');
              return;
            }

           // Construit une URL finale même si APP_BASE_URL est relative ou vide
            function buildApiUrl(path) {
              const base = (window.APP_BASE_URL || '').trim();
              if (!base) {
                // Pas de base → URL relative simple
                return path; // "devis/create"
              }
              if (/^https?:\/\//i.test(base) || base.startsWith('//')) {
                // Base absolue
                return base.replace(/\/?$/, '/') + path;
              }
              if (base.startsWith('/')) {
                // Base relative à l'origine (ex: "/gardecorps/public/")
                return base.replace(/\/?$/, '/') + path;
              }
              // Autre cas (ex: "gardecorps/public") → force un leading slash
              return '/' + base.replace(/^\/?/, '').replace(/\/?$/, '/') + path;
            }

            const url = buildApiUrl('configurateur/createDevis');


            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(payload)
            });

            // ---------- Parse JSON robuste ----------
            const ct  = res.headers.get('content-type') || '';
            const text = await res.text();
            if (!ct.includes('application/json')) {
              console.error('Réponse non-JSON (status', res.status, '):', text);
              showToast('Erreur réseau: la réponse n’est pas JSON (voir console).', 4000, 'error');
              return;
            }

            let json;
            try { json = JSON.parse(text); }
            catch (e) {
              console.error('JSON.parse failed:', e, 'body:', text);
              showToast('Erreur réseau: JSON invalide (voir console).', 4000, 'error');
              return;
            }

            if (!res.ok || !json.ok) {
              console.error('❌ Erreur API', json);
              showToast('❌ Erreur lors de la création du devis.', 4000, 'error');
              return;
            }

            // ---------- Succès ----------
            mount.dispatchEvent(new CustomEvent("configurator:done", { detail: { selection, devisId: json.devisId } }));
            console.log("✅ Devis créé, id =", json.devisId, "— sélection:", selection);
            showToast('✅ Votre Devis #' + json.devisId + ' a été créé avec succès !', 4500, 'success');
          } catch (e) {
            console.error(e);
            showToast('Erreur réseau, merci de réessayer plus tard.', 4000, 'error');
          }
        }

      });
    }
  });

  $navContainer.appendChild($prev);
  $navContainer.appendChild($next);
}

/* -------------------------------------------------------------------------- */
/* Visibilité : prédicats                                                     */
/* -------------------------------------------------------------------------- */
export function makePredicates({ selection, stepsArr, data, getCurrentIndex }) {
  return {
    stepVisible(step, resolvePredicate) {
      if (step.showIf === undefined) return true;
      return resolvePredicate(step.showIf, { selection, step, steps: stepsArr, data });
    },
    fieldVisible(field, resolvePredicate) {
      if (field.showIf === undefined) return true;
      const step = stepsArr[getCurrentIndex()];
      return resolvePredicate(field.showIf, { selection, step, steps: stepsArr, data });
    }
  };
}

// ---------------------------------------------
// ✅ Version "Popup de confirmation centrale"
// ---------------------------------------------
function showToast(message, duration, type) {
  try {
    duration = duration || 4000;
    type = type || 'success'; // success | error | info

    // --- Crée un overlay semi-transparent qui bloque la page ---
    var overlay = document.createElement('div');
    overlay.className = 'gc-overlay';

    // --- Crée la boîte centrale ---
    var box = document.createElement('div');
    box.className = 'gc-toast-center gc-toast-' + type;
    box.innerHTML = '<div class="gc-toast-inner">' + message + '</div>';

    // --- Ajoute au DOM ---
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // --- Force le reflow pour lancer la transition CSS ---
    setTimeout(function () {
      overlay.classList.add('show');
      box.classList.add('show');
    }, 10);

    // --- Disparition automatique + refresh configurateur ---
    setTimeout(function () {
      overlay.classList.remove('show');
      box.classList.remove('show');
      setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        // 🔁 Recharge la page (pour réinitialiser le configurateur)
        if (type === 'success') {
          window.location.reload();
        }
      }, 400);
    }, duration);
  } catch (e) {
    alert(message);
    if (type === 'success') window.location.reload();
  }
}



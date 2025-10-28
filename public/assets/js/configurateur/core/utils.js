/**
 * core/utils.js — Fonctions utilitaires PURES réutilisées partout.
 * -----------------------------------------------------------------------------
 * On regroupe ici :
 * - Petites fabriques DOM (el, text)
 * - Outils de sécurité/format (escapeHtml)
 * - Maths (clamp)
 * - Normalisations (normalizeSteps, normalizeOptions)
 * - Évaluations dynamiques (resolveMaybeFn, resolvePredicate)
 *
 * Ces fonctions n’ont PAS d’effet de bord (sauf createElement côté el/text évidemment).
 */

/**
 * Petite fabrique de nœuds DOM.
 * - tag : nom de la balise ("div", "button", "img", ...)
 * - attrs : attributs ou propriétés (class, id, style, onclick, etc.)
 * - children : enfants (string => TextNode, sinon Node)
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);

  // On applique chaque attribut :
  // - Si la clé existe en tant que propriété du nœud => node[k] = v (ex: node.className)
  // - Sinon => setAttribute(k, v)
  Object.entries(attrs).forEach(([k, v]) => {
    if (v == null) return;
    if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  });

  // On insère les enfants (string => TextNode)
  children.forEach(c =>
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
  );

  return node;
}

/** Raccourci pour créer un TextNode. */
export function text(s) {
  return document.createTextNode(s);
}

/** Borne un nombre n entre a et b (inclus). */
export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Échappe les caractères HTML spéciaux pour éviter les injections
 * dans nos messages d’erreurs/alertes.
 */
export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

/**
 * Normalise la structure "steps" :
 * - Si c’est un Array : on s’assure que chaque step a un id (sinon step_1, step_2…)
 * - Si c’est un Object : on le transforme en Array [{id: key, ...value}, ...]
 */
export function normalizeSteps(input) {
  let arr = Array.isArray(input)
    ? input
    : Object.keys(input || {}).map(k => ({ id: k, ...(input[k] ?? {}) }));

  // Ajoute un id de secours si absent
  arr = arr.map((s, i) => ({ id: s.id ?? `step_${i + 1}`, ...s }));

  return arr;
}

/**
 * Normalise les options de type "choice" en une liste d’objets homogènes :
 * - Supporte Array (de strings ou d’objets) ET Object (clé -> objet option)
 * - Sortie : [{ value, label, image? }, ...]
 */
export function normalizeOptions(options) {
  if (!options) return [];

  if (Array.isArray(options)) {
    return options.map(o => ({
      value: o.value ?? o.slug ?? o.id ?? o,           // priorité value>slug>id>string
      label: o.label ?? String(o.label ?? o.value ?? o),
      image: o.image
    }));
  }

  if (typeof options === "object") {
    return Object.keys(options).map(k => {
      const o = options[k] ?? {};
      return {
        value: o.value ?? o.slug ?? k,                 // value>slug>clé
        label: o.label ?? String(o.label ?? k),
        image: o.image
      };
    });
  }

  return [];
}

/**
 * Si "maybe" est une fonction => l’exécute avec le contexte "ctx",
 * sinon retourne la valeur telle quelle (ou null si undefined).
 * - Pratique pour gérer preview, options dynamiques, etc.
 */
export function resolveMaybeFn(maybe, ctx) {
  return typeof maybe === "function" ? maybe(ctx) : (maybe ?? null);
}

/**
 * Évalue un prédicat "pred" (pour showIf) :
 * - Si fonction => appelle avec { selection, step, steps, data }
 * - Si string => remplace "selection" par "ctx.selection", "data" par "ctx.data" et eval
 * - Si booléen/valeur => cast en Boolean
 *
 * ⚠️ eval : on considère que le code steps.js est maîtrisé (confiance).
 */
export function resolvePredicate(pred, ctx) {
  try {
    if (typeof pred === "function") return Boolean(pred(ctx));
    if (typeof pred === "string") {
      const expr = pred
        .replace(/\bselection\b/g, "ctx.selection")
        .replace(/\bdata\b/g, "ctx.data");
      // eslint-disable-next-line no-eval
      return Boolean(eval(expr));
    }
    return Boolean(pred);
  } catch {
    return false;
  }
}

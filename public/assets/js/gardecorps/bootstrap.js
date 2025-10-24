/**
 * bootstrap.js — Sélecteur de dataset via un menu (sans paramètres d’URL)
 * -------------------------------------------------------------------------
 * Rôle :
 * - Construire un menu (boutons) listant les "datasets" disponibles (câbles, barres, verre, etc.)
 * - Charger dynamiquement steps.js et initialiser le configurateur dans #app
 * - Ajouter un bouton “Terminer” qui envoie les valeurs vers /gardecorps/save (PHP)
 */

import { initConfigurator } from "./app.js"; // Fonction principale du configurateur

// ============================================================================
// 1) Registre des datasets disponibles
// ============================================================================
const DATASETS = {
  "cables":           () => import("./datasets/cables/steps.js"),
  "barres":           () => import("./datasets/barres/steps.js"),
  "verre":            () => import("./datasets/verre/steps.js"),
  "verre-a-profile":  () => import("./datasets/verre-a-profile/steps.js"),
  "barriere-piscine": () => import("./datasets/barriere-piscine/steps.js"),
  "filet-inox":       () => import("./datasets/filet-inox/steps.js"),
  "tole-inox":        () => import("./datasets/tole-inox/steps.js"),
};

// ============================================================================
// 2) Menu principal
// ============================================================================
const MENU_ITEMS = [
  { code: "cables",           label: "Câbles" },
  { code: "barres",           label: "Barres" },
  { code: "verre",            label: "Verre" },
  { code: "verre-a-profile",  label: "Verre à profilé" },
  { code: "barriere-piscine", label: "Barrière piscine" },
  { code: "filet-inox",       label: "Filet câble inox" },
  { code: "tole-inox",        label: "Acier inox" },
];

// ============================================================================
// 3) Références DOM
// ============================================================================
const $app   = document.getElementById("app");
const $links = document.getElementById("links");

if (!$app) throw new Error("❌ Élément #app introuvable dans le DOM.");
if (!$links) console.warn("ℹ️ Aucun conteneur #links trouvé : le menu sera créé automatiquement.");

// ============================================================================
// 4) État du dataset actif
// ============================================================================
let currentCode = null;

// ============================================================================
// 5) Construit le menu
// ============================================================================
function buildMenu() {
  const host = $links ?? document.createElement("div");
  host.id = "links";
  host.innerHTML = "";

  MENU_ITEMS.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.label;
    btn.className = "menu-btn";
    if (item.code === currentCode) btn.classList.add("active");

    btn.addEventListener("click", () => {
      if (currentCode === item.code) return;
      currentCode = item.code;
      highlightActive(host);
      loadDataset(item.code);
    });

    host.appendChild(btn);
  });

  if (!$links) $app.parentNode.insertBefore(host, $app);
}

function highlightActive(host) {
  host.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
  const activeItem = MENU_ITEMS.find(i => i.code === currentCode);
  const btn = [...host.querySelectorAll(".menu-btn")]
    .find(b => b.textContent === activeItem?.label);
  if (btn) btn.classList.add("active");
}

// ============================================================================
// 6) Charge un dataset et initialise le configurateur
// ============================================================================
async function loadDataset(code) {
  const loader = DATASETS[code];
  if (!loader) {
    $app.innerHTML = `Code inconnu: <b>${code}</b>`;
    return;
  }

  $app.innerHTML = "";

  try {
    const mod = await loader();
    const steps = mod.default;

    // On initialise le configurateur
    initConfigurator({
      steps,
      data: {},
      mount: $app,
      startAt: 0,
    });

    // ✅ Ajoute le bouton "Terminer" à la fin du configurateur
    addSubmitButton();

  } catch (err) {
    console.error("Erreur dataset:", err);
    $app.innerHTML = "❌ Erreur lors du chargement du steps.js";
  }
}

// ============================================================================
// 7) Bouton “Terminer et envoyer le devis”
// ============================================================================
function addSubmitButton() {
  const btn = document.createElement("button");
  btn.textContent = "Terminer et envoyer le devis";
  btn.className = "cfg-btn-submit";

  btn.addEventListener("click", async () => {
    if (!window.selectionState) {
      alert("❌ Aucune sélection détectée.");
      return;
    }
    await submitDevis(window.selectionState);
  });

  // On l'ajoute après le configurateur
  $app.appendChild(btn);
}

// ============================================================================
// 8) Envoi du devis (fetch JSON → PHP)
// ============================================================================
async function submitDevis(selectionState) {
  const payload = {
    model:    selectionState.model?.value ?? "",
    type:     selectionState.type?.value ?? "",
    finition: selectionState.finition?.value ?? null,
    forme:    selectionState.forme?.value ?? null,
    pose:     selectionState.pose?.value ?? null,
    ancrage:  selectionState.ancrage?.value ?? null,
    verre:    selectionState.typeDeVerre?.value ?? null,
    mesures: {
      a:       selectionState.mesures?.a ?? null,
      b:       selectionState.mesures?.b ?? null,
      c:       selectionState.mesures?.c ?? null,
      hauteur: selectionState.mesures?.hauteur ?? null,
      angle:   selectionState.mesures?.angle ?? null,
    },
  };

  console.log("📦 Payload envoyé au serveur :", payload);

  try {
    const res = await fetch("/gardecorps/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": window.CSRF_TOKEN || "",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.ok) {
      console.error("❌ Erreur serveur", res.status, json);
      alert("❌ Erreur lors de la sauvegarde du devis.\n" + (json.error || "Erreur inconnue."));
      return;
    }

    alert("✅ Devis enregistré avec succès !\nNuméro : " + json.id);

  } catch (err) {
    console.error("❌ Exception fetch", err);
    alert("❌ Erreur réseau lors de la sauvegarde du devis.");
  }
}

// ============================================================================
// 9) Boot : menu + dataset par défaut
// ============================================================================
(function start() {
  currentCode = MENU_ITEMS[0].code;
  buildMenu();
  loadDataset(currentCode);
})();



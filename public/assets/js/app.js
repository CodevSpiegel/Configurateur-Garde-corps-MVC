// ============================================================================
// 📋 Script : Copier le contenu d’un bloc <pre> au clic sur un bouton [data-copy]
// ============================================================================

document.addEventListener('click', function(e) {
    // 🔹 On cherche si l’élément cliqué (ou son parent) possède l’attribut [data-copy]
    var btn = e.target.closest('[data-copy]');
    if (!btn) return; // Si aucun bouton concerné → on ne fait rien

    // 🔹 On récupère l’élément <pre> juste avant le bouton
    var pre = btn.previousElementSibling;

    // 🔹 Vérifie qu’il existe bien et que c’est un élément <pre>
    if (pre && pre.tagName === 'PRE') {

        // 🔹 Copie du texte contenu dans <pre> vers le presse-papiers
        navigator.clipboard.writeText(pre.innerText).then(function() {

            // ✅ Message visuel de confirmation
            btn.textContent = 'Copié ✔';

            // ⏱️ Après 1,2 seconde, on remet le texte du bouton à "Copier"
            setTimeout(function() {
                btn.textContent = 'Copier';
            }, 1200);
        });
    }
});
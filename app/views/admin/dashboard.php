<?php
/**
 * ============================================================================
 * app\views\admin\dashboard.php
 * ============================================================================
 * Dashboard minimal : 3 cartes cliquables.
 * Utilise BASE_URL pour générer des liens robustes.
 * Le layout header/footer est injecté automatiquement par Controller->view().
 * ---------------------------------------------------------------------------
 * Variables attendues :
 *   - $cards : array [ [ 'title' => string, 'desc' => string, 'url' => string ], ... ]
 */
?>
<div class="container" style="max-width:980px;margin:2rem auto;">
  <h1 style="margin-bottom:1rem;">Administration</h1>
  <p style="color:#666;margin-bottom:2rem;">Bienvenue dans le tableau de bord. Choisissez une section :</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
    <?php foreach ($cards as $c): ?>
      <a href="<?= htmlspecialchars($c['url'], ENT_QUOTES, 'UTF-8') ?>"
         style="display:block;padding:16px;border:1px solid #e5e5e5;border-radius:12px;text-decoration:none;">
        <h2 style="margin:0 0 8px 0;font-size:18px;"><?= htmlspecialchars($c['title'], ENT_QUOTES, 'UTF-8') ?></h2>
        <p style="margin:0;color:#666;"><?= htmlspecialchars($c['desc'], ENT_QUOTES, 'UTF-8') ?></p>
      </a>
    <?php endforeach; ?>
  </div>
</div>
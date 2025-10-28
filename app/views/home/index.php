<?php $title = "Accueil"; ?>
<section>
  <h1>Guide & Astuces (HTML, CSS, JS, PHP, MySQL)</h1>
  <p class="muted">Mini plateforme MVC pour apprendre, lister et éditer vos astuces de développement Web.</p>

  <h2>Dernières astuces</h2>
  <div class="grid grid-3">
    <?php foreach ($latest as $t): ?>
      <article class="card">
        <h3><a href="<?= BASE_URL ?>tip/show/<?= (int)$t['id'] ?>"><?= htmlspecialchars($t['title']) ?></a></h3>
        <p class="muted"><?= htmlspecialchars($t['category_name']) ?> — <?= htmlspecialchars($t['summary'] ?? '') ?></p>
      </article>
    <?php endforeach; ?>
  </div>

  <?php if (!empty($q)): ?>
    <h2>Résultats pour « <?= htmlspecialchars($q) ?> »</h2>
    <?php if (empty($results)): ?>
      <p>Aucun résultat.</p>
    <?php else: ?>
      <ul>
        <?php foreach ($results as $r): ?>
          <li><a href="<?= BASE_URL ?>tip/show/<?= (int)$r['id'] ?>"><?= htmlspecialchars($r['title']) ?></a> <span class="badge"><?= htmlspecialchars($r['category_name']) ?></span></li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  <?php endif; ?>

  <h2>Parcourir les catégories</h2>
  <div class="grid grid-5">
    <?php foreach ($cats as $c): ?>
      <a class="chip" href="<?= BASE_URL ?>category/show/<?= (int)$c['id'] ?>"><?= htmlspecialchars($c['name']) ?></a>
    <?php endforeach; ?>
  </div>
</section>
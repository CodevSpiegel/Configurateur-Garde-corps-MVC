<?php $title = "Catégorie — " . htmlspecialchars($category['name']); ?>
<section>
  <h1><?= htmlspecialchars($category['name']) ?></h1>
  <p class="muted"><?= htmlspecialchars($category['description'] ?? '') ?></p>

  <?php if (empty($tips)): ?>
    <p>Aucune astuce pour le moment.</p>
  <?php else: ?>
    <div class="grid grid-3">
      <?php foreach ($tips as $t): ?>
        <article class="card">
          <h3><a href="<?= BASE_URL ?>tip/show/<?= (int)$t['id'] ?>"><?= htmlspecialchars($t['title']) ?></a></h3>
          <p class="muted"><?= htmlspecialchars($t['summary'] ?? '') ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</section>
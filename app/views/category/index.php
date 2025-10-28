<?php $title = "Catégories"; ?>
<section>
  <h1>Catégories</h1>
  <ul class="list">
    <?php foreach ($cats as $c): ?>
      <li>
        <a href="<?= BASE_URL ?>category/show/<?= (int)$c['id'] ?>"><?= htmlspecialchars($c['name']) ?></a>
        <span class="muted">— <?= htmlspecialchars($c['description'] ?? '') ?></span>
      </li>
    <?php endforeach; ?>
  </ul>
</section>
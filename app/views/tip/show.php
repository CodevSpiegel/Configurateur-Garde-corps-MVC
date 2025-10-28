<?php $title = htmlspecialchars($tip['title']); ?>
<article>
    <h1><?= htmlspecialchars($tip['title']) ?></h1>
    <p class="muted">Catégorie: <a href="<?= BASE_URL ?>category/show/<?= (int)$tip['category_id'] ?>"><?= htmlspecialchars($tip['category_name']) ?></a></p>
    <?php if (!empty($tip['summary'])): ?><p><strong>Résumé: </strong><?= htmlspecialchars($tip['summary']) ?></p><?php endif; ?>

    <h2>Explications</h2>
    <p><?= nl2br(htmlspecialchars($tip['content'])) ?></p>

    <?php if (!empty($tip['code'])): ?>
    <h2>Exemple de code</h2>
    <pre><code><?= htmlspecialchars($tip['code']) ?></code></pre>
    <?php endif; ?>
</article>
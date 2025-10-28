<?php $title = "Administration"; ?>
<section>
    <h1>Administration</h1>
    <div class="grid grid-2">
    <div>
        <h2>Catégories</h2>
        <p><a class="btn" href="<?= BASE_URL ?>admin/category/create">+ Nouvelle catégorie</a></p>
        <table class="table">
        <thead><tr><th>Nom</th><th>Slug</th><th></th></tr></thead>
        <tbody>
            <?php foreach ($cats as $c): ?>
            <tr>
                <td><?= htmlspecialchars($c['name']) ?></td>
                <td><code><?= htmlspecialchars($c['slug']) ?></code></td>
                <td class="actions">
                <a class="btn" href="<?= BASE_URL ?>admin/category/edit/<?= (int)$c['id'] ?>">Modifier</a>
                <form method="post" action="<?= BASE_URL ?>admin/category/delete/<?= (int)$c['id'] ?>" onsubmit="return confirm('Supprimer cette catégorie ?');">
                    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                    <button type="submit" class="btn danger">Supprimer</button>
                </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
        </table>
    </div>
    <div>
        <h2>Astuces (10 dernières)</h2>
        <p><a class="btn" href="<?= BASE_URL ?>admin/tip/create">+ Nouvelle astuce</a></p>
        <ul class="list">
        <?php foreach ($tips as $t): ?>
            <li>
            <a href="<?= BASE_URL ?>tip/show/<?= (int)$t['id'] ?>"><?= htmlspecialchars($t['title']) ?></a>
            <span class="muted">— <?= htmlspecialchars($t['category_name']) ?></span>
            <span class="actions">
                <a class="btn" href="<?= BASE_URL ?>admin/tip/edit/<?= (int)$t['id'] ?>">Modifier</a>
                <form method="post" action="<?= BASE_URL ?>admin/tip/delete/<?= (int)$t['id'] ?>" onsubmit="return confirm('Supprimer cette astuce ?');" style="display:inline">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <button type="submit" class="btn danger">Supprimer</button>
                </form>
            </span>
            </li>
        <?php endforeach; ?>
        </ul>
    </div>
    </div>
</section>
<?php 
    $title = "Liste des Utilisateurs";

    /** @var array $rows @var int $page @var int $pages @var int $total */
?>
<section>
    <h1>Administration</h1>
    <div class="grid">
    <div>
        <h2>Liste des Utilisateurs (<?= (int)$total ?>)</h2>
        <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Groupe</th>
                <th>Insciption</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $u): ?>
            <tr>
                <td><?= (int) $u['id'] ?></td>
                <td><?= htmlspecialchars(ucfirst($u['user_login']) ?? 'Visiteur') ?></td>
                <td><?= htmlspecialchars($u['user_email'] ?? 'N/C') ?></td>
                <td><code><?= htmlspecialchars($u['group_label']) ?></code></td>
                <td><?= $func->formatDateFr($u['user_registered'], 'heure') ?></td>
                <td class="actions">
                <a href="<?= BASE_URL ?>admin/users/show/<?= (int)$u['id'] ?>?page=<?= (int)$page ?>"><button class="btn">Détails</button></a>
                <form method="post" action="<?= BASE_URL ?>admin/users/delete/<?= (int)$u['id'] ?>" onsubmit="return confirm('Supprimer cet utilisateur ?');">
                    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                    <button type="submit" class="btn danger">Supprimer</button>
                </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
        </table>
    </div>
    </div>
    <?php if (!empty($pages) && $pages > 1): ?>
    <div class="pagination">
        <ul>
        <?php for ($p = 1; $p <= $pages; $p++): ?>
            <?php if ($p === (int)$page): ?>
            <li class="active"><?= $p ?></li>
            <?php else: ?>
            <a href="<?= BASE_URL ?>admin/users/list?page=<?= $p ?>"><li><?= $p ?></li></a>
            <?php endif; ?>
        <?php endfor; ?>
        </ul>
    </div>
    <?php endif; ?>
</section>
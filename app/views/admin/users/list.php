<?php
/*
 * ============================================================================
 * app\views\users\list.php
 * ============================================================================
 */

$title='Liste des Utilisateurs';

?>

<!-- WRAP ADMIN : sidebar + contenu -->
<div class="admin-wrap">
    <!-- Sidebar (collante en mobile, horizontale) -->
    <aside class="admin-sidebar">
        <a href="<?php BASE_URL ?>/admin">Tableau de bord</a>
        <a href="<?php BASE_URL ?>/admin/devis/list">Devis</a>
        <a class="active" href="<?php BASE_URL ?>/admin/users/list">Clients</a>
        <a href="<?php BASE_URL ?>/admin/settings">Paramètres</a>
    </aside>

    <!-- Contenu principal -->
    <main class="admin-main">
        <h1 class="mb-3">Liste des Clients (<?= (int)$total ?>)</h1>

        <!-- Tableau des derniers devis -->
        <div class="card">
            <div style="overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Utilisateur</th><th>Groupe</th><th>Email</th><th>Insciption</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                        <tr>
                            <td>#<?= $u['id'] ?></td>
                            <td><?= ucfirst($u['user_login']) ?></td>
                            <td><?= htmlspecialchars($u['group_label']) ?></td>
                            <td><?= $u['user_email'] ?></td>
                            <td><?= $func->formatDateFr($u['user_registered'], 'heure') ?></td>
                            <td>
                                <div class="admin-buttons">
                                    <a href="<?= BASE_URL ?>admin/users/show/<?= (int)$u['id'] ?>?page=<?= (int)$page ?>"><button class="btn btn-primary">Gerer</button></a>
                                    <form method="post" action="<?= BASE_URL ?>admin/user/delete/<?= (int)$u['id'] ?>" onsubmit="return confirm('Supprimer cet utilisateur ?');">
                                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                                        <button type="submit" class="btn btn-danger">Supprimer</button>
                                    </form>
                                </div>
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
    </main>
</div>

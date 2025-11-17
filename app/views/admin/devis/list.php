<?php
/*
 * ============================================================================
 * app\views\devis\list.php
 * ============================================================================
 */
?>

<!-- WRAP ADMIN : sidebar + contenu -->
<div class="admin-wrap">

    <?php
    $page_active = "devis";
    include_once ROOT . 'app/views/admin/includes/inc-asside.php';
    ?>

    <!-- Contenu principal -->
    <main class="admin-main">
        <div class="admin-page-title">
            <h1>Liste des devis</h1>
            <h2> (<?= (int)$total ?>)</h2>
        </div>

        <!-- Tableau des derniers devis -->
        <div class="card">
            <div style="overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Reférence</th><th>Client</th><th>Email</th><th>Date de création</th><th>Statut</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($row as $r): ?>
                        <tr>
                            <td>#<?= $r['id'] ?></td>
                            <td><a href="<?= BASE_URL ?>admin/users/show/<?= (int) $r['user_id'] ?>"><?= ucfirst($r['user_login']) ?></a></td>
                            <td><?= $r['user_email'] ?></td>
                            <td><?= $func->formatDateFr($r['create_date'], 'relative') ?></td>
                            <td><?= $r['label_status'] ?></td>
                            <td>
                                <div class="admin-buttons">
                                    <a href="<?= BASE_URL ?>admin/devis/show/<?= (int)$r['id'] ?>?page=<?= (int)$page ?>""><button class="btn btn-primary">Gerer</button></a>                            
                                    <form method="post" action="<?= BASE_URL ?>admin/devis/delete/<?= (int)$r['id'] ?>" onsubmit="return confirm('Supprimer ce devis ?');">
                                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                                        <button class="btn btn-danger" type="submit">Supprimer</button>
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
                <a href="<?= BASE_URL ?>admin/devis/list?page=<?= $p ?>"><li><?= $p ?></li></a>
                <?php endif; ?>
            <?php endfor; ?>
            </ul>
        </div>
        <?php endif; ?>
    </main>
</div>

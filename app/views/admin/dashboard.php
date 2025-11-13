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



<!-- WRAP ADMIN : sidebar + contenu -->
<div class="admin-wrap">
    <!-- Sidebar (collante en mobile, horizontale) -->
    <aside class="admin-sidebar">
        <a class="active" href="<?php BASE_URL ?>/admin">Tableau de bord</a>
        <a href="<?php BASE_URL ?>/admin/devis/list">Devis</a>
        <a href="<?php BASE_URL ?>/admin/users/list">Utilisateurs</a>
        <a href="<?php BASE_URL ?>/admin/settings">Paramètres</a>
    </aside>

    <!-- Contenu principal -->
    <main class="admin-main">
        <h1 class="mb-3">Tableau de bord</h1>

        <!-- KPI -->
        <div class="grid-3 mb-4">
            <div class="card">
                <div class="badge-kpi">Utilisateurs</div>
                <h2 class="mt-2"><?= (int)$totalUsers ?></h2>
                <p class="mt-1">Comptes actifs</p>
            </div>
            <div class="card">
                <div class="badge-kpi">Devis</div>
                <h2 class="mt-2"><?= (int)$totalDevis ?></h2>
                <p class="mt-1">Total des devis enregistrés</p>
            </div>
            <div class="card">
                <div class="badge-kpi">Validation</div>
                <h2 class="mt-2"><?= (int)$validation ?>%</h2>
                <p class="mt-1">Taux de devis acceptés</p>
            </div>
        </div>

        <!-- Tableau des derniers devis -->
        <div class="card">
            <h2 class="mb-2">Derniers devis</h2>
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
                                    <a href="<?= BASE_URL ?>admin/devis/show/<?= (int)$r['id'] ?>?page=1"><button class="btn btn-primary">Gerer</button></a>                            
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
    </main>
</div>

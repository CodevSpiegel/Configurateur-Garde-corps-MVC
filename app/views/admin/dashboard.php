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
        <a class="active" href="../admin/index.html">Tableau de bord</a>
        <a href="<?php BASE_URL ?>admin/devis/list">Devis</a>
        <a href="<?php BASE_URL ?>admin/users/list">Utilisateurs</a>
        <a href="<?php BASE_URL ?>admin/settings">Paramètres</a>
    </aside>

    <!-- Contenu principal -->
    <main class="admin-main">
        <h1 class="mb-3">Tableau de bord</h1>

        <!-- KPI -->
        <div class="grid-3 mb-4">
            <div class="card">
                <div class="badge-kpi">Devis</div>
                <h2 class="mt-2">128</h2>
                <p class="mt-1">Total des devis enregistrés</p>
            </div>
            <div class="card">
                <div class="badge-kpi">Utilisateurs</div>
                <h2 class="mt-2">42</h2>
                <p class="mt-1">Comptes actifs</p>
            </div>
            <div class="card">
                <div class="badge-kpi">Validation</div>
                <h2 class="mt-2">67%</h2>
                <p class="mt-1">Taux de devis validés</p>
            </div>
        </div>

        <!-- Tableau des derniers devis -->
        <div class="card">
            <h2 class="mb-2">Derniers devis</h2>
            <div style="overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th><th>Client</th><th>Type</th><th>Date</th><th>Statut</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>104</td><td>Martin</td><td>Verre latéral</td><td>05/11/2025</td><td>En cours</td>
                            <td><a class="btn btn-outline" href="#">Voir</a></td>
                        </tr>
                        <tr>
                            <td>103</td><td>Dupont</td><td>Câble au sol</td><td>04/11/2025</td><td>Validé</td>
                            <td><a class="btn btn-outline" href="#">Voir</a></td>
                        </tr>
                        <tr>
                            <td>102</td><td>Lefevre</td><td>Barres au sol</td><td>03/11/2025</td><td>Refusé</td>
                            <td><a class="btn btn-outline" href="#">Voir</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

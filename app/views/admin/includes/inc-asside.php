<?php
/*
 * ============================================================================
 * app\views\admin\includes\inc-asside.php
 * ============================================================================
 * Petite sidebar pour le back-office.
 *
 * - $page_active : string qui permet de savoir quel lien est "actif".
 *   valeurs possibles :
 *      'admin'     -> Dashboard
 *      'devis'     -> Gestion des devis
 *      'users'     -> Gestion des clients
 * ============================================================================
 */

// On sécurise la variable (évite les notices si non définie)
$page_active = $page_active ?? '';
?>

<!-- Sidebar (collante en mobile, horizontale) -->
<aside class="admin-sidebar">
    <a href="<?= BASE_URL ?>admin"
       class="<?= $page_active === 'admin' ? 'active' : '' ?>">
        Tableau de bord
    </a>

    <a href="<?= BASE_URL ?>admin/devis/list"
       class="<?= $page_active === 'devis' ? 'active' : '' ?>">
        Devis
    </a>

    <a href="<?= BASE_URL ?>admin/users/list"
       class="<?= $page_active === 'users' ? 'active' : '' ?>">
        Clients
    </a>
</aside>

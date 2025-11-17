<?php

    
?>
    <!-- Sidebar (collante en mobile, horizontale) -->
    <aside class="admin-sidebar">
        <a <?= $active = $page_active == "admin" ? 'class="active' : ""; ?> href="<?php BASE_URL ?>/admin">Tableau de bord</a>
        <a <?= $active = $page_active == "devis" ? 'class="active' : ""; ?> href="<?php BASE_URL ?>/admin/devis/list">Devis</a>
        <a <?= $active = $page_active == "users" ? 'class="active' : ""; ?> href="<?php BASE_URL ?>/admin/users/list">Clients</a>
        <!-- <a href="<?php BASE_URL ?>/admin/settings">Paramètres</a> -->
    </aside>

<?php $title = "Admin Devis"; ?>
<section>
    <h1>Administration</h1>
    <div class="grid grid-2">
    <div>
        <h2>Menu Principal</h2>
        <!-- <p><a class="btn" href="<?= BASE_URL ?>admindevis/devis/create">+ Nouveau devis</a></p> -->
        <table class="table">
        <thead>
            <tr>
                <th>Pages</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><a href="<?= BASE_URL ?>admindevis/users/list">Liste des Utilisateurs</a></td>
            </tr>
            <tr>
                <td><a href="<?= BASE_URL ?>admindevis/devis/list">Liste des Devis</a></td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
</section>
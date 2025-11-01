<?php $title = "Admin"; ?>
<section>
    <h1>Administration</h1>
    <div class="grid grid-2">
    <div>
        <h2>Menu Principal</h2>
        <table class="table">
        <thead>
            <tr>
                <th>Menu</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><a href="<?= BASE_URL ?>admin/devis/list">Devis</a></td>
            </tr>
            <tr>
                <td><a href="<?= BASE_URL ?>admin/users/list">Utilisateurs</a></td>
            </tr>
            <tr>
                <td><a href="<?= BASE_URL ?>admin/setup">Réglages</a></td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
</section>
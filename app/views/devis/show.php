<?php 
    $title = "Liste des Devis"; 
?>
<section>
    <h1>Administration</h1>

    <div class="grid grid-2">
    <div>
        <h2>Details du Devis #<?= $row['id'] ?></h2>
        <!-- <p><a class="btn" href="<?= BASE_URL ?>admindevis/devis/create">+ Nouveau devis</a></p> -->
        <table class="table">
        <thead>
            <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Inscription</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?= htmlspecialchars($row['user_login'] ?? 'Visiteur') ?></td>
                <td><?= htmlspecialchars($row['user_email'] ?? 'N/C') ?></td>
                <td><?= htmlspecialchars($func->formatDateFr($row['user_registered'], 'heure') ?? 'N/C') ?></td>
            </tr>
        </tbody>
        </table>
        <table class="table">
        <tbody>
            <tr>
                <td><a class="btn" href="<?= BASE_URL ?>admindevis/devis/update/<?= (int)$row['id'] ?>">Modifier</a></td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
</section>
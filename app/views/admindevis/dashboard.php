<?php $title = "Admin Devis"; ?>
<section>
    <h1>Administration</h1>
    <div class="grid grid-2">
    <div>
        <h2>Devis</h2>
        <!-- <p><a class="btn" href="<?= BASE_URL ?>admindevis/devis/create">+ Nouveau devis</a></p> -->
        <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Modèle</th>
                <th>Type</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($devis as $d): ?>
            <tr>
                <td><?= $d['create_date'] ?></td>
                <td><code><?= htmlspecialchars($d['model_label']) ?></code></td>
                <td><code><?= htmlspecialchars($d['type_label']) ?></code></td>
                <td class="actions">
                <a class="btn" href="<?= BASE_URL ?>admindevis/devis/show/<?= (int)$d['id'] ?>">Détails</a>
                <form method="post" action="<?= BASE_URL ?>admindevis/devis/delete/<?= (int)$d['id'] ?>" onsubmit="return confirm('Supprimer ce devis ?');">
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
</section>
<?php
/*
 * ============================================================================
 * app\views\auth\details_devis.php
 * ============================================================================
 */
?>

<section class="section">
    <div class="container">
        <div class="card">
        <div class="card-header">
            <span class="dot"></span>
            <span class="card-title">Mes devis</span>
        </div>
        <div class="card-body">
            <div style="overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Modèle</th>
                            <th>Type</th>
                            <th>Forme</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($devis as $d): ?>
                        <tr>
                            <td><?=$d['id'] ?></td>
                            <td><?= $func->formatDateFr($d['create_date'], 'relative') ?></td>
                            <td><?= $d['model_label'] ?></td>
                            <td><?= $d['type_label'] ?></td>
                            <td><?= $d['forme_label'] ?></td>
                            <td><?= $d['label_status'] ?></td>
                            <td><a class="btn btn-outline" href="/auth/showDevis/<?=$d['id'] ?>">Détails</a></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
</section>
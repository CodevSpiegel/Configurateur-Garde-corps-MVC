<?php
/*
 * ============================================================================
 * app\views\auth\reset.php
 * ============================================================================
 */

$title='Nouveau mot de passe';

?>

<section class="section">
    <div class="container">
    <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
    </div>
    <div class="container" style="max-width:500px;">
        <div class="card">
            <h1 class="mb-3">Nouveau mot de passe</h1>
            <form class="grid-2" method="post" action="/auth/reset/<?= htmlspecialchars($token ?? '') ?>">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <input type="hidden" name="token" value="<?= htmlspecialchars($token ?? '') ?>">
                <div style="grid-column: 1 / -1;">
                    <label for="password">Mot de passe actuel</label>
                    <input class="input" type="password" id="password" name="password"" placeholder="Votre mot de passe actuel" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="newpassword">Nouveau mot de passe</label>
                    <input class="input" type="password" id="newpassword" name="newpassword"" placeholder="Votre nouveau mot de passe" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="newpasswordConfirm">Confirmez le nouveau mot de passe</label>
                    <input class="input" type="password" id="newpasswordConfirm" name="newpasswordConfirm"" placeholder="Confirmez le nouveau mot de passe" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <button class="btn btn-primary" type="submit">Mettre à jour</button>
                </div>
            </form>
        </div>
    </div>
</section>

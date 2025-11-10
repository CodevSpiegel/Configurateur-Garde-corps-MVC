<?php
/*
 * ============================================================================
 * aapp\views\auth\forgot.php
 * ============================================================================
 */

$title='Mot de passe perdu';

?>

<section class="section">
    <div class="container">
    <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
    </div>
    <div class="container" style="max-width:500px;">
        <div class="card">
            <h1 class="mb-3">Mot de passe perdu</h1>
            <form class="grid-2" method="post" action="/auth/forgot">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <div style="grid-column: 1 / -1;">
                    <label for="email">Email</label>
                    <input class="input" type="email" id="email" name="email" placeholder="Indiquez votre adresse email" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <button class="btn btn-primary" type="submit">Envoyer le lien</button>
                </div>
            </form>
        </div>
    </div>
</section>

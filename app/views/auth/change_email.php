<?php
/*
 * ============================================================================
 * app\views\auth\change_email.php
 * ============================================================================
 */
?>

<section class="section">
    <div class="container">
        <?php if (!empty($error)): ?><p class="alert alert-danger"><?= htmlspecialchars($error) ?></p><?php endif; ?>
        <?php if (!empty($msg)): ?><p class="alert alert-success"><?= htmlspecialchars($msg) ?></p><?php endif; ?>
        </div>
        <div class="container" style="max-width:500px;">
            <section class="card">
            <h1 class="mb-3">Changement d'email</h1>
            <form class="grid-2" method="post" action="/auth/email">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <div style="grid-column: 1 / -1;">
                    <label for="password">Mot de passe</label>
                    <input class="input" type="password" id="password" name="password"" placeholder="Votre mot de passe" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="email">Votre nouvel email</label>
                    <input class="input" id="email" name="email" placeholder="Indiquez votre nouvelle adresse email" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <button class="btn btn-primary" type="submit">Valider</button>
                </div>
            </form>
            </section>
        </div>
    </div>
</section>


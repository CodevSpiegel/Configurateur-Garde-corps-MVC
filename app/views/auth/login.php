<?php
/*
 * ============================================================================
 * app\views\auth\login.php
 * ============================================================================
 */

$title='Connexion';

?>

<?php if (!empty($error)): ?>
    <p class="alert alert-danger">
        <?= htmlspecialchars($error) ?>
    </p>
<?php endif; ?>

<?php if (!empty($msg)): ?>
    <p class="alert alert-success">
        <?= htmlspecialchars($msg) ?>
    </p>
<?php endif; ?>

<section class="section">
    <div class="container">
        <div class="grid-2">
            <!-- Connexion -->
            <section class="card">
            <h1 class="mb-3">Connexion</h1>
            <form class="grid-2" method="post" action="/auth/login">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <div style="grid-column: 1 / -1;">
                    <label for="identity">Login ou email</label>
                    <input class="input" id="identity" name="identity" placeholder="Login ou adresse email" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="password">Mot de passe</label>
                    <input class="input" type="password" id="password" name="password"" placeholder="Votre mot de passe" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="remember"><input type="checkbox" id="remember" name="remember"> Se souvenir de moi</label>
                </div>
                <div style="grid-column: 1 / -1;">
                    <button class="btn btn-primary" type="submit">Se connecter</button>
                </div>
                <div style="grid-column: 1 / -1;">
                    <a class="btn btn-outline" href="/auth/forgot">Mot de passe oublié</a>
                </div>
            </form>
            </section>

            <!-- Inscription -->
            <section class="card">
            <h2 class="mb-3">Créer un compte</h2>
            <form class="grid-2" method="post" action="/auth/register">
                <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
                <div style="grid-column: 1 / -1;">
                    <label for="login">Login</label>
                    <input class="input" id="login" name="login" placeholder="Votre Login" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label for="email">Email</label>
                    <input class="input" type="email" id="email" name="email" placeholder="Votre adresse email" required>
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input class="input" type="password" id="password" name="password" placeholder="••••••••" required>
                </div>
                <div>
                    <label for="passwordConfirm">Confirmer</label>
                    <input class="input" type="password" id="passwordConfirm" name="passwordConfirm" placeholder="••••••••" required>
                </div>
                <div style="grid-column: 1 / -1;">
                    <button class="btn btn-primary" type="submit">Créer mon compte</button>
                </div>
            </form>
            </section>
        </div>
    </div>
</section>

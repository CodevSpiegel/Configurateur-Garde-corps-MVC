<?php
/*
 * ============================================================================
 * app\views\layout\header.php
 * ============================================================================
 */
$title = $title ?? SITE_TITLE;
$description = $description ?? SITE_DESCRIPTION;

require_once ROOT . 'app/core/Sessions.php';
$S = new Sessions();
$u = $S->user();
?>
<!DOCTYPE html>
<html lang="<?= SITE_LANGUAGE; ?>">
<head>
    <meta charset="<?= SITE_CHARSET; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($title) ?></title>
    <meta name="description" content="<?= htmlspecialchars($description) ?>">
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
    <script>window.APP_BASE_URL = '<?= rtrim(BASE_URL, "/") . "/" ?>';</script>
</head>
<body>
<header class="navbar">
<div class="container row">
    <div class="brand">FRANCE <span style="font-weight:300">INOX</span></div>
    <!-- Bouton burger (mobile) -->
    <input type="checkbox" id="nav-toggle">
    <label class="nav-toggle-label" for="nav-toggle"><span></span></label>
    <!-- Menu -->
    <nav class="nav">
        <a class="active" href="<?= BASE_URL ?>">Accueil</a>
        <a class="active" href="<?= BASE_URL ?>presentation">Présentation</a>
        <a href="<?= BASE_URL ?>configurateur">Configurateur</a>
<?php if ($u): ?>
        <a href="<?= BASE_URL ?>auth/profile">Mon compte</a>
<?php if ($S->isAdmin()): ?>
        <a href="<?= BASE_URL ?>admin">Administration</a>
<?php endif; ?>
        <a href="<?= BASE_URL ?>auth/logout">Déconnexion</a>
<?php else: ?>
        <a href="<?= BASE_URL ?>auth/login">Connexion</a>
<?php endif; ?>
    </nav>
</div>
</header>
<main>
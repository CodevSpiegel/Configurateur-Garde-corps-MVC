<?php
$title = $title ?? 'Configurateur';

require_once __DIR__ . '/../../core/Sessions.php';
$S = new Sessions();
$u = $S->user();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($title) ?></title>
    <meta name="description" content="Guide pratique et CRUD d'astuces pour HTML, CSS, JavaScript, PHP et MySQL.">
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
    <script>window.APP_BASE_URL = '<?= rtrim(BASE_URL, "/") . "/" ?>';</script>
</head>
<body>
<header class="site-header">
    <div class="container row">
        <a class="brand" href="<?= BASE_URL ?>">Configurateur</a>
        <nav class="main-nav" aria-label="Principale">
            <a href="<?= BASE_URL ?>">Présentation</a>
            <a href="<?= BASE_URL ?>configurateur">Devis Garde-corps</a>
            <?php if ($u): ?>
            <a href="<?= BASE_URL ?>auth/profile">@<?= htmlspecialchars($u['user_login']) ?></a>
            <?php if ($S->isAdmin()): ?><a href="<?= BASE_URL ?>admin">Admin</a><?php endif; ?>
            <a href="<?= BASE_URL ?>auth/logout">Se déconnecter</a>
            <?php else: ?>
                <a href="<?= BASE_URL ?>auth/login">Connexion</a>
                <a href="<?= BASE_URL ?>auth/register">Inscription</a>
            <?php endif; ?>
        </nav>
    </div>
</header>
<main class="container content">
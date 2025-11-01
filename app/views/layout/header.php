<?php
// views/layout/header.php — Entête HTML global + nav
$title = $title ?? 'Configurateur';
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
            <a href="<?= BASE_URL ?>admin">Admin</a>
        </nav>
        
    </div>
</header>
<main class="container content">
<?php

class global_view {

function site_head(array $datas) {
global $site;
return <<<HTML
    <meta charset="UTF-8">
    <title>{$datas['HEAD_TITLE']}</title>
    <meta name="description" content="{$datas['HEAD_DESCRIPTION']}">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="canonical" href="{$site->const['WEBSITE_URL']}">
    <!-- <link rel="icon" href="{$site->const['PUBLIC_PATH']}assets/images/favicon.ico" type="image/x-icon"> -->
    <!-- BALISES OPEN GRAPH (Facebook, LinkedIn, etc.) -->
    <meta property="og:title" content="Formation PHP MVC - Tutoriel complet">
    <meta property="og:description" content="Apprenez à créer un site PHP MVC pas à pas. Idéal pour débutants et confirmés.">
    <meta property="og:image" content="https://www.monsite.com/images/php-mvc.jpg">
    <meta property="og:url" content="https://www.monsite.com/php-mvc">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="fr_FR">
    <!-- BALISES TWITTER CARDS -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Formation PHP MVC - Tutoriel complet">
    <meta name="twitter:description" content="Apprenez à créer un site PHP MVC pas à pas avec un routeur puissant et SEO-friendly.">
    <meta name="twitter:image" content="https://www.monsite.com/images/php-mvc.jpg">
    <meta name="twitter:site" content="@MonCompteTwitter">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <!-- <link rel="stylesheet" href="{$site->const['PUBLIC_PATH']}assets/css/style.css"> -->

    <!-- Balises meta supplémentaires utiles -->
    <!-- Empêche la mise en cache si besoin (déconseillé en production) -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <!-- Indique aux navigateurs de toujours utiliser HTTPS -->
    <!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> -->

HTML;
}

function site_header() {
global $site;
return <<<HTML
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/home/action-01">Home-Action 1</a></li>
        <li><a href="/home/action-02">Home-Action 2</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/nimpxxxxx">Home-404</a></li>
        <li><a href="/home/action-01/?test=<script>alert(`Si ça passe... Ca craint un max là !`)</script>">Home-404</a></li>
    </ul>
</nav>

HTML;
}


function site_footer() {
global $site;
return <<<HTML
    Global->Footer

HTML;
}


function site_debug(string $datas) {
global $site;
return <<<HTML
<style>
    .debug {
        display: flex;
        color: #ff0000;
    }
</style>
<div class="debug">$datas</div>

HTML;
}

}
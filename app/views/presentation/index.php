<?php
/*
 * ============================================================================
 * app\views\home\index.php
 * ============================================================================
 */
?>

<section class="section">
    <div class="container">
        <h1>Mini CMS (PHP - MVC - POO)</h1>
        <p class="lead">Ce projet inclut :</p>
        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Front-End</span>
                </div>
                <div class="card-body">
                    <ul>
                        <li>Configurateur de devis en pur JavaScript (vanilla)</li>
                        <li>Inscription + email de confirmation</li>
                        <li>Connexion / Déconnexion</li>
                        <li>Mot de passe oublié / reset</li>
                        <li>Espace utilisateur (changement email / mot de passe)</li>
                        <li>Liste des mes devis (Paginations)</li>
                    </ul>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="dot"></span>
                    <span class="card-title">Back-End</span>
                </div>
                <div class="card-body">
                    <ul>
                        <li>Architecture MVC & Class PDO</li>
                        <li>Router (SEO friendly) avec segments illimités</li>
                        <li>Sessions persistantes en BDD (cookie + table <code>user_sessions</code>)</li>
                        <li>Sécurité CSRF tokens sur tous les formulaires</li>
                        <li>Gestion des utilisteurs & devis (CRUD Complet)</li>
                        <li>Listes & Paginations</li>
                        <li>Hachage des mots de passe (password_hash)</li>
                        <li>Envois d'emails (Inscriptions, Devis)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
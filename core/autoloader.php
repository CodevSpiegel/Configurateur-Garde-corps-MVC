<?php

// ============================================================================
// SCRIPT DE ROUTAGE ET AUTOCHARGEMENT DES CLASSES
// ============================================================================
// Ce script a pour but de :
// 1. Charger automatiquement les fichiers de classes du projet (autoload)
// 2. Récupérer l'URL demandée par l'utilisateur
// 3. Déterminer quel contrôleur et quelle méthode exécuter
// 4. Gérer les erreurs 404 si la page demandée n'existe pas
// ============================================================================

// ---------------------------------------------------------------------------
// 1. AUTOCHARGEMENT DES CLASSES (AUTOLOAD)
// ---------------------------------------------------------------------------
// Cette fonction est appelée automatiquement lorsqu'une classe est utilisée
// mais que son fichier n'a pas encore été inclus. Elle évite de faire des
// "require" ou "include" partout dans le code.

// Déclaration de la fonction d'autoload personnalisée
function autoload($class) {
    // Liste des dossiers où chercher les classes
    // Ici, uniquement "controllers" et "models", mais on peut en ajouter d'autres
    $paths = ['controllers', 'models'];

    // On parcourt chacun des dossiers définis ci-dessus
    foreach ($paths as $path) {
        // Construction du chemin du fichier
        // Exemple : ROOT . 'controllers/home_controller.php'
        // strtolower($class) -> on force en minuscule pour correspondre au nom de fichier
        $file = ROOT . $path . '/' . strtolower($class) . '.php';

        // Vérifie si le fichier existe à cet emplacement
        if (file_exists($file)) {
            // Si oui, on l'inclut et on arrête la recherche
            require_once $file;
            return; // On sort de la fonction dès que la classe est trouvée
        }
    }
}

// On enregistre notre fonction autoload pour qu'elle soit utilisée automatiquement
// à chaque fois qu'une classe est appelée et non encore incluse
spl_autoload_register('autoload');

// ---------------------------------------------------------------------------
// ROUTER
// ---------------------------------------------------------------------------
require_once ROOT . 'core/router.php';
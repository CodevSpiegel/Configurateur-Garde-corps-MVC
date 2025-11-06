<?php
/**
 * ============================================================================
 * app\core\Database.php
 * ============================================================================
 * ✨ CLASSE DE CONNEXION À LA BASE DE DONNÉES (PDO)
 * 
 * ➤ Rôle :
 *   Cette classe centralise la connexion à la base de données MySQL.
 *   Elle utilise PDO (PHP Data Objects) pour plus de sécurité et de souplesse.
 * 
 * ➤ Avantages :
 *   ✅ Connexion unique et réutilisable (Singleton)
 *   ✅ Sécurité : requêtes préparées, gestion des erreurs
 *   ✅ Compatibilité : PDO fonctionne aussi avec d'autres SGBD (PostgreSQL, SQLite, etc.)
 * ============================================================================
 */

class Database {

    /**
     * --------------------------------------------------------------------------
     * 🔒 Propriété statique $pdo
     * --------------------------------------------------------------------------
     * ➤ Elle stocke **l’unique instance** de connexion PDO pour toute l’application.
     * 
     * Pourquoi ?
     * → Pour éviter de rouvrir une nouvelle connexion à chaque requête SQL.
     * → Cela améliore les performances et réduit la charge du serveur.
     * 
     * Le "?" signifie que la variable peut être soit un objet PDO, soit NULL.
     */
    private static ?PDO $pdo = null;


    /**
     * --------------------------------------------------------------------------
     * ⚙️ Méthode statique getInstance()
     * --------------------------------------------------------------------------
     * ➤ Retourne une instance unique de PDO.
     * ➤ Si elle n’existe pas encore, elle est créée une seule fois.
     * 
     * Exemple d’utilisation :
     *   $db = Database::getInstance();
     *   $stmt = $db->query("SELECT * FROM users");
     */
    public static function getInstance(): PDO {

        // Si la connexion n’a pas encore été créée...
        if (self::$pdo === null) {

            // ----------------------------------------------------------
            // 🔧 Construction de la chaîne DSN (Data Source Name)
            // ----------------------------------------------------------
            // Format DSN pour MySQL :
            //   mysql:host=HOTE;dbname=NOM_BDD;charset=ENCODAGE
            //
            // Les constantes (DB_HOST, DB_NAME, etc.) sont définies dans config.php
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;

            // ----------------------------------------------------------
            // 🧩 Création de l'objet PDO avec ses options
            // ----------------------------------------------------------
            // PDO prend 4 arguments :
            //   1. Le DSN complet (ex: mysql:host=127.0.0.1;dbname=mon_mvc;charset=utf8mb4)
            //   2. Le nom d'utilisateur de la BDD (DB_USER)
            //   3. Le mot de passe (DB_PASS)
            //   4. Un tableau d’options supplémentaires
            self::$pdo = new PDO($dsn, DB_USER, DB_PASS, [

                // ------------------------------------------------------
                // 🚨 Mode d’affichage des erreurs :
                // ------------------------------------------------------
                // PDO::ERRMODE_EXCEPTION → Les erreurs déclenchent des exceptions
                // Cela permet de les "attraper" avec try/catch et de les gérer proprement.
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,

                // ------------------------------------------------------
                // 📦 Mode de récupération par défaut :
                // ------------------------------------------------------
                // FETCH_ASSOC → les résultats sont renvoyés sous forme de tableau associatif
                // Exemple : ['id' => 1, 'nom' => 'Sébastien']
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

                // ------------------------------------------------------
                // 🗣️ Commande d’initialisation MySQL :
                // ------------------------------------------------------
                // Permet d’être sûr que la connexion utilise bien le bon encodage.
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ]);
        }

        // Si la connexion existait déjà, on la réutilise simplement
        return self::$pdo;
    }
}

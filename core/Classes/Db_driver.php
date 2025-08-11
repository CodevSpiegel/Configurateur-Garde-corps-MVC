<?php

class Db_driver {

    private $dbh; // Database handler (Gestion)
    private $stmt; // Statement (Déclaration)
    private $error; // Pour stocker les erreurs

    // Paramètres de connexion à définir via les constantes dans le fichier de configuration (conf_global.php)
    private $host = DATABASE_HOST;
    private $user = DATABASE_USER;
    private $pass = DATABASE_PASSWORD;
    private $dbname = DATABASE_NAME;
    private $charset = DATABASE_CHARSET;

    public function __construct() {
        // Construction du DSN (Data Source Name)
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname . ';charset=' . $this->charset;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Lance des exceptions en cas d'erreur
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Mode de récupération par défaut : tableau associatif
            PDO::ATTR_EMULATE_PREPARES => false, // Désactive l'émulation des requêtes préparées pour une meilleure sécurité et performance
        ];

        // Tentative de connexion à la base de données
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            // En production, il est préférable de logger l'erreur plutôt que de l'afficher directement
            throw new Exception("Erreur de connexion à la base de données : " . $this->error);
        }
    }

    /**
     * Prépare une requête SQL.
     * @param string $sql La requête SQL à préparer.
     */
    public function query(string $sql): void {
        $this->stmt = $this->dbh->prepare($sql);
    }

    /**
     * Lie une valeur à un paramètre nommé ou positionnel dans la requête préparée.
     * @param string|int $param Le nom du paramètre (ex: ':id') ou sa position (ex: 1).
     * @param mixed $value La valeur à lier.
     * @param int|null $type Le type de données PDO (ex: PDO::PARAM_INT). Détecté automatiquement si null.
     */
    public function bind($param, $value, ?int $type = null): void {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    /**
     * Exécute la requête préparée.
     * @return bool True en cas de succès, false sinon.
     */
    public function execute(): bool {
        return $this->stmt->execute();
    }

    /**
     * Récupère toutes les lignes du jeu de résultats sous forme de tableau associatif.
     * @return array Un tableau des lignes.
     */
    public function fetchAll(): array {
        $this->execute();
        return $this->stmt->fetchAll();
    }

    /**
     * Récupère une seule ligne du jeu de résultats sous forme de tableau associatif.
     * @return array|false Un tableau représentant la ligne, ou false si aucune ligne n'est disponible.
     */
    public function fetchOne() {
        $this->execute();
        return $this->stmt->fetch();
    }

    /**
     * Retourne le nombre de lignes affectées par la dernière requête DELETE, INSERT ou UPDATE.
     * @return int Le nombre de lignes.
     */
    public function rowCount(): int {
        return $this->stmt->rowCount();
    }

    /**
     * Retourne l'ID de la dernière ligne insérée.
     * @return string L'ID de la dernière ligne insérée.
     */
    public function lastInsertId(): string {
        return $this->dbh->lastInsertId();
    }
}

// --- CRUD - Exemple d'utilisation ---

//     $db = new Db_driver();

//     // 1. Sélectionner une seule ligne
//     echo "<h2>Sélectionner un utilisateur (ID 1)</h2>";
//     $db->query("SELECT id, name, email FROM users WHERE id = :id");
//     $db->bind(':id', 1);
//     $user = $db->fetchOne();
//     if ($user) {
//         echo "Nom: " . htmlspecialchars($user['name']) . ", Email: " . htmlspecialchars($user['email']) . "<br>";
//     } else {
//         echo "Utilisateur non trouvé.<br>";
//     }

//     // 2. Sélectionner plusieurs lignes
//     echo "<h2>Sélectionner tous les utilisateurs</h2>";
//     $db->query("SELECT id, name, email FROM users ORDER BY id DESC");
//     $users = $db->fetchAll();
//     if (!empty($users)) {
//         foreach ($users as $u) {
//             echo "ID: " . htmlspecialchars($u['id']) . ", Nom: " . htmlspecialchars($u['name']) . ", Email: " . htmlspecialchars($u['email']) . "<br>";
//         }
//     } else {
//         echo "Aucun utilisateur trouvé.<br>";
//     }

//     // 3. Insérer une nouvelle ligne
//     echo "<h2>Insérer un nouvel utilisateur</h2>";
//     $newName = 'Alice Dubois';
//     $newEmail = 'alice.dubois@example.com';
//     $db->query("INSERT INTO users (name, email) VALUES (:name, :email)");
//     $db->bind(':name', $newName);
//     $db->bind(':email', $newEmail);
//     if ($db->execute()) {
//         $lastId = $db->lastInsertId();
//         echo "Nouvel utilisateur inséré avec l'ID : " . $lastId . "<br>";
//     } else {
//         echo "Erreur lors de l'insertion de l'utilisateur.<br>";
//     }

//     // 4. Mettre à jour une ligne
//     echo "<h2>Mettre à jour un utilisateur</h2>";
//     $updatedName = 'Alice Dupont';
//     $userIdToUpdate = $lastId; // Utilise l'ID de l'utilisateur qui vient d'être inséré
//     $db->query("UPDATE users SET name = :name WHERE id = :id");
//     $db->bind(':name', $updatedName);
//     $db->bind(':id', $userIdToUpdate);
//     if ($db->execute()) {
//         echo "Utilisateur ID " . $userIdToUpdate . " mis à jour.<br>";
//     } else {
//         echo "Erreur lors de la mise à jour de l'utilisateur.<br>";
//     }

//     // 5. Supprimer une ligne
//     echo "<h2>Supprimer un utilisateur</h2>";
//     $userIdToDelete = $lastId; // Supprime l'utilisateur qui vient d'être mis à jour
//     $db->query("DELETE FROM users WHERE id = :id");
//     $db->bind(':id', $userIdToDelete);
//     if ($db->execute()) {
//         echo "Utilisateur ID " . $userIdToDelete . " supprimé.<br>";
//     } else {
//         echo "Erreur lors de la suppression de l'utilisateur.<br>";
//     }

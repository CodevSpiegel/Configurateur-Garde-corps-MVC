<?php
/**
 * Db_driver — Driver PDO “maison” avec utilitaires
 * --------------------------------------------------------------------------
 * Améliorations clés par rapport à ta version :
 *  - Expose l'instance PDO via pdo() pour les modèles (ex: gardecorps_model)
 *  - Helpers transaction: begin(), commit(), rollBack(), inTransaction()
 *  - Helpers de bind nullable: bindNullableInt(), bindNullableFloat()
 *  - Helpers génériques de résolution slug -> id:
 *      * idFromSlug($table, $slugCol, $slug)
 *      * idTypeFromSlugWithinModel($typeSlug, $modelId)
 *  - fetchColumn() pratique pour récupérer une seule valeur
 *
 * Requis côté config:
 *  - DATABASE_HOST
 *  - DATABASE_USER
 *  - DATABASE_PASSWORD
 *  - DATABASE_NAME
 *  - DATABASE_CHARSET  (⚠️ conseille "utf8mb4")
 */

class Db_driver {

    /** @var PDO $pdo  Handler PDO (connexion) */
    private $pdo;

    /** @var PDOStatement|null $stmt Dernière requête préparée */
    private $stmt;

    /** @var string|null $error Dernière erreur texte (si besoin) */
    private $error;

    // Paramètres (déduits des constantes globales)
    private $host    = DATABASE_HOST;
    private $user    = DATABASE_USER;
    private $pass    = DATABASE_PASSWORD;
    private $dbname  = DATABASE_NAME;
    private $charset = DATABASE_CHARSET; // ⚠️ mets 'utf8mb4' dans ta config

    public function __construct() {
        /**
         * DSN avec charset explicite : évite SET NAMES manuel
         * Exemple: mysql:host=127.0.0.1;dbname=cfgweb;charset=utf8mb4
         */
        $dsn = 'mysql:host=' . $this->host
             . ';dbname=' . $this->dbname
             . ';charset=' . $this->charset;

        // Options PDO robustes
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Exceptions sur erreurs
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // fetch() -> array associatif
            PDO::ATTR_EMULATE_PREPARES   => false,                  // Préparations natives MySQL
        ];

        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);

            // Optionnel : si tu veux aligner STRICT_MODE, time zone, etc., fais-le ici.
            // $this->pdo->query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            // $this->pdo->query("SET time_zone = '+00:00'");
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            // En prod, log plutôt que d'afficher
            throw new Exception("Erreur de connexion à la base de données : " . $this->error);
        }
    }

    // ---------------------------------------------------------------------
    // Accès natif & transactions
    // ---------------------------------------------------------------------

    /**
     * Retourne l’instance PDO (accès natif pour tes modèles).
     */
    public function getConnection(): PDO {
        return $this->pdo;
    }

    /**
     * Démarre une transaction.
     */
    public function begin(): void {
        if (!$this->pdo->inTransaction()) {
            $this->pdo->beginTransaction();
        }
    }

    /**
     * Valide (commit) la transaction en cours.
     */
    public function commit(): void {
        if ($this->pdo->inTransaction()) {
            $this->pdo->commit();
        }
    }

    /**
     * Annule (rollback) la transaction en cours.
     */
    public function rollBack(): void {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }

    /**
     * Indique si on est en transaction.
     */
    public function inTransaction(): bool {
        return $this->pdo->inTransaction();
    }

    // ---------------------------------------------------------------------
    // API “classique” que tu avais déjà (query/bind/execute/fetch…)
    // ---------------------------------------------------------------------

    /**
     * Prépare une requête SQL.
     */
    public function query(string $sql): void {
        $this->stmt = $this->pdo->prepare($sql);
    }

    /**
     * Lie une valeur à un paramètre (auto-détection du type si $type null).
     */
    public function bind($param, $value, ?int $type = null): void {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;  break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL; break;
                case is_null($value):
                    $type = PDO::PARAM_NULL; break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    /**
     * Exécute la requête préparée.
     */
    public function execute(): bool {
        return $this->stmt->execute();
    }

    /**
     * Récupère toutes les lignes.
     */
    public function fetchAll(): array {
        $this->execute();
        return $this->stmt->fetchAll();
    }

    /**
     * Récupère une ligne.
     */
    public function fetchOne() {
        $this->execute();
        return $this->stmt->fetch();
    }

    /**
     * Récupère une seule colonne (col 0 par défaut).
     */
    public function fetchColumn(int $column = 0) {
        $this->execute();
        return $this->stmt->fetchColumn($column);
    }

    /**
     * Nombre de lignes affectées (INSERT/UPDATE/DELETE).
     */
    public function rowCount(): int {
        return $this->stmt->rowCount();
    }

    /**
     * Dernier ID auto-incrément inséré.
     */
    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }

    // ---------------------------------------------------------------------
    // Helpers de bind “nullable” (très pratiques dans les modèles)
    // ---------------------------------------------------------------------

    /**
     * Lie un entier nullable (INT ou NULL).
     */
    public function bindNullableInt($param, $value): void {
        if ($value === null || $value === '') {
            $this->stmt->bindValue($param, null, PDO::PARAM_NULL);
        } else {
            $this->stmt->bindValue($param, (int)$value, PDO::PARAM_INT);
        }
    }

    /**
     * Lie un float/decimal nullable (FLOAT/DECIMAL ou NULL).
     * (Il n’existe pas de PDO::PARAM_FLOAT ; on passe la valeur scalaire).
     */
    public function bindNullableFloat($param, $value): void {
        if ($value === null || $value === '') {
            $this->stmt->bindValue($param, null, PDO::PARAM_NULL);
        } else {
            $this->stmt->bindValue($param, (float)$value);
        }
    }

    // ---------------------------------------------------------------------
    // Helpers “slug → id” génériques (réduisent le code dans tes modèles)
    // ---------------------------------------------------------------------

    /**
     * Résout un slug dans une table donnée.
     * @return int|null id trouvé ou null si slug vide/inconnu
     */
    public function idFromSlug(?string $slug, string $table, string $slugCol): ?int {
        if ($slug === null || $slug === '') return null;

        $sql = "SELECT id FROM {$table} WHERE {$slugCol} = :slug LIMIT 1";
        $this->query($sql);
        $this->bind(':slug', $slug);
        $row = $this->fetchOne();

        return $row ? (int)$row['id'] : null;
    }

    /**
     * Cas fréquent : récupérer l’id d’un type à partir de son slug
     * en vérifiant qu’il appartient au bon modèle.
     * Table: cfg_types (id, slug_type, model_id)
     */
    public function idTypeFromSlugWithinModel(?string $typeSlug, int $modelId): ?int {
        if ($typeSlug === null || $typeSlug === '') return null;

        $sql = "SELECT t.id
                FROM cfg_types t
                WHERE t.slug_type = :slug
                  AND t.model_id  = :mid
                LIMIT 1";
        $this->query($sql);
        $this->bind(':slug', $typeSlug);
        $this->bind(':mid',  $modelId, PDO::PARAM_INT);
        $row = $this->fetchOne();

        return $row ? (int)$row['id'] : null;
    }
}

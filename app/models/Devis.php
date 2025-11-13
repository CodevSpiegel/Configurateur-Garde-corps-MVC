<?php

/**
 * ============================================================================
 * app\models\Devis.php
 * ============================================================================
 * Modèle ultra-simple utilisant la base Model (qui fournit $this->db via Database::getInstance())
 * Insert strict dans cfg_devis avec IDs + mesures, en respectant les types existants.
 */

class Devis extends Model
{
    /** Compte total des devis (pour la pagination) */
    public function countAll(): int {
        return (int)$this->db->query("SELECT COUNT(*) FROM cfg_devis")->fetchColumn();
    }

    /** Compte total des devis validés */
    public function countValidate(): int {
        return (int)$this->db->query("SELECT COUNT(*) FROM cfg_devis WHERE id_status = 3")->fetchColumn();
    }

    /**
     * Liste paginée (10/pg par défaut)
     */
    public function list( int $page = 1, int $perPage = 10 ): array {
        $offset = max(0, ($page - 1) * $perPage);
        $sql = "SELECT
                d.id, d.user_id, d.create_date,
                u.user_login, u.user_email,
                s.label_status
                FROM cfg_devis d
                LEFT JOIN users  u ON d.user_id = u.id
                LEFT JOIN cfg_status s ON d.id_status = s.id
                ORDER BY d.id DESC
                LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':limit',  $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset,  PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* Retourne le nombre de devis par statut pour UN utilisateur. */
    public function getCountsByStatusForUser(int $userId): array
    {
        $sql = "SELECT
                s.label_status   AS statut,
                COUNT(d.id)      AS total_devis
                FROM cfg_status s
                LEFT JOIN cfg_devis d 
                ON d.id_status = s.id
                AND d.user_id   = :user_id
                GROUP BY s.id, s.label_status
                ORDER BY s.id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* Retourne le nombre de devis par statut POUR TOUS LES UTILISATEURS. */
    public function getCountsByStatusAllUsers(): array
    {
        $sql = "SELECT
                u.user_login        AS user_login,
                s.label_status      AS statut,
                COUNT(d.id)         AS total_devis
                FROM users u
                LEFT JOIN cfg_devis d 
                ON d.user_id = u.id
                LEFT JOIN cfg_status s
                ON s.id = d.id_status
                GROUP BY u.id, u.user_login, s.id, s.label_status
                ORDER BY u.user_login, s.id";

        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function show(int $id): array {

        $sql = "SELECT
            d.id,
            d.user_id,
            d.type_id,
            d.finition_id,
            d.pose_id,
            d.ancrage_id,
            d.forme_id,
            d.verre_id,
            t.model_id         AS id_model_via_type,
            m.label_model      AS model_label,
            m.slug_model,
            t.label_type       AS type_label,
            t.slug_type,
            f.label_finition   AS finition_label,
            f.slug_finition,
            p.label_pose       AS pose_label,
            p.slug_pose,
            a.label_ancrage    AS ancrage_label,
            a.slug_ancrage,
            fo.label_forme     AS forme_label,
            fo.slug_forme,
            v.label_verre      AS verre_label,
            v.slug_verre,
            d.longueur_a,
            d.longueur_b,
            d.longueur_c,
            d.hauteur,
            d.angle,
            d.quantity,
            d.create_date,
            d.update_date,
            u.user_login,
            u.user_email,
            u.user_registered,
            s.id                AS id_status,
            s.label_status

        FROM cfg_devis d
        LEFT JOIN cfg_types     t  ON d.type_id     = t.id
        LEFT JOIN cfg_models    m  ON t.model_id    = m.id
        LEFT JOIN cfg_finitions f  ON d.finition_id = f.id
        LEFT JOIN cfg_poses     p  ON d.pose_id     = p.id
        LEFT JOIN cfg_ancrages  a  ON d.ancrage_id  = a.id
        LEFT JOIN cfg_formes    fo ON d.forme_id    = fo.id
        LEFT JOIN cfg_verres    v  ON d.verre_id    = v.id
        LEFT JOIN cfg_status    s  ON d.id_status   = s.id
        LEFT JOIN users         u  ON d.user_id = u.id
        WHERE d.id = ?";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    public function status(): array {
        $stmt = $this->db->query("SELECT
            id,
            label_status,
            slug_status
        FROM cfg_status
        ORDER BY id ASC");
        return $stmt->fetchAll();
    }

        /** Fiche d’un user par ID (paramétrée) */
    public function listUserDevis(int $id): array {
        $sql = "SELECT
            d.id,
            d.user_id,
            d.type_id,
            d.finition_id,
            d.pose_id,
            d.ancrage_id,
            d.forme_id,
            d.verre_id,
            t.model_id         AS id_model_via_type,
            m.label_model      AS model_label,
            t.label_type       AS type_label,
            f.label_finition   AS finition_label,
            p.label_pose       AS pose_label,
            a.label_ancrage    AS ancrage_label,
            fo.label_forme     AS forme_label,
            v.label_verre      AS verre_label,
            d.longueur_a,
            d.longueur_b,
            d.longueur_c,
            d.hauteur,
            d.angle,
            d.quantity,
            d.create_date,
            d.update_date,
            u.user_login,
            u.user_email,
            u.user_registered,
            s.id                AS id_status,
            s.label_status

        FROM cfg_devis d
        LEFT JOIN cfg_types     t  ON d.type_id     = t.id
        LEFT JOIN cfg_models    m  ON t.model_id    = m.id
        LEFT JOIN cfg_finitions f  ON d.finition_id = f.id
        LEFT JOIN cfg_poses     p  ON d.pose_id     = p.id
        LEFT JOIN cfg_ancrages  a  ON d.ancrage_id  = a.id
        LEFT JOIN cfg_formes    fo ON d.forme_id    = fo.id
        LEFT JOIN cfg_verres    v  ON d.verre_id    = v.id
        LEFT JOIN cfg_status    s  ON d.id_status   = s.id
        LEFT JOIN users         u  ON d.user_id = u.id
        WHERE u.id = ?
        ORDER BY d.create_date DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function find(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM cfg_devis WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function update( int $id,
                            int $id_status,
                            int $update_date ): bool {
        $stmt = $this->db->prepare("UPDATE cfg_devis SET id_status = ?,
                                                         update_date = ?
                                    WHERE id = ?");

        return $stmt->execute([ $id_status,
                                $update_date,
                                $id ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM cfg_devis WHERE id=?");
        return $stmt->execute([$id]);
    }

    /**
     * Insère un nouveau devis dans la table `cfg_devis`.
     * 
     * @param array $p  Tableau associatif contenant toutes les valeurs à insérer (clé => valeur)
     * @return int       Retourne l'ID auto-incrémenté du devis nouvellement créé
     */
    public function insert(array $p): int
    {
        // =========================================================================
        // 1️⃣ Préparation des colonnes et des valeurs
        // =========================================================================
        // On définit un tableau $cols qui représente la structure exacte de la table `cfg_devis`.
        // Chaque clé correspond au nom d'une colonne, et chaque valeur vient du tableau $p (paramètres).
        // L'opérateur `??` permet d'utiliser une valeur par défaut si la clé n'existe pas dans $p.
        // Exemple : $p['finition_id'] ?? null → si non défini, on enregistre NULL dans la BDD.
        $cols = [
            'user_id'     => $p['user_id'],
            'type_id'     => $p['type_id'],
            'finition_id' => $p['finition_id'] ?? null,
            'forme_id'    => $p['forme_id'] ?? null,
            'pose_id'     => $p['pose_id'] ?? null,
            'ancrage_id'  => $p['ancrage_id'] ?? null,
            'verre_id'    => $p['verre_id'] ?? null,
            'longueur_a'  => $p['longueur_a'] ?? null,
            'longueur_b'  => $p['longueur_b'] ?? null,
            'longueur_c'  => $p['longueur_c'] ?? null,
            'hauteur'     => $p['hauteur'] ?? null,
            'angle'       => $p['angle'] ?? null,
            'quantity'    => $p['quantity'] ?? 1,
            'id_status'   => $p['id_status'] ?? 1,
            'create_date' => $p['create_date'],
            'update_date' => $p['update_date'],
        ];

        // =========================================================================
        // 2️⃣ Génération dynamique des colonnes et des placeholders
        // =========================================================================
        // array_keys($cols) récupère la liste des noms de colonnes sous forme de tableau.
        // Exemple : ['user_id', 'type_id', 'finition_id', ...]
        $columns = array_keys($cols);

        // array_map() transforme chaque nom de colonne en placeholder PDO (:colonne)
        // Exemple : ['user_id' => ':user_id', 'type_id' => ':type_id', ...]
        // $placeholders = array_map(fn($c) => ':' . $c, $columns);

        // ou plus simplifié (sans fonction fléchée)
        // On crée un tableau vide pour stocker les placeholders
        $placeholders = [];
        // On parcourt chaque nom de colonne
        foreach ($columns as $c) {
            // On ajoute le signe ":" devant le nom de la colonne
            $placeholders[] = ':' . $c;
        }

        // =========================================================================
        // 3️⃣ Construction de la requête SQL INSERT
        // =========================================================================
        // On assemble dynamiquement les noms de colonnes et leurs placeholders.
        // Exemple de résultat :
        //   INSERT INTO `cfg_devis` (user_id,type_id,finition_id,...) 
        //   VALUES (:user_id,:type_id,:finition_id,...)
        $sql = 'INSERT INTO `cfg_devis` (' . implode(',', $columns) . ')
                VALUES (' . implode(',', $placeholders) . ')';

        // =========================================================================
        // 4️⃣ Préparation de la requête SQL avec PDO
        // =========================================================================
        // $this->db est une instance de PDO (initialisée dans Database.php).
        // La méthode prepare() protège automatiquement contre les injections SQL
        $stmt = $this->db->prepare($sql);

        // =========================================================================
        // 5️⃣ Association des valeurs aux placeholders
        // =========================================================================
        // On parcourt chaque colonne et on associe sa valeur avec le bon type PDO.
        foreach ($cols as $col => $val) {

            // Si la valeur est NULL → on lie avec PDO::PARAM_NULL
            if ($val === null) {
                $stmt->bindValue(':' . $col, null, PDO::PARAM_NULL);

            // Sinon, on force en entier (int) et on lie avec PDO::PARAM_INT
            // car toutes les colonnes ici sont de type numérique (SMALLINT / INT).
            } else {
                $stmt->bindValue(':' . $col, (int)$val, PDO::PARAM_INT);
            }
        }

        // =========================================================================
        // 6️⃣ Exécution de la requête préparée
        // =========================================================================
        // La méthode execute() lance réellement l’insertion dans la base.
        // Si une erreur survient (ex: clé étrangère manquante), une exception PDO sera levée.
        $stmt->execute();

        // =========================================================================
        // 7️⃣ Retour de l'ID du devis inséré
        // =========================================================================
        // lastInsertId() retourne l’ID AUTO_INCREMENT du dernier enregistrement.
        // On le convertit en (int) pour plus de sécurité.
        return (int)$this->db->lastInsertId();
    }



}

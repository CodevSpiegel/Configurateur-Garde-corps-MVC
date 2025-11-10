<?php

/**
 * ============================================================================
 * app\models\Users.php
 * ============================================================================
 * * Modèle ultra-simple utilisant la base Model (qui fournit $this->db via Database::getInstance())
 */

class Users extends Model
{
    /** Compte total des utilisateurs (pour la pagination) */
    public function countAll(): int {
        return (int)$this->db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    }

    /**
     * Liste paginée (10/pg par défaut)
     */
    public function list( int $page = 1, int $perPage = 10 ): array {
        $offset = max(0, ($page - 1) * $perPage);
        $sql = "SELECT
            u.id,
            u.user_login,
            u.user_email,
            u.user_group_id,
            u.user_registered,
            u.user_last_visit,
            u.user_last_activity,
            u.user_email,
            g.id_group,
            g.group_label

        FROM users u
        LEFT JOIN user_groups g ON u.user_group_id  = g.id_group
        ORDER BY u.id ASC
        LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':limit',  $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset,  PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** Fiche d’un user par ID (paramétrée) */
    public function show(int $id): array {
        $sql = "SELECT
            u.id,
            u.user_login,
            u.user_email,
            u.user_group_id,
            u.user_registered,
            u.user_last_visit,
            u.user_last_activity,
            u.user_email,
            COUNT(d.id) AS nb_devis,
            d.create_date,
            g.id_group,
            g.group_label

        FROM users u
        LEFT JOIN cfg_devis d ON u.id  = d.user_id
        LEFT JOIN user_groups g ON u.user_group_id  = g.id_group
        WHERE u.id = ?";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }


    public function userGroups(): array {
        $stmt = $this->db->query("SELECT
            id_group,
            group_label
        FROM user_groups
        ORDER BY id_group ASC");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }


    public function update( int $id,
                            int $id_group ): bool {
        $stmt = $this->db->prepare("UPDATE users SET user_group_id = ?
                                    WHERE id = ?");

        return $stmt->execute([ $id_group,
                                $id ]);
    }

    public function delete(int $id): bool {
        if ($id === 1) die();

        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $this->db->prepare("DELETE FROM cfg_devis WHERE user_id = ?");
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

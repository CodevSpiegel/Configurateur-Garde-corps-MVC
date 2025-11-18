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
}

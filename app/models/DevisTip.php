<?php
/**
 * models/Tip.php
 * CRUD sur la table tips + filtres par catégorie + recherche.
 */
class DevisTip extends Model {

        public function latest(int $limit = 10): array {
        $stmt = $this->db->prepare("SELECT t.*, c.name AS category_name 
                                    FROM tips t JOIN categories c ON c.id=t.category_id 
                                    ORDER BY t.created_at DESC LIMIT ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

}
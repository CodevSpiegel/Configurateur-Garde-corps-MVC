<?php
/**
 * models/Tip.php
 * CRUD sur la table tips + filtres par catégorie + recherche.
 */
class Tip extends Model {

    public function latest(int $limit = 10): array {
        $stmt = $this->db->prepare("SELECT t.*, c.name AS category_name 
                                    FROM tips t JOIN categories c ON c.id=t.category_id 
                                    ORDER BY t.created_at DESC LIMIT ?");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function byCategory(int $categoryId, int $limit=25, int $offset=0): array {
        $stmt = self::paged("SELECT t.*, c.name AS category_name FROM tips t JOIN categories c ON c.id=t.category_id WHERE t.category_id=? ORDER BY t.created_at DESC", [$categoryId], $limit, $offset, $this->db);
        return $stmt['rows'];
    }

    public function countByCategory(int $categoryId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM tips WHERE category_id=?");
        $stmt->execute([$categoryId]);
        return (int)$stmt->fetchColumn();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare("SELECT t.*, c.name AS category_name FROM tips t JOIN categories c ON c.id=t.category_id WHERE t.id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(int $categoryId, string $title, ?string $summary, string $content, ?string $code): int {
        $stmt = $this->db->prepare("INSERT INTO tips (category_id, title, summary, content, code) VALUES (?,?,?,?,?)");
        $stmt->execute([$categoryId, $title, $summary, $content, $code]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, int $categoryId, string $title, ?string $summary, string $content, ?string $code): bool {
        $stmt = $this->db->prepare("UPDATE tips SET category_id=?, title=?, summary=?, content=?, code=? WHERE id=?");
        return $stmt->execute([$categoryId, $title, $summary, $content, $code, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM tips WHERE id=?");
        return $stmt->execute([$id]);
    }

    public function search(string $q, int $limit=20): array {
        // FULLTEXT si dispo; sinon LIKE fallback
        $q = trim($q);
        if ($q === '') return [];
        try {
            $stmt = $this->db->prepare("SELECT t.*, c.name AS category_name FROM tips t JOIN categories c ON c.id=t.category_id WHERE MATCH(title,summary,content) AGAINST(? IN NATURAL LANGUAGE MODE) LIMIT ?");
            $stmt->bindValue(1, $q, PDO::PARAM_STR);
            $stmt->bindValue(2, $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (Throwable $e) {
            $stmt = $this->db->prepare("SELECT t.*, c.name AS category_name FROM tips t JOIN categories c ON c.id=t.category_id WHERE t.title LIKE ? OR t.summary LIKE ? OR t.content LIKE ? LIMIT ?");
            $like = '%' . $q . '%';
            $stmt->bindValue(1, $like); $stmt->bindValue(2, $like); $stmt->bindValue(3, $like);
            $stmt->bindValue(4, $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll();
        }
    }

    // Helper pagination (prépare + exécute + renvoie rows)
    public static function paged(string $sql, array $params, int $limit, int $offset, PDO $db): array {
        $sqlPaged = $sql . " LIMIT ? OFFSET ?";
        $stmt = $db->prepare($sqlPaged);
        $i = 1;
        foreach ($params as $p) $stmt->bindValue($i++, $p);
        $stmt->bindValue($i++, $limit, PDO::PARAM_INT);
        $stmt->bindValue($i++, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return ['rows' => $stmt->fetchAll()];
    }
}
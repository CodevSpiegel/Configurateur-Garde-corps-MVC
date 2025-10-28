<?php
/**
 * models/Category.php
 * Encapsule les opérations CRUD sur la table categories.
 */
class Category extends Model {

    public function all(): array {
        $stmt = $this->db->query("SELECT * FROM categories ORDER BY name");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(string $slug, string $name, ?string $description): int {
        $stmt = $this->db->prepare("INSERT INTO categories (slug,name,description) VALUES (?,?,?)");
        $stmt->execute([$slug, $name, $description]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, string $slug, string $name, ?string $description): bool {
        $stmt = $this->db->prepare("UPDATE categories SET slug=?, name=?, description=? WHERE id=?");
        return $stmt->execute([$slug, $name, $description, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id=?");
        return $stmt->execute([$id]);
    }
}
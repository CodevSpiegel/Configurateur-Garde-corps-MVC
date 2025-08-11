<?php

// $idx = new home_model();

class home_model {

    public function select_article(int $id) {
        global $db;

        // Sélectionner un article
        $db->query("SELECT title, sentence, date FROM articles WHERE id = :id");
        $db->bind(':id', $id);
        $article = $db->fetchOne();

        return $article;

        // if ($article) {
        //     echo "Titre: " . htmlspecialchars($article['title']) . ", Contenu: " . htmlspecialchars($article['content']) . "<br>";
        // } else {
        //     echo "Article non trouvé.<br>";
        // }
    }


    public function select_all_articles() {
        global $db;

        // Sélectionner plusieurs articles
        $db->query("SELECT * FROM articles");
        $articles = $db->fetchAll();

        return $articles;
        
        // if (!empty($articles)) {
        //     foreach ($articles as $a) :
        //         echo "Titre: " . htmlspecialchars($a['title']) . ", Contenu: " . htmlspecialchars($a['content']) . "<br>";
        //     endforeach;
        // } else {
        //      echo "Aucun Article trouvé.<br>";
        // }
    }


    public function insert_article(array $datas) {

    //     // Insérer un nouvel article
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
    }


    public function update_article(int $id, array $datas) {

    //     // Mettre à jour un article
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
    }


    public function delete_article(int $id) {

    //     // Supprimer un article
    //     $userIdToDelete = $lastId; // Supprime l'utilisateur qui vient d'être mis à jour
    //     $db->query("DELETE FROM users WHERE id = :id");
    //     $db->bind(':id', $userIdToDelete);
    //     if ($db->execute()) {
    //         echo "Utilisateur ID " . $userIdToDelete . " supprimé.<br>";
    //     } else {
    //         echo "Erreur lors de la suppression de l'utilisateur.<br>";
    //     }
    }

}
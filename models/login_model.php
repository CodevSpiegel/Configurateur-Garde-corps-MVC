<?php
/**
 * Modèle d'authentification
 * -----------------------------------------------------------------------------
 * - Encapsule la logique d'accès à la table cms_users.
 * - Utilise le driver PDO maison (Db_driver) déjà globalisé dans le projet.
 * - Vérifie le mot de passe hashé via password_verify().
 */

class login_model
{
    /**
     * Authentifie un utilisateur par login/mot de passe.
     * @param string $login    Identifiant saisi (champ u_login en BDD)
     * @param string $password Mot de passe en clair saisi par l'utilisateur
     * @return array|null      Tableau associatif de l'utilisateur si OK, sinon null
     */
    public function authenticate(string $login, string $password): ?array
    {
        global $db; // Instance de Db_driver initialisée par le bootstrap

        // 1) Rechercher l'utilisateur par login (identifiant unique)
        $db->query('SELECT u_id, u_login, u_firstname, u_lastname, u_email, u_password, u_group 
                    FROM cms_users 
                    WHERE u_login = :login
                    LIMIT 1');
        $db->bind(':login', $login);
        $user = $db->fetchOne(); // Retourne array|false

        if (!$user) {
            // Aucun utilisateur avec ce login
            return null;
        }

        // 2) Vérifier le hash du mot de passe avec password_verify()
        //    Les mots de passe de l'exemple SQL sont en bcrypt ($2y$...)
        if (!password_verify($password, (string)$user['u_password'])) {
            return null;
        }

        // 3) (Optionnel) Rehash si l’algorithme/cout a changé (sécurité proactive)
        if (password_needs_rehash((string)$user['u_password'], PASSWORD_DEFAULT)) {
            // Ici on pourrait :
            // - générer un nouveau hash
            // - l'enregistrer en BDD
            // - ignorer silencieusement si pas souhaité
            // Exemple (désactivé par défaut) :
            // $new = password_hash($password, PASSWORD_DEFAULT);
            // $db->query('UPDATE cms_users SET u_password = :pwd WHERE u_id = :id');
            // $db->bind(':pwd', $new);
            // $db->bind(':id',  (int)$user['u_id']);
            // $db->execute();
        }

        return $user;
    }
}

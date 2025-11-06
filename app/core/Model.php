<?php
/**
 * ============================================================================
 * core/Model.php
 * ============================================================================
 * ✨ CLASSE DE BASE POUR TOUS LES MODÈLES (ABSTRACT MODEL)
 * 
 * ➤ Rôle :
 *   Cette classe sert de **modèle parent** à tous les modèles de ton application.
 *   Elle fournit automatiquement une connexion PDO à la base de données
 *   via la classe `Database`.
 * 
 * ➤ Exemple :
 *   class ArticleModel extends Model { ... }
 * 
 *   → En héritant de Model, la classe ArticleModel aura directement accès
 *     à `$this->db` pour exécuter ses requêtes SQL.
 * ============================================================================
 */

require_once ROOT . 'app/core/Database.php'; // ← nécessaire pour Database::getInstance()

 // 🔒 "abstract" signifie que cette classe ne peut pas être instanciée directement.
 // Elle sert uniquement de base pour d’autres classes modèles.
abstract class Model {

    /**
     * --------------------------------------------------------------------------
     * 🧩 Propriété protégée $db
     * --------------------------------------------------------------------------
     * ➤ Contiendra l’objet PDO (connexion à la base de données).
     * 
     * "protected" :
     *   → signifie que les classes enfants (ex: ArticleModel, UserModel, etc.)
     *     pourront y accéder directement.
     * 
     * Type "PDO" :
     *   → on indique explicitement que cette propriété contiendra un objet PDO.
     */
    protected PDO $db;


    /**
     * --------------------------------------------------------------------------
     * ⚙️ Constructeur : connexion automatique à la base de données
     * --------------------------------------------------------------------------
     * ➤ À chaque fois qu’un modèle enfant sera instancié,
     *    le constructeur de cette classe parent sera appelé automatiquement.
     * 
     * ➤ Il initialise la propriété $db grâce à la méthode
     *    `Database::getInstance()` (connexion unique PDO).
     * 
     * Exemple :
     *   $article = new ArticleModel();   // ⤷ $this->db est déjà prêt à l’emploi !
     */
    public function __construct() {

        // On récupère l’unique instance PDO depuis la classe Database
        // Cela évite d’avoir à se reconnecter plusieurs fois à la BDD.
        $this->db = Database::getInstance();
    }
}

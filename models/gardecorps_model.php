<?php
/**
 * =============================================================================
 * models/gardecorps_model.php
 * =============================================================================
 * RÔLE GÉNÉRAL
 * -----------------------------------------------------------------------------
 *  - Centraliser la logique BDD liée aux "devis" du configurateur garde-corps.
 *  - Offrir des méthodes propres, testables et robustes :
 *      * create_devis(array $p)         → insère un devis à partir de slugs + mesures
 *      * getDevisDenormalise(int $id)   → lit un devis avec toutes les jointures utiles
 *      * getAllDevis(...)               → liste paginée/filtrable/triable pour l’admin
 *      * countDevis(...)                → total pour la pagination
 *
 * CONTRAINTES MÉTIER / STRUCTURE
 * -----------------------------------------------------------------------------
 *  - Le "modèle" (ex: verre, barres, câbles, …) n'est PAS stocké dans cfg_devis.
 *    ➜ On ne stocke que type_id. Le model_id se déduit via cfg_types.model_id.
 *  - Les valeurs envoyées par le front sont des SLUGS (ex: 'verre-a-profile').
 *    ➜ On convertit slug → id via les helpers du Db_driver.
 *  - On vérifie la cohérence "type appartient bien au modèle" avant d'insérer.
 *
 * PRÉREQUIS (Db_driver étendu)
 * -----------------------------------------------------------------------------
 *  - Méthodes utiles exposées par ton Db_driver (déjà fournies) :
 *      $db->idFromSlug($slug, $table, $colSlug)               : ?int
 *      $db->idTypeFromSlugWithinModel($typeSlug, $modelId)    : ?int
 *      $db->bindNullableInt(':param', $val)                   : void
 *      $db->bindNullableFloat(':param', $val)                 : void
 *      $db->begin(), $db->commit(), $db->rollBack()           : void
 *      $db->query($sql), $db->bind($k,$v,$t), $db->execute()  : ...
 *      $db->lastInsertId(), $db->fetchOne(), $db->fetchAll()  : ...
 *
 * SÉCURITÉ & QUALITÉ
 * -----------------------------------------------------------------------------
 *  - Toutes les écritures se font en transaction (BEGIN / COMMIT / ROLLBACK).
 *  - Bind systématique des paramètres (SQL Injection-safe).
 *  - Valeurs NULL gérées proprement (FK optionnelles, mesures optionnelles).
 *  - Exceptions relancées → le contrôleur renvoie JSON propre au front.
 *
 * NOTE
 * -----------------------------------------------------------------------------
 *  - Ce fichier ne gère PAS la validation fine des mesures (front/contrôleur).
 *    Il suppose que le contrôleur a déjà effectué les checks (ex: angle 0-180).
 *    Tu peux les dupliquer ici si tu veux une double barrière.
 * =============================================================================
 */

class gardecorps_model
{
    /**
     * create_devis
     * -----------------------------------------------------------------------------
     * Insère un devis à partir de slugs (model/type/… ) + mesures.
     *
     * ⚠️ IMPORTANT :
     * - Pas de model_id dans cfg_devis (on ne l'insère pas).
     * - On vérifie que le type choisi appartient bien au modèle choisi.
     *
     * @param array $p
     *   Clés attendues (toutes en snake_case pour homogénéité) :
     *   [
     *     'model_slug'    => (string)  // ex: 'verre-a-profile'       (OBLIGATOIRE)
     *     'type_slug'     => (string)  // ex: '5-cables'              (OBLIGATOIRE)
     *     'finition_slug' => (string|null),
     *     'forme_slug'    => (string|null),
     *     'pose_slug'     => (string|null),
     *     'ancrage_slug'  => (string|null),
     *     'verre_slug'    => (string|null),
     *     'A'             => (float|null), // longueurs optionnelles
     *     'B'             => (float|null),
     *     'C'             => (float|null),
     *     'HAUTEUR'       => (float|null),
     *     'ANGLE'         => (float|null),
     *     'user_id'       => (int|null)   // null si devis "invité"
     *   ]
     *
     * @return int  ID auto-incrémenté (cfg_devis.id)
     *
     * @throws RuntimeException si résolution slug→id impossible
     * @throws Throwable        si erreur SQL (rollback + exception remontée)
     */
    public function create_devis(array $p): int
    {
        // On récupère le driver DB (singleton fourni par ton bootstrap)
        global $db;

        // ---------------------------------------------------------------------
        // 1) Résolution des SLUGS → IDs (FK) avec contrôles de cohérence
        // ---------------------------------------------------------------------

        // 1.1) Modèle (OBLIGATOIRE)
        //     - Ex: 'verre-a-profile' → cfg_models.id
        $modelId = $db->idFromSlug($p['model_slug'] ?? null, 'cfg_models', 'slug_model');
        if (!$modelId) {
            // Message explicite (remonté au contrôleur puis au front en JSON)
            throw new RuntimeException("Modèle introuvable (slug: " . ($p['model_slug'] ?? 'NULL') . ")");
        }

        // 1.2) Type (OBLIGATOIRE) + COHÉRENCE → appartient au modèle ?
        //     - Vérifie (slug_type, model_id) dans cfg_types
        //     - Retourne l'id du type s'il est bien rattaché au modelId
        $typeId = $db->idTypeFromSlugWithinModel($p['type_slug'] ?? null, (int)$modelId);
        if (!$typeId) {
            throw new RuntimeException("Type introuvable ou non rattaché au modèle (slug: " . ($p['type_slug'] ?? 'NULL') . ")");
        }

        // 1.3) Références OPTIONNELLES
        //     - Si le slug n'est pas fourni ou inconnu → NULL (FK nullable)
        //     - Rappels : ces tables sont des dictionnaires TINYINT UNSIGNED
        $finitionId = $db->idFromSlug($p['finition_slug'] ?? null, 'cfg_finitions', 'slug_finition');
        $formeId    = $db->idFromSlug($p['forme_slug']    ?? null, 'cfg_formes',    'slug_forme');
        $poseId     = $db->idFromSlug($p['pose_slug']     ?? null, 'cfg_poses',     'slug_pose');
        $ancrageId  = $db->idFromSlug($p['ancrage_slug']  ?? null, 'cfg_ancrages',  'slug_ancrage');
        $verreId    = $db->idFromSlug($p['verre_slug']    ?? null, 'cfg_verres',    'slug_verre');

        // 1.4) Métadonnées simples
        $statusId = 1;       // convention : 1 = "En attente" (cfg_status)
        $now      = time();  // timestamps en epoch (int), cohérent avec ton schéma

        // ---------------------------------------------------------------------
        // 2) Transaction + INSERT dans cfg_devis (⚠️ pas de model_id ici)
        // ---------------------------------------------------------------------
        $db->begin(); // démarre la transaction (InnoDB requis)

        try {
            // 2.1) Prépare l'INSERT
            // Remarque : order des colonnes = order des bind ci-dessous
            $sql = "INSERT INTO cfg_devis
                    (user_id, type_id, finition_id, forme_id, pose_id, ancrage_id, verre_id,
                     longueur_a, longueur_b, longueur_c, hauteur, angle,
                     id_status, create_date, update_date)
                    VALUES
                    (:user_id, :type_id, :finition_id, :forme_id, :pose_id, :ancrage_id, :verre_id,
                     :A, :B, :C, :H, :ANGLE,
                     :status_id, :created, :updated)";

            $db->query($sql);

            // 2.2) Bind des références (FK)
            //      - bindNullableInt gère PDO::PARAM_NULL si NULL
            $db->bindNullableInt(':user_id', $p['user_id'] ?? null);   // INT UNSIGNED NULL si invité
            $db->bind(':type_id', $typeId, PDO::PARAM_INT);            // OBLIGATOIRE
            $db->bindNullableInt(':finition_id', $finitionId);         // optionnel
            $db->bindNullableInt(':forme_id',    $formeId);            // optionnel
            $db->bindNullableInt(':pose_id',     $poseId);             // optionnel
            $db->bindNullableInt(':ancrage_id',  $ancrageId);          // optionnel
            $db->bindNullableInt(':verre_id',    $verreId);            // optionnel

            // 2.3) Bind des mesures (FLOAT / DECIMAL / NULLables)
            //      - bindNullableFloat passe NULL proprement si vide
            $db->bindNullableFloat(':A',     $p['A']       ?? null);
            $db->bindNullableFloat(':B',     $p['B']       ?? null);
            $db->bindNullableFloat(':C',     $p['C']       ?? null);
            $db->bindNullableFloat(':H',     $p['HAUTEUR'] ?? null);
            $db->bindNullableFloat(':ANGLE', $p['ANGLE']   ?? null);

            // 2.4) Bind statut + dates (INT non NULL)
            $db->bind(':status_id', $statusId, PDO::PARAM_INT);
            $db->bind(':created',   $now,      PDO::PARAM_INT);
            $db->bind(':updated',   $now,      PDO::PARAM_INT);

            // 2.5) Exécute l'INSERT
            $db->execute();

            // 2.6) Récupère l'ID inséré puis commit
            $insertId = (int)$db->lastInsertId();
            $db->commit();

            // 2.7) Retourne l'ID au contrôleur (qui renverra JSON {ok:true,id})
            return $insertId;

        } catch (Throwable $e) {
            // En cas d’exception (SQL, FK, etc.) : rollback si transaction active
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            // On propage (le contrôleur/endpoint /gardecorps/save gère la réponse JSON)
            throw $e;
        }
    }

    // -----------------------------------------------------------------------------
    // LECTURE : UN devis (jointures complètes / “dénormalisé”)
    // -----------------------------------------------------------------------------

    /**
     * getDevisDenormalise
     * -----------------------------------------------------------------------------
     * Retourne un devis “riche” avec les infos jointes (model/type/...).
     * - Utile pour l’admin ou une page “merci” détaillée.
     * - Jointures :
     *     cfg_devis → cfg_types → cfg_models
     *               ↘ dictionnaires optionnels (LEFT JOIN)
     *               → cfg_status
     *               → users (LEFT)
     *
     * @param  int $id  Identifiant du devis (cfg_devis.id)
     * @return array|null  Ligne jointe (assoc) ou null si introuvable
     */
    public function getDevisDenormalise(int $id): ?array
    {
        global $db;

        // SELECT avec jointures lisibles (slug_* utiles pour front/admin)
        $sql = "
        SELECT 
            d.id,
            d.user_id,
            u.email AS user_email,                      -- utile si devis lié à un compte
            d.type_id,
            t.slug_type,
            m.id   AS model_id,
            m.slug_model,                               -- le modèle “dérivé” via le type
            f.slug_finition,
            fo.slug_forme,
            p.slug_pose,
            a.slug_ancrage,
            v.slug_verre,
            s.label_status,                             -- statut lisible
            d.longueur_a, d.longueur_b, d.longueur_c,   -- mesures
            d.hauteur, d.angle,
            d.create_date, d.update_date
        FROM cfg_devis d
        JOIN cfg_types t        ON t.id = d.type_id     -- type obligatoire
        JOIN cfg_models m       ON m.id = t.model_id    -- modèle déduit via type
        LEFT JOIN cfg_finitions f ON f.id = d.finition_id
        LEFT JOIN cfg_formes fo    ON fo.id = d.forme_id
        LEFT JOIN cfg_poses p      ON p.id  = d.pose_id
        LEFT JOIN cfg_ancrages a   ON a.id  = d.ancrage_id
        LEFT JOIN cfg_verres v     ON v.id  = d.verre_id
        JOIN cfg_status s          ON s.id  = d.id_status
        LEFT JOIN users u          ON u.u_id = d.user_id
        WHERE d.id = :id
        LIMIT 1";

        // Prépare, bind, exécute, fetch
        $db->query($sql);
        $db->bind(':id', $id, PDO::PARAM_INT);
        $row = $db->fetchOne();

        // Retour ligne ou null
        return $row ?: null;
    }

    // -----------------------------------------------------------------------------
    // LECTURE : LISTE de devis (pagination + filtres + tri)
    // -----------------------------------------------------------------------------

    /**
     * getAllDevis
     * -----------------------------------------------------------------------------
     * Liste paginée de devis avec filtres optionnels et tri whitelisté.
     *
     * @param array  $filters  Filtres disponibles (tous optionnels) :
     *   [
     *     'status_id'  => (int)    // id statut,
     *     'user_id'    => (int)    // id utilisateur,
     *     'model_slug' => (string) // filtre par modèle,
     *     'type_slug'  => (string) // filtre par type,
     *     'q'          => (string) // recherche LIKE (model/type/status),
     *     'date_from'  => (int)    // epoch min sur create_date,
     *     'date_to'    => (int)    // epoch max sur create_date,
     *   ]
     * @param int    $limit     Nb max de résultats (par défaut 50)
     * @param int    $offset    Décalage (pour pagination)
     * @param string $orderBy   Colonne de tri (whitelist ci-dessous)
     * @param string $orderDir  'ASC' | 'DESC' (défaut DESC)
     *
     * @return array[]  Tableau de lignes associatives (une par devis)
     */
    public function getAllDevis(
        array $filters = [],
        int $limit = 50,
        int $offset = 0,
        string $orderBy = 'd.create_date',
        string $orderDir = 'DESC'
    ): array {
        global $db;

        // Sécurise ORDER BY : seules ces colonnes seront acceptées
        $orderable = [
            'd.id', 'd.create_date', 'd.update_date', 'd.id_status',
            't.slug_type', 'm.slug_model', 'u.u_id'
        ];
        if (!in_array($orderBy, $orderable, true)) {
            $orderBy = 'd.create_date'; // fallback sûr
        }
        $orderDir = strtoupper($orderDir) === 'ASC' ? 'ASC' : 'DESC';

        // SELECT (mêmes jointures que getDevisDenormalise, sans WHERE)
        $sql = "
        SELECT 
            d.id,
            d.user_id,
            u.email AS user_email,
            d.type_id,
            t.slug_type,
            m.id   AS model_id,
            m.slug_model,
            f.slug_finition,
            fo.slug_forme,
            p.slug_pose,
            a.slug_ancrage,
            v.slug_verre,
            s.label_status,
            d.longueur_a, d.longueur_b, d.longueur_c,
            d.hauteur, d.angle,
            d.create_date, d.update_date
        FROM cfg_devis d
        JOIN cfg_types t        ON t.id = d.type_id
        JOIN cfg_models m       ON m.id = t.model_id
        LEFT JOIN cfg_finitions f ON f.id = d.finition_id
        LEFT JOIN cfg_formes fo    ON fo.id = d.forme_id
        LEFT JOIN cfg_poses p      ON p.id  = d.pose_id
        LEFT JOIN cfg_ancrages a   ON a.id  = d.ancrage_id
        LEFT JOIN cfg_verres v     ON v.id  = d.verre_id
        JOIN cfg_status s          ON s.id  = d.id_status
        LEFT JOIN users u          ON u.u_id = d.user_id
        ";

        // WHERE dynamiques selon $filters
        $where = [];
        $binds = [];

        if (!empty($filters['status_id'])) {
            $where[] = 'd.id_status = :status_id';
            $binds[':status_id'] = (int)$filters['status_id'];
        }
        if (!empty($filters['user_id'])) {
            $where[] = 'd.user_id = :user_id';
            $binds[':user_id'] = (int)$filters['user_id'];
        }
        if (!empty($filters['model_slug'])) {
            $where[] = 'm.slug_model = :model_slug';
            $binds[':model_slug'] = (string)$filters['model_slug'];
        }
        if (!empty($filters['type_slug'])) {
            $where[] = 't.slug_type = :type_slug';
            $binds[':type_slug'] = (string)$filters['type_slug'];
        }
        if (!empty($filters['date_from'])) {
            $where[] = 'd.create_date >= :date_from';
            $binds[':date_from'] = (int)$filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[] = 'd.create_date <= :date_to';
            $binds[':date_to'] = (int)$filters['date_to'];
        }
        if (!empty($filters['q'])) {
            // Recherche “simple” (on évite les grosses colonnes texte)
            $where[] = '(m.slug_model LIKE :q OR t.slug_type LIKE :q OR s.label_status LIKE :q)';
            $binds[':q'] = '%' . (string)$filters['q'] . '%';
        }

        // Concaténation finale du WHERE si nécessaire
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Tri + Pagination
        $sql .= " ORDER BY {$orderBy} {$orderDir} LIMIT :limit OFFSET :offset";

        // Prépare + bind
        $db->query($sql);
        foreach ($binds as $k => $v) {
            // Bind typé selon nature (int vs string)
            is_int($v) ? $db->bind($k, $v, PDO::PARAM_INT)
                       : $db->bind($k, $v, PDO::PARAM_STR);
        }
        $db->bind(':limit',  $limit,  PDO::PARAM_INT);
        $db->bind(':offset', $offset, PDO::PARAM_INT);

        // Exécute + retourne toutes les lignes
        return $db->fetchAll();
    }

    // -----------------------------------------------------------------------------
    // LECTURE : Compteur total (mêmes filtres que getAllDevis) pour pagination
    // -----------------------------------------------------------------------------

    /**
     * countDevis
     * -----------------------------------------------------------------------------
     * Retourne le NOMBRE TOTAL de devis correspondant aux filtres.
     * - Utile pour paginer l’interface admin (nb_pages = ceil(total/limit)).
     *
     * @param array $filters  (mêmes clés que getAllDevis)
     * @return int            Total de lignes correspondantes
     */
    public function countDevis(array $filters = []): int
    {
        global $db;

        // Même base de jointures que getAllDevis, mais on compte seulement
        $sql = "
        SELECT COUNT(*) AS total
        FROM cfg_devis d
        JOIN cfg_types t   ON t.id = d.type_id
        JOIN cfg_models m  ON m.id = t.model_id
        JOIN cfg_status s  ON s.id = d.id_status
        LEFT JOIN users u  ON u.u_id = d.user_id
        ";

        // WHERE identique (ou quasi) à getAllDevis pour cohérence
        $where = [];
        $binds = [];

        if (!empty($filters['status_id'])) {
            $where[] = 'd.id_status = :status_id';
            $binds[':status_id'] = (int)$filters['status_id'];
        }
        if (!empty($filters['user_id'])) {
            $where[] = 'd.user_id = :user_id';
            $binds[':user_id'] = (int)$filters['user_id'];
        }
        if (!empty($filters['model_slug'])) {
            $where[] = 'm.slug_model = :model_slug';
            $binds[':model_slug'] = (string)$filters['model_slug'];
        }
        if (!empty($filters['type_slug'])) {
            $where[] = 't.slug_type = :type_slug';
            $binds[':type_slug'] = (string)$filters['type_slug'];
        }
        if (!empty($filters['date_from'])) {
            $where[] = 'd.create_date >= :date_from';
            $binds[':date_from'] = (int)$filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[] = 'd.create_date <= :date_to';
            $binds[':date_to'] = (int)$filters['date_to'];
        }
        if (!empty($filters['q'])) {
            $where[] = '(m.slug_model LIKE :q OR t.slug_type LIKE :q OR s.label_status LIKE :q)';
            $binds[':q'] = '%' . (string)$filters['q'] . '%';
        }

        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Prépare + bind + fetchOne
        $db->query($sql);
        foreach ($binds as $k => $v) {
            is_int($v) ? $db->bind($k, $v, PDO::PARAM_INT)
                       : $db->bind($k, $v, PDO::PARAM_STR);
        }
        $row = $db->fetchOne();

        // Retourne le total (0 si NULL)
        return (int)($row['total'] ?? 0);
    }
}

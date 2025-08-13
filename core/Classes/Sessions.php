<?php
// ============================================================================
// GESTION MODERNE DES SESSIONS (utilise TA classe Db_driver)
// ============================================================================
// - AUCUNE constante de table/colonnes : tout est écrit "en dur" dans les requêtes.
// - Utilise ta classe Db_driver (query/bind/execute/fetchOne/fetchAll...).
// - Pas de "global $DB" : on injecte un objet Db_driver proprement.
// - Compatible WAMP (HTTP), avec quelques sécurités (HttpOnly, htmlspecialchars, hash_equals).
// - Conçue pour PHP 8+ avec declare(strict_types=1).
// ============================================================================

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Groupes (garde tes valeurs)
// ---------------------------------------------------------------------------
// const GROUP_ADMIN  = 27;
// const GROUP_BOT    = 1;
// const GROUP_GEST   = 2;   // invité/guest
// const GROUP_TEMP   = 3;
// const GROUP_MEMBER = 4;

final class Session
{
    // ---------------------------------------------------------------------
    // Dépendance à TA classe Db_driver
    // ---------------------------------------------------------------------
    private Db_driver $db;

    // ---------------------------------------------------------------------
    // État courant
    // ---------------------------------------------------------------------
    public string $session_id      = '';  // Token applicatif (64 hex) stocké dans $_SESSION['id']
    public int    $session_user_id = 0;   // ID user lié à la session (0 = invité)
    public int    $time_now        = 0;   // Timestamp "now" gelé pour la requête
    public int    $last_click      = 0;   // Dernier "tick" (s_running_time)
    public string $ip_address      = '';  // IP client (best effort)
    public string $user_agent      = '';  // User-Agent "sanitisé"
    public string $location        = '';  // Si tu veux tracer la page
    public array  $user            = [];  // Profil utilisateur courant (depuis cms_users)
    private bool $sessionRowExists = false; // true si la ligne s_id existe en BDD

    /**
     * @param Db_driver $db  Ton driver maison (wrap PDO).
     */
    public function __construct(Db_driver $db)
    {
        $this->db        = $db;
        $this->time_now  = time();
        $this->ip_address = $this->resolveClientIp();
        $this->user_agent = $this->resolveUserAgent();

        // var_dump($this->ip_address);
        // var_dump($this->user_agent);

        // Démarrer la session PHP si besoin
        if (session_status() !== PHP_SESSION_ACTIVE) {
            // En dev HTTP (WAMP), pas de "secure", mais HttpOnly protège déjà des accès JS
            ini_set('session.cookie_httponly', '1');
            session_start();
            var_dump("Création ou récuperation d'une session !");
        }

        // ID applicatif stable (différent du PHPSESSID) pour indexer cms_sessions.s_id
        $_SESSION['id']   = $_SESSION['id']   ?? bin2hex(random_bytes(32));
        $this->session_id = (string) $_SESSION['id'];

        // var_dump($this->session_id);

        // État par défaut côté "profil" : invité
        $this->user = [
            'u_id'            => 0,
            'u_login'         => '',
            'u_password'      => '',
            'u_group'        => GROUP_GEST,
            'u_email'         => '',
            'u_lang'          => '',
            'u_ipadress'      => $this->ip_address,
            'u_last_visit'    => 0,
            'u_last_activity' => 0,
        ];

    }

    // ---------------------------------------------------------------------
    // Entrée principale : attacher/valider la session et renvoyer le profil
    // ---------------------------------------------------------------------

    /**
     * Authorise la session courante et retourne le profil (invité ou membre).
     */
    public function authorise(): array
    {
        // var_dump("Function : Authorise()");
        // 1) Lire la session en BDD si elle existe
        $this->getSessionById($this->session_id);

        // 2) Brancher la logique selon l'ID utilisateur attaché
        if (is_int($this->session_user_id) && $this->session_user_id > 0) {
            // Session liée à un membre -> charger l'utilisateur
            $this->loadUser($this->session_user_id);

            if (empty($this->user['u_id'])) {
                // L'utilisateur n'existe plus -> repasser invité
                $this->unloadUser();
                $this->updateGuestSession();
            } else {
                // OK -> keep-alive user
                $this->updateUserSession();
            }

        } elseif (is_int($this->session_user_id) && $this->session_user_id < 1) {
            // Si la ligne n'existe pas encore -> INSERT ; sinon -> UPDATE
            if (!$this->sessionRowExists) {
                $this->createGuestSession();   // ✅ INSERT
            } else {
                $this->updateGuestSession();   // ✅ UPDATE
            }
        } else {
            // 3) Pas de session BDD / invalide -> tenter auto-login via variables de session PHP
            if (!empty($_SESSION['user_id']) && !empty($_SESSION['pass_hash'])) {
                $this->loadUser((int) $_SESSION['user_id']);

                if (empty($this->user['u_id'])) {
                    $this->unloadUser();
                    $this->createGuestSession();
                } else {
                    // Comparer le hash stocké (password déjà hashé en BDD) avec ce qu'on a en session
                    if (hash_equals((string) $this->user['u_password'], (string) $_SESSION['pass_hash'])) {
                        $this->createUserSession();
                    } else {
                        $this->unloadUser();
                        $this->createGuestSession();
                    }
                }
            } else {
                $this->createGuestSession();
            }
        }

        // 4) Retourner le profil final
        var_dump($this->user);
        return $this->user;
    }

    // =========================================================================
    // LECTURE / ÉCRITURE DES SESSIONS
    // =========================================================================

    /**
     * Charge la ligne cms_sessions correspondant à $sessionId (si existe).
     */
    private function getSessionById(string $sessionId): void
    {
        // var_dump("Function : getSessionById()");
        if ($sessionId === '') {
            $this->session_user_id = 0;
            $this->sessionRowExists = false;
            return;
        }

        $this->db->query(
            'SELECT s_id, s_user_id, s_running_time
             FROM cms_sessions
             WHERE s_id = :sid'
        );
        $this->db->bind(':sid', $sessionId);
        $row = $this->db->fetchOne();

        if ($row) {
            $this->session_id      = (string) $row['s_id'];
            $this->session_user_id = (int)    $row['s_user_id'];
            $this->last_click      = (int)    $row['s_running_time'];
            $this->sessionRowExists = true;    // ✅ elle existe
        } else {
            // Aucune ligne -> on conserve le token applicatif mais sans user lié
            $this->session_id      = $sessionId;
            $this->session_user_id = 0;
            $this->sessionRowExists = false;   // ❌ aucune ligne en BDD
            // var_dump("Aucune ligne -> on conserve le token applicatif mais sans user lié");
        }
    }

    /**
     * Supprime les sessions périmées (inactivité > SESSION_TTL_SECONDS).
     */
    private function deleteDefunctSessions(): void
    {
        // var_dump("Function : deleteDefunctSessions()");
        $threshold = $this->time_now - SESSION_TTL_SECONDS;

        $this->db->query(
            'DELETE FROM cms_sessions
             WHERE s_running_time < :threshold'
        );
        $this->db->bind(':threshold', $threshold);
        $this->db->execute();
    }

    // =========================================================================
    // UTILISATEUR
    // =========================================================================

    /**
     * Charge un utilisateur par ID. Si non trouvé -> passe en invité.
     */
    private function loadUser(int $userId): void
    {
        // var_dump("Function : loadUser()");
        if ($userId <= 0) {
            $this->unloadUser();
            return;
        }

        $this->db->query(
            'SELECT u_id, u_login, u_email, u_password, u_group, u_lang, u_ipadress, u_last_visit, u_last_activity
            FROM cms_users
            WHERE u_id = :uid'
        );
        $this->db->bind(':uid', $userId);
        $row = $this->db->fetchOne();

        if ($row) {
            // Conserver tel quel pour compatibilité maximale avec le reste de ton app
            $this->user = $row;
        } else {
            $this->unloadUser();
        }
    }

    /**
     * Réinitialise l’état "utilisateur" en invité + purge l’auto-login.
     */
    private function unloadUser(): void
    {
        // var_dump("Function : unloadUser()");
        $this->user = [
            'u_id'            => 0,
            'u_login'         => '',
            'u_password'      => '',
            'u_group'        => GROUP_GEST,
            'u_email'         => '',
            'u_lang'          => '',
            'u_ipadress'      => $this->ip_address,
            'u_last_visit'    => 0,
            'u_last_activity' => 0,
        ];

        // On garde $_SESSION['id'] (token applicatif), on purge seulement l'auto-login
        unset($_SESSION['user_id'], $_SESSION['pass_hash']);
    }

    // =========================================================================
    // SESSIONS INVITÉ
    // =========================================================================

    /**
     * Crée une nouvelle session "invité".
     */
    private function createGuestSession(): void
    {
        // var_dump("Function : createGuestSession()");
        // Toujours commencer par nettoyer les sessions périmées
        $this->deleteDefunctSessions();

        // S'assurer d'avoir un token applicatif
        if ($this->session_id === '') {
            $this->session_id = bin2hex(random_bytes(32));
            $_SESSION['id']   = $this->session_id;
        }

        $this->db->query(
            'INSERT INTO cms_sessions
            (s_id, s_user_id, s_user_login, s_user_group, s_running_time, s_ip_adress, s_browser)
            VALUES (:sid, :uid, :ulogin, :ugroup, :rt, :ip, :ua)
            ON DUPLICATE KEY UPDATE
                s_user_id      = VALUES(s_user_id),
                s_user_login   = VALUES(s_user_login),
                s_user_group   = VALUES(s_user_group),
                s_running_time = VALUES(s_running_time),
                s_ip_adress    = VALUES(s_ip_adress),
                s_browser      = VALUES(s_browser)'
        );
        $this->db->bind(':sid',    $this->session_id);
        $this->db->bind(':uid',    0);
        $this->db->bind(':ulogin', 'Guest');
        $this->db->bind(':ugroup', GROUP_GEST);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->bind(':ip',     $this->ip_address);
        $this->db->bind(':ua',     $this->user_agent);
        $this->db->execute();

        $this->session_user_id = 0;
        $this->last_click      = $this->time_now;
        $this->sessionRowExists = true; // ✅ la ligne existe désormais
    }

    /**
     * Met à jour la session "invité".
     * Si incohérence avec $_SESSION['id'], on recrée.
     */
    private function updateGuestSession(): void
    {
        // var_dump("Function : updateGuestSession()");
        if ($this->session_id === '' || $this->session_id !== (string)($_SESSION['id'] ?? '')) {
            $this->createGuestSession();
            return;
        }

        $this->db->query(
            'UPDATE cms_sessions
            SET s_user_id = :uid,
                s_user_login = :ulogin,
                s_user_group = :ugroup,
                s_running_time = :rt
            WHERE s_id = :sid'
        );

        $this->db->bind(':sid',    $this->session_id);
        $this->db->bind(':uid',    0);
        $this->db->bind(':ulogin', 'Guest');
        $this->db->bind(':ugroup', GROUP_GEST);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->execute();

        // ✅ Si aucune ligne n’a été affectée, c’est qu’elle n’existe pas -> INSERT
        if ($this->db->rowCount() === 0) {
            $this->createGuestSession();
            return;
        }

        $this->session_user_id  = 0;
        $this->last_click       = $this->time_now;
        $this->sessionRowExists = true;
    }

    // =========================================================================
    // SESSIONS UTILISATEUR
    // =========================================================================

    /**
     * Crée une session pour un utilisateur authentifié :
     * - supprime les sessions périmées et celles de cet utilisateur
     * - crée un nouveau token et insère la ligne
     * - met à jour last_visit / last_activity (toutes les 5 minutes)
     */
    private function createUserSession(): void
    {
        // var_dump("Function : createUserSession()");
        if (empty($this->user['u_id'])) {
            $this->createGuestSession();
            return;
        }

        // 1) Nettoyage
        $threshold = $this->time_now - SESSION_TTL_SECONDS;

        $this->db->query(
            'DELETE FROM cms_sessions
             WHERE s_running_time < :threshold
                OR s_user_id = :uid'
        );
        $this->db->bind(':threshold', $threshold);
        $this->db->bind(':uid', (int)$this->user['u_id']);
        $this->db->execute();

        // 2) Nouveau token applicatif
        $this->session_id = bin2hex(random_bytes(32));
        $_SESSION['id']   = $this->session_id;

        // 3) Ajouter la session
        $this->db->query(
            'INSERT INTO cms_sessions
            (s_id, s_user_id, s_user_login, s_user_group, s_running_time, s_ip_adress, s_browser)
            VALUES (:sid, :uid, :ulogin, :ugroup, :rt, :ip, :ua)
            ON DUPLICATE KEY UPDATE
                s_user_id      = VALUES(s_user_id),
                s_user_login   = VALUES(s_user_login),
                s_user_group   = VALUES(s_user_group),
                s_running_time = VALUES(s_running_time),
                s_ip_adress    = VALUES(s_ip_adress),
                s_browser      = VALUES(s_browser)'
        );
        $this->db->bind(':sid',    $this->session_id);
        $this->db->bind(':uid',    (int)$this->user['u_id']);
        $this->db->bind(':ulogin', (string)$this->user['u_login']);
        $this->db->bind(':ugroup', (int)$this->user['u_group']);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->bind(':ip',     $this->ip_address);
        $this->db->bind(':ua',     $this->user_agent);
        $this->db->execute();

        $this->session_user_id = (int)$this->user['u_id'];
        $this->last_click      = $this->time_now;
        $this->sessionRowExists = true; // ✅

        // 4) Mettre à jour last_visit / last_activity toutes les 5 min
        $lastActivity = (int)($this->user['u_last_activity'] ?? 0);
        if ($this->time_now - $lastActivity > 300) {
            $this->db->query(
                'UPDATE cms_users
                 SET u_last_visit = u_last_activity,
                     u_last_activity = :now
                 WHERE id = :uid'
            );
            $this->db->bind(':now', $this->time_now);
            $this->db->bind(':uid', (int)$this->user['u_id']);
            $this->db->execute();

            // Cohérence côté mémoire
            $this->user['u_last_visit']    = $lastActivity;
            $this->user['u_last_activity'] = $this->time_now;
        }
    }

    /**
     * Keep-alive d'une session utilisateur.
     */
    private function updateUserSession(): void
    {
        // var_dump("Function : updateUserSession()");
        if ($this->session_id === '') {
            $this->createUserSession();
            return;
        }

        if (empty($this->user['u_id'])) {
            $this->unloadUser();
            $this->createGuestSession();
            return;
        }

        $this->db->query(
            'UPDATE cms_sessions
            SET s_user_id = :uid,
                s_user_login = :ulogin,
                s_user_group = :ugroup,
                s_running_time = :rt
            WHERE s_id = :sid'
        );
        $this->db->bind(':sid',    $this->session_id);
        $this->db->bind(':uid',    (int)$this->user['u_id']);
        $this->db->bind(':ulogin', (string)$this->user['u_login']);
        $this->db->bind(':ugroup', (int)$this->user['u_group']);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->execute();

        // ✅ Si 0 ligne affectée -> la ligne n’existe pas -> INSERT
        if ($this->db->rowCount() === 0) {
            $this->createUserSession();
            return;
        }

        $this->session_user_id  = (int)$this->user['u_id'];
        $this->last_click       = $this->time_now;
        $this->sessionRowExists = true;
    }

    // =========================================================================
    // SESSIONS BOT (optionnel pour tracer les crawlers)
    // =========================================================================

    private function createBotSession(string $botName): void
    {
        // var_dump("Function : createBotSession()");
        $sid = $botName . '_session';

        $this->db->query(
            'INSERT INTO cms_sessions (s_id, s_user_id, s_user_login, s_user_group, s_running_time, s_ip_adress, s_browser)
             VALUES (:sid, :uid, :ulogin, :ugroup, :rt, :ip, :ua)'
        );
        $this->db->bind(':sid',    $sid);
        $this->db->bind(':uid',    0);
        $this->db->bind(':ulogin', $botName);
        $this->db->bind(':ugroup', GROUP_BOT);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->bind(':ip',     $this->ip_address);
        $this->db->bind(':ua',     $this->user_agent);
        $this->db->execute();
    }

    private function updateBotSession(string $botName): void
    {
        // var_dump("Function : updateBotSession()");
        $sid = $botName . '_session';

        $this->db->query(
            'UPDATE cms_sessions
             SET s_user_id = :uid,
                 s_user_login = :ulogin,
                 s_user_group = :ugroup,
                 s_running_time = :rt
             WHERE s_id = :sid'
        );
        $this->db->bind(':sid',    $sid);
        $this->db->bind(':uid',    0);
        $this->db->bind(':ulogin', $botName);
        $this->db->bind(':ugroup', GROUP_BOT);
        $this->db->bind(':rt',     $this->time_now);
        $this->db->execute();
    }


    /**
     * Enregistre une page vue dans cms_page_views avec l'ID et le groupe de l'utilisateur.
     * @param string $path   Chemin/route demandé (ex: $_SERVER['REQUEST_URI'])
     * @param string $method Méthode HTTP (GET/POST/...)
     * @param string $referer Referer si dispo
     */
    public function trackPageView(string $path, string $method = 'GET', string $referer = ''): void
    {
        // Sécurité et limite de longueur pour éviter les débordements
        $safePath    = mb_substr($path, 0, 255);
        $safeMethod  = mb_substr($method, 0, 10);
        $safeReferer = mb_substr($referer ?? '', 0, 255);

        // Limiter la taille de l'UA
        $ua = $this->user_agent;
        if (mb_strlen($ua) > 255) {
            $ua = mb_substr($ua, 0, 252) . '...';
        }

        // Insertion dans la base
        $this->db->query(
            'INSERT INTO cms_page_views
            (pv_time, pv_s_id, pv_user_id, pv_user_group, pv_path, pv_method, pv_referer, pv_ip, pv_user_agent)
            VALUES (:t, :sid, :uid, :ugroup, :path, :method, :referer, :ip, :ua)'
        );
        $this->db->bind(':t',       $this->time_now);
        $this->db->bind(':sid',     $this->session_id);
        $this->db->bind(':uid',     (int)($this->user['u_id'] ?? 0));
        $this->db->bind(':ugroup',  (int)($this->user['u_group'] ?? GROUP_GEST));
        $this->db->bind(':path',    $safePath);
        $this->db->bind(':method',  $safeMethod);
        $this->db->bind(':referer', $safeReferer);
        $this->db->bind(':ip',      $this->ip_address);
        $this->db->bind(':ua',      $ua);
        $this->db->execute();

        // Sauvegarde du chemin dans l'objet (optionnel)
        $this->location = $safePath;
    }


    // =========================================================================
    // UTILITAIRES
    // =========================================================================

    /**
     * Détermine la "meilleure" IP (REMOTE_ADDR prioritaire, X-Forwarded-For en secours).
     * ⚠️ En prod, ne fais confiance à XFF que derrière des proxies connus (whitelist).
     */
    private function resolveClientIp(): string
    {
        // var_dump("Function : resolveClientIp()");
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($xff) {
            // Si plusieurs IP (proxy chain), on prend la première valide
            $cands = array_map('trim', explode(',', $xff));
            foreach ($cands as $cand) {
                if (filter_var($cand, FILTER_VALIDATE_IP)) {
                    $ip = $cand;
                    break;
                }
            }
        }

        return is_string($ip) ? $ip : '';
    }

    /**
     * Normalise le User-Agent (évite XSS à l’affichage / stockage).
     */
    private function resolveUserAgent(): string
    {
        // var_dump("Function : resolveUserAgent()");
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        return htmlspecialchars((string)$ua, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

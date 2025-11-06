<?php
/**
 * core/Sessions.php
 * -----------------------------------------------------------------------------
 * Gestion centralisée des sessions "utilisateur" ET "admin" (cookies + BDD).
 * - Stocke un enregistrement dans la table user_sessions à chaque connexion.
 * - Pose un cookie signé côté client pour retrouver la session.
 * - Fournit des helpers : isLogged(), user(), isAdmin(), login(), logout().
 * - 100% procédural/simple : aucune namespace, dépend de Database.php existant.
 * 
 * IMPORTANT : cette classe N'INITIALISE PAS session_start() partout.
 * On évite de polluer. Utilisée par AuthController principalement.
 * -----------------------------------------------------------------------------
 */

require_once ROOT . 'app/core/Database.php';

class Sessions
{
    /** Nom du cookie de session (court et spécifique) */
    private string $cookieName = 'MSESSID';

    /** Durée de validité d'une session (en secondes) — 7 jours */
    private int $ttl = 604800;

    /** Instance PDO */
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /** Génère un identifiant de session solide (64 hex chars) */
    private function generateId(): string {
        return bin2hex(random_bytes(32));
    }

    /** Retourne l'IP du client (best-effort) */
    private function ip(): string {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /** Retourne un agent utilisateur tronqué pour éviter les débordements */
    private function ua(): string {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        return substr($ua, 0, 250);
    }

    /** Pose (ou rafraîchit) le cookie client */
    private function setCookie(string $sid, int $expires): void {
        setcookie($this->cookieName, $sid, [
            'expires'  => $expires,
            'path'     => '/',
            'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    /**
     * Crée une session côté BDD + cookie
     * @param int  $userId   — ID utilisateur
     * @param bool $remember — si true, étend la durée (30 jours)
     */
    public function login(int $userId, bool $remember=false): void
    {
        $sid = $this->generateId();
        $now = time();
        $ttl = $remember ? (86400*30) : $this->ttl;
        $exp = $now + $ttl;

        // 1) Enregistre en BDD
        $stmt = $this->db->prepare("INSERT INTO user_sessions
            (user_id, session_id, ip_address, user_agent, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $sid, $this->ip(), $this->ua(), $now, $exp]);

        // 2) Cookie client
        $this->setCookie($sid, $exp);
    }

    /**
     * Détruit la session courante (si trouvée via cookie)
     */
    public function logout(): void
    {
        $sid = $_COOKIE[$this->cookieName] ?? null;
        if ($sid) {
            $stmt = $this->db->prepare("DELETE FROM user_sessions WHERE session_id = ?");
            $stmt->execute([$sid]);
            setcookie($this->cookieName, '', time()-3600, '/');
        }
    }

    /**
     * Récupère l'utilisateur connecté (ou null)
     * Met aussi à jour la colonne user_last_activity.
     */
    public function user(): ?array
    {
        $sid = $_COOKIE[$this->cookieName] ?? null;
        if (!$sid) return null;

        $now = time();

        // jointure user_sessions -> users
        $sql = "SELECT u.* 
                FROM user_sessions s 
                JOIN users u ON u.id = s.user_id
                WHERE s.session_id = ? AND s.expires_at > ? 
                LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$sid, $now]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        if (!$user) return null;

        // Rafraîchit l'activité
        $this->db->prepare("UPDATE users SET user_last_activity = ? WHERE id = ?")
                 ->execute([$now, (int)$user['id']]);

        return $user;
    }

    /** Vrai si quelqu'un est connecté */
    public function isLogged(): bool {
        return $this->user() !== null;
    }

    /** Vrai si l'utilisateur courant est admin (groupes 4 ou 27) */
    public function isAdmin(): bool {
        $u = $this->user();
        if (!$u) return false;
        $gid = (int)($u['user_group_id'] ?? 0);
        return in_array($gid, [4, 27], true);
    }

    /**
     * Exige que l'utilisateur soit administrateur.
     * Si ce n'est pas le cas, redirige vers /auth/login ou /403.
     */
    // public function requireAdmin(): void {
    //     if (!$this->isAdmin()) {
    //         header('Location: /auth/login');
    //         exit;
    //     }
    // }


    public function requireAdmin(): void {
        if (!$this->isAdmin()) {
            header("HTTP/1.1 403 Forbidden");
            require ROOT . 'app/views/errors/403.php';
            exit;
        }
    }


    /** Exige une connexion sinon redirige vers /auth/login */
    public function requireAuth(): void {
        if (!$this->isLogged()) {
            header('Location: /auth/login');
            exit;
        }
    }
}

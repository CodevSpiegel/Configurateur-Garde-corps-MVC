<?php
/**
 * app/models/Auth.php
 * -----------------------------------------------------------------------------
 * Couche d'accès pour l'authentification :
 * - Enregistrement (avec token de confirmation e-mail)
 * - Connexion (login via email OU login)
 * - Réinitialisation de mot de passe (token + expiration)
 * - Changement d'e-mail (avec reconfirmation)
 * 
 * ⚠️ Dépend :
 *   - Model.php (pour $this->db)
 *   - La table `users` (voir migration SQL jointe)
 * -----------------------------------------------------------------------------
 */
require_once __DIR__ . '/../core/Model.php';

class Auth extends Model
{
    /** Hashe un mot de passe avec l'API native PHP */
    private function hashPassword(string $plain): string {
        return password_hash($plain, PASSWORD_DEFAULT);
    }

    /** Vérifie un mot de passe */
    private function checkPassword(string $plain, string $hash): bool {
        return password_verify($plain, $hash);
    }

    /** Génère un token aléatoire (pour confirmation email / reset) */
    private function token(int $bytes=32): string {
        return bin2hex(random_bytes($bytes));
    }

    /** Cherche un utilisateur par login OU email */
    public function findByLoginOrEmail(string $identity): ?array
    {
        $sql = "SELECT * FROM users WHERE user_login = ? OR user_email = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$identity, $identity]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /** Inscription d'un nouvel utilisateur */
    public function register(string $login, string $email, string $password): array
    {
        // Simples validations
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['ok'=>false,'error'=>'Email invalide'];
        }
        if (strlen($login) < 3) {
            return ['ok'=>false,'error'=>'Login trop court'];
        }
        if (strlen($password) < 6) {
            return ['ok'=>false,'error'=>'Mot de passe trop court'];
        }

        // Unicité
        $exists = $this->db->prepare("SELECT COUNT(*) FROM users WHERE user_login = ? OR user_email = ?");
        $exists->execute([$login, $email]);
        if ((int)$exists->fetchColumn() > 0) {
            return ['ok'=>false,'error'=>'Login ou email déjà utilisé'];
        }

        $now   = time();
        $token = $this->token();

        // Par défaut on met le groupe "En attente" (id_group=2)
        $groupId = 2;

        $sql = "INSERT INTO users 
            (user_login, user_email, user_password, user_group_id, user_registered, user_last_visit, user_last_activity, user_activation_key, email_confirm_token, email_confirmed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, NULL)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$login, $email, $this->hashPassword($password), $groupId, $now, $now, $now, $token]);

        $id = (int)$this->db->lastInsertId();
        return ['ok'=>true, 'id'=>$id, 'confirm_token'=>$token];
    }

    /** Confirme l'e-mail via token */
    public function confirmEmail(string $token): bool
    {
        $now = time();
        $sql = "UPDATE users SET email_confirm_token=NULL, email_confirmed_at=?,
                user_group_id = CASE WHEN user_group_id=2 THEN 3 ELSE user_group_id END
                WHERE email_confirm_token = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$now, $token]);
        return $stmt->rowCount() === 1;
    }

    /** Essaie de connecter un utilisateur (login ou email) */
    public function attemptLogin(string $identity, string $password): array
    {
        $u = $this->findByLoginOrEmail($identity);
        if (!$u) return ['ok'=>false,'error'=>'Utilisateur introuvable'];

        // le dump initial pouvait contenir des mots de passe non hashés ("password")
        $hash = $u['user_password'];
        $valid = false;
        if (preg_match('/^\$2y\$/', $hash)) {
            $valid = $this->checkPassword($password, $hash);
        } else {
            // Backward-compat: si l'ancien password correspond en clair, on le migre
            if ($password === $hash) {
                $newHash = $this->hashPassword($password);
                $this->db->prepare("UPDATE users SET user_password=? WHERE id=?")
                         ->execute([$newHash, (int)$u['id']]);
                $valid = true;
            }
        }

        if (!$valid) return ['ok'=>false,'error'=>'Mot de passe invalide'];

        // Vérifie que l'email est confirmé (optionnel)
        // if (!empty($u['email_confirm_token'])) {
        //     return ['ok'=>false,'error'=>"Veuillez confirmer votre e-mail avant de vous connecter."];
        // }

        return ['ok'=>true,'user'=>$u];
    }

    /** Demande de réinitialisation: crée un token court et daté */
    public function requestReset(string $email): ?string
    {
        $u = $this->db->prepare("SELECT id FROM users WHERE user_email=? LIMIT 1");
        $u->execute([$email]);
        $row = $u->fetch(\PDO::FETCH_ASSOC);
        if (!$row) return null;

        $token = $this->token(16);
        $exp   = time() + 3600; // 1h
        $this->db->prepare("UPDATE users SET reset_token=?, reset_expires=? WHERE id=?")
                 ->execute([$token, $exp, (int)$row['id']]);
        return $token;
    }

    /** Réinitialisation via token */
    public function resetPassword(string $token, string $newPass): bool
    {
        $now = time();
        $sql = "SELECT id FROM users WHERE reset_token=? AND reset_expires>? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$token, $now]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        if (!$row) return false;

        $this->db->prepare("UPDATE users SET user_password=?, reset_token=NULL, reset_expires=NULL WHERE id=?")
                 ->execute([$this->hashPassword($newPass), (int)$row['id']]);
        return true;
    }

    /** Change l'email (et redemande confirmation) */
    public function changeEmail(int $userId, string $newEmail): array
    {
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            return ['ok'=>false,'error'=>'Email invalide'];
        }
        $exists = $this->db->prepare("SELECT COUNT(*) FROM users WHERE user_email = ? AND id <> ?");
        $exists->execute([$newEmail, $userId]);
        if ((int)$exists->fetchColumn() > 0) {
            return ['ok'=>false,'error'=>'Email déjà utilisé'];
        }
        $token = $this->token(16);
        $this->db->prepare("UPDATE users SET user_email=?, email_confirm_token=?, email_confirmed_at=NULL WHERE id=?")
                 ->execute([$newEmail, $token, $userId]);
        return ['ok'=>true, 'confirm_token'=>$token];
    }

    public function updateLastVisit(int $userId): void {
        $stmt = $this->db->prepare("UPDATE users SET user_last_visit=? WHERE id=?");
        $stmt->execute([time(), $userId]);
    }

}

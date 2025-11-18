<?php
/**
 * app/core/Emails.php
 * -----------------------------------------------------------------------------
 * Petite classe utilitaire pour l'envoi d'e-mails.
 *
 * Objectifs :
 *  - Centraliser la logique d'envoi d'e-mails (confirmation, reset, etc.).
 *  - Avoir une configuration simple (FROM, mode DEV ou PROD).
 *  - Générer des e-mails en HTML *et* en texte brut (multipart/alternative).
 *  - Faciliter le débogage en environnement local WAMP.
 *
 * Utilisation rapide :
 *  ---------------------------------------------------------------------------
 *  // 1) Envoi générique :
 *  Emails::send(
 *      'user@example.com',
 *      'Sujet de test',
 *      '<p>Bonjour en <strong>HTML</strong></p>',
 *      "Bonjour en texte simple"
 *  );
 *
 *  // 2) Envoi e-mail de confirmation :
 *  Emails::sendConfirmationEmail($userEmail, $token);
 *
 *  // 3) Envoi e-mail de reset de mot de passe :
 *  Emails::sendResetPasswordEmail($userEmail, $token);
 * -----------------------------------------------------------------------------
 */

class Emails
{
    /**
     * send()
     * -------------------------------------------------------------------------
     * Méthode principale pour envoyer un e-mail.
     *
     * @param string       $to        Adresse e-mail du destinataire
     * @param string       $subject   Sujet de l'e-mail (en UTF-8)
     * @param string       $htmlBody  Corps du message au format HTML
     * @param string|null  $textBody  Corps du message en texte brut
     *
     * @return bool  true si mail() retourne true, false sinon
     */
    public static function send(string $to, string $subject, string $htmlBody, ?string $textBody = null): bool
    {
        // ---------------------------------------------------------------------
        // 1) Récupération de la configuration définie dans app/config.php
        // ---------------------------------------------------------------------
        // Adresse e-mail d'expédition (ex: "no-reply@moncms.test")
        $fromEmail = defined('MAIL_FROM') ? MAIL_FROM : 'no-reply@squal.dev';

        // Nom lisible de l'expéditeur (ex: "FSA Inox" ou "MonCMS")
        $fromName  = defined('MAIL_FROM_NAME') ? MAIL_FROM_NAME : 'MonCMS';

        // Mode d'envoi : 'prod' (envoi réel) ou 'dev' (debug local)
        $mode      = defined('MAIL_MODE') ? MAIL_MODE : 'dev';

        // En mode 'dev', on peut forcer tous les mails vers une adresse unique
        $devEmail  = defined('MAIL_DEV_TO') ? MAIL_DEV_TO : null;

        // Fichier de log éventuel (pour voir le contenu des mails en local)
        $logFile   = defined('MAIL_LOG_FILE') ? MAIL_LOG_FILE : null;

        // ---------------------------------------------------------------------
        // 2) Si aucun texte brut fourni, on génère une version simplifiée
        // ---------------------------------------------------------------------
        if ($textBody === null || $textBody === '') {
            // On supprime les tags HTML pour avoir une version "plain text"
            $textBody = strip_tags($htmlBody);
        }

        // ---------------------------------------------------------------------
        // 3) En mode DEV : on redirige éventuellement vers une adresse unique
        // ---------------------------------------------------------------------
        if ($mode === 'dev' && !empty($devEmail)) {
            // On garde l'adresse d'origine dans le sujet pour information
            $subject = '[DEV][' . $to . '] ' . $subject;
            $to = $devEmail;
        }

        // ---------------------------------------------------------------------
        // 4) Préparation du sujet encodé pour les clients mail
        // ---------------------------------------------------------------------
        // Le sujet doit être encodé en "encoded-word" pour supporter l'UTF-8
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        // ---------------------------------------------------------------------
        // 5) Génération d'une frontière unique pour le multipart/alternative
        // ---------------------------------------------------------------------
        $boundary = '==Multipart_Boundary_x' . md5((string)microtime(true)) . 'x';

        // ---------------------------------------------------------------------
        // 6) Construction des en-têtes (headers) de l'e-mail
        // ---------------------------------------------------------------------
        $headers  = '';

        // From: "Nom" <email@example.com>
        $headers .= 'From: ' . self::encodeHeaderName($fromName) . ' <' . $fromEmail . '>' . "\r\n";

        // Répondre à la même adresse par défaut
        $headers .= 'Reply-To: ' . $fromEmail . "\r\n";

        // Type de contenu : multipart/alternative pour HTML + texte
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= 'Content-Type: multipart/alternative; boundary="' . $boundary . '"' . "\r\n";

        // ---------------------------------------------------------------------
        // 7) Construction du corps du message au format multipart/alternative
        // ---------------------------------------------------------------------
        $message  = '';

        // Partie texte brut
        $message .= '--' . $boundary . "\r\n";
        $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $textBody . "\r\n\r\n";

        // Partie HTML
        $message .= '--' . $boundary . "\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $htmlBody . "\r\n\r\n";

        // Fin du multipart
        $message .= '--' . $boundary . "--\r\n";

        // ---------------------------------------------------------------------
        // 8) En mode DEV : on log le contenu si un fichier est défini
        // ---------------------------------------------------------------------
        if ($mode === 'dev' && !empty($logFile)) {
            // On prépare une petite trace lisible dans le fichier
            $logContent  = "------------------------------------------------\n";
            $logContent .= date('Y-m-d H:i:s') . "\n";
            $logContent .= "TO     : {$to}\n";
            $logContent .= "SUBJ   : {$subject}\n";
            $logContent .= "HEADERS:\n{$headers}\n";
            $logContent .= "MESSAGE:\n{$message}\n\n";

            // On essaye d'écrire dans le fichier (sans bloquer si erreur)
            @file_put_contents($logFile, $logContent, FILE_APPEND);
        }

        // ---------------------------------------------------------------------
        // 9) Envoi réel via mail() (même en DEV)
        // ---------------------------------------------------------------------
        // Si on veux désactiver complètement l'envoi en DEV, on peux
        // décommenter le return true ci-dessous :
        //
        // if ($mode === 'dev') {
        //     return true;
        // }
        //
        // Pour le moment, on laisse mail() s'exécuter (utile sur un serveur).
        // ---------------------------------------------------------------------
        return mail($to, $encodedSubject, $message, $headers);
    }

    /**
     * encodeHeaderName()
     * -------------------------------------------------------------------------
     * Encode un nom (ex: "France Inox") pour l'utiliser dans les en-têtes
     * avec des caractères spéciaux (UTF-8).
     *
     * @param string $name
     * @return string
     */
    protected static function encodeHeaderName(string $name): string
    {
        // Encodage Base64 pour les caractères non ASCII
        return '=?UTF-8?B?' . base64_encode($name) . '?=';
    }

    /**
     * buildAbsoluteUrl()
     * -------------------------------------------------------------------------
     * Construit une URL absolue (http(s)://domaine/chemin) à partir :
     *  - du protocole détecté dans $_SERVER
     *  - du host (HTTP_HOST)
     *  - d'un chemin relatif (ex: "/auth/confirm/XXXX")
     *
     * Si les superglobales ne sont pas disponibles (CLI), on renvoie
     * simplement le chemin tel quel.
     *
     * @param string $path Chemin commençant par "/" (ex: "/auth/confirm/...")
     * @return string
     */
    public static function buildAbsoluteUrl(string $path): string
    {
        // Vérifie si on est dans un contexte HTTP (variables disponibles)
        if (!isset($_SERVER['HTTP_HOST'])) {
            // Cas CLI ou script sans serveur HTTP → on renvoie le chemin brut
            return $path;
        }

        // Détection du schéma (http ou https)
        $scheme = 'http';
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            $scheme = 'https';
        }

        // Host (ex: "localhost" ou "moncms.local")
        $host = $_SERVER['HTTP_HOST'];

        // On s'assure que le chemin commence par "/"
        if ($path === '' || $path[0] !== '/') {
            $path = '/' . ltrim($path, '/');
        }

        // Exemple : "http://localhost/auth/confirm/XYZ"
        return $scheme . '://' . $host . $path;
    }

    /**
     * sendConfirmationEmail()
     * -------------------------------------------------------------------------
     * Helper pour envoyer l'e-mail de confirmation d'adresse.
     *
     * @param string $email Adresse de l'utilisateur
     * @param string $token Jeton de confirmation (email_confirm_token)
     * @return bool
     */
    public static function sendConfirmationEmail(string $email, string $token): bool
    {
        // Construction du lien de confirmation (URL absolue)
        $link = self::buildAbsoluteUrl('/auth/confirm/' . urlencode($token));

        // Sujet du mail
        $subject = 'Confirmez votre adresse e-mail';

        // Contenu HTML
        $html  = '<p>Bonjour,</p>';
        $html .= '<p>Merci pour votre inscription sur notre site.</p>';
        $html .= '<p>Pour <strong>confirmer votre adresse e-mail</strong>, ';
        $html .= 'cliquez sur le lien ci-dessous :</p>';
        $html .= '<p><a href="' . htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '">';
        $html .= htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '</a></p>';
        $html .= '<p>Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer ce message.</p>';
        $html .= '<p>Cordialement,<br>L\'équipe du site</p>';

        // Contenu texte brut
        $text  = "Bonjour,\n\n";
        $text .= "Merci pour votre inscription sur notre site.\n";
        $text .= "Pour confirmer votre adresse e-mail, copiez/collez ce lien dans votre navigateur :\n";
        $text .= $link . "\n\n";
        $text .= "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.\n\n";
        $text .= "Cordialement,\nL'équipe du site\n";

        // On utilise la méthode générique
        return self::send($email, $subject, $html, $text);
    }

    /**
     * sendResetPasswordEmail()
     * -------------------------------------------------------------------------
     * Helper pour envoyer l'e-mail de réinitialisation de mot de passe.
     *
     * @param string $email Adresse de l'utilisateur
     * @param string $token Jeton de reset (reset_token)
     * @return bool
     */
    public static function sendResetPasswordEmail(string $email, string $token): bool
    {
        // Lien vers la page de reset
        $link = self::buildAbsoluteUrl('/auth/reset/' . urlencode($token));

        $subject = 'Lien de réinitialisation de votre mot de passe';

        $html  = '<p>Bonjour,</p>';
        $html .= '<p>Vous avez demandé la <strong>réinitialisation de votre mot de passe</strong>.</p>';
        $html .= '<p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>';
        $html .= '<p><a href="' . htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '">';
        $html .= htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '</a></p>';
        $html .= '<p>Ce lien est valable pendant une durée limitée.</p>';
        $html .= '<p>Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer ce message.</p>';
        $html .= '<p>Cordialement,<br>L\'équipe du site</p>';

        $text  = "Bonjour,\n\n";
        $text .= "Vous avez demandé la réinitialisation de votre mot de passe.\n";
        $text .= "Pour définir un nouveau mot de passe, copiez/collez ce lien dans votre navigateur :\n";
        $text .= $link . "\n\n";
        $text .= "Ce lien est valable pendant une durée limitée.\n";
        $text .= "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.\n\n";
        $text .= "Cordialement,\nL'équipe du site\n";

        return self::send($email, $subject, $html, $text);
    }

    /**
     * sendChangeEmailConfirmation()
     * -------------------------------------------------------------------------
     * Helper pour envoyer un lien de validation lorsqu'un utilisateur
     * demande un changement d'adresse e-mail.
     *
     * @param string $newEmail Nouvelle adresse e-mail à confirmer
     * @param string $token    Jeton de confirmation
     * @return bool
     */
    public static function sendChangeEmailConfirmation(string $newEmail, string $token): bool
    {
        $link = self::buildAbsoluteUrl('/auth/confirm/' . urlencode($token));

        $subject = 'Confirmez votre nouvelle adresse e-mail';

        $html  = '<p>Bonjour,</p>';
        $html .= '<p>Vous avez demandé à <strong>changer votre adresse e-mail</strong>.</p>';
        $html .= '<p>Pour confirmer cette nouvelle adresse, cliquez sur le lien suivant :</p>';
        $html .= '<p><a href="' . htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '">';
        $html .= htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '</a></p>';
        $html .= '<p>Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer ce message.</p>';
        $html .= '<p>Cordialement,<br>L\'équipe du site</p>';

        $text  = "Bonjour,\n\n";
        $text .= "Vous avez demandé à changer votre adresse e-mail.\n";
        $text .= "Pour confirmer cette nouvelle adresse, copiez/collez ce lien dans votre navigateur :\n";
        $text .= $link . "\n\n";
        $text .= "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.\n\n";
        $text .= "Cordialement,\nL'équipe du site\n";

        return self::send($newEmail, $subject, $html, $text);
    }
}

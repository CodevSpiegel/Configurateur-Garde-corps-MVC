<?php
/**
 * ============================================================================
 * app\core\Functions.php
 * ============================================================================
 */

class Functions {

/**
 * formatDateFr
 * -------------
 * Formatte un timestamp Unix (ex: time()) en français selon un style.
 * 
 * Styles disponibles (paramètre $style) :
 *  - 'short'       => 29/10/2025
 *  - 'shortTime'   => 29/10/2025 - 15h36
 *  - 'medium'      => 29 oct. 2025, 15:36  (Intl)
 *  - 'long'        => mercredi 29 octobre 2025 à 15:36  (Intl)
 *  - 'full'        => mercredi 29 octobre 2025 à 15:36:42  (Intl + secondes)
 *  - 'iso'         => 2025-10-29T15:36:42+01:00  (ISO 8601)
 *  - 'db'          => 2025-10-29 15:36:42       (pour BDD)
 *  - 'relative'    => Aujourd’hui à 15:36 / Hier à 20:10 / Demain à 09:00 / 29/10/2025 à 15h36
 *  - 'diff'        => il y a 2 h 15 min / dans 3 jours 4 h (durée relative pure)
 *
 * Options (paramètre $opts, tableau associatif) :
 *  - 'tz'           => fuseau horaire (par défaut 'Europe/Paris')
 *  - 'showSeconds'  => bool (par défaut false) pour certains styles
 *  - 'capitalize'   => bool (par défaut false) met une majuscule au premier caractère (ex: "Mercredi ...")
 *  - 'relativeTime' => bool (par défaut true pour 'relative') : inclure l'heure dans Aujourd’hui/Hier/Demain
 *  - 'hSeparator'   => string (par défaut "h") pour shortTime ("15h36"). Mettre ":" pour "15:36".
 *
 * Remarques :
 *  - Utilise IntlDateFormatter quand pertinent (medium/long/full) — remplace strftime (déprécié).
 *  - Tombe en secours sur date() si l’extension intl n’est pas disponible.
 *  - Les noms de jours/mois sont en minuscules en français (usage courant). Mettre 'capitalize' => true si voulu.
 */
function formatDateFr(int $timestamp, string $style = 'shortTime', array $opts = []): string
{
    // --------- Options / défauts ---------
    $tz          = $opts['tz']          ?? 'Europe/Paris';
    $showSeconds = $opts['showSeconds'] ?? false;
    $capitalize  = $opts['capitalize']  ?? false;
    $relativeTime= $opts['relativeTime']?? true;
    $hSep        = $opts['hSeparator']  ?? 'h'; // 'h' => "15h36", ':' => "15:36"

    // S'assure du bon fuseau pour toutes les fonctions date/Intl
    date_default_timezone_set($tz);

    // ------- Petites fonctions utilitaires -------
    $cap = static function (string $s) use ($capitalize): string {
        if (!$capitalize || $s === '') return $s;
        // Met une majuscule au tout premier caractère (en UTF-8)
        $first = mb_substr($s, 0, 1, 'UTF-8');
        return mb_strtoupper($first, 'UTF-8') . mb_substr($s, 1, null, 'UTF-8');
    };

    $formatTime = static function (int $ts, bool $withSeconds = false, string $sep = 'h'): string {
        // Rend "15h36" ou "15h36:42" / si $sep=':' => "15:36" ou "15:36:42"
        if ($withSeconds) {
            return $sep === 'h' ? date('H\h i:s', $ts) : date('H:i:s', $ts);
        }
        return $sep === 'h' ? date('H\hi', $ts) : date('H:i', $ts);
    };

    $hasIntl = class_exists('IntlDateFormatter');

    // ------- Cas spéciaux sans Intl -------
    if ($style === 'iso') {
        // ISO 8601 avec offset
        return date('c', $timestamp); // ex: 2025-10-29T15:36:42+01:00
    }
    if ($style === 'db') {
        // Format commun pour stockage BDD
        return date('Y-m-d H:i:s', $timestamp); // 2025-10-29 15:36:42
    }
    if ($style === 'short') {
        // Date courte FR
        return date('d/m/Y', $timestamp); // 29/10/2025
    }
    if ($style === 'shortTime') {
        // Date courte + heure familière
        return date('d/m/Y', $timestamp) . ' - ' . $formatTime($timestamp, $showSeconds, $hSep);
    }

    // ------- Styles "relative" / "diff" -------
    if ($style === 'relative') {
        // Calcule si c'est Aujourd’hui / Hier / Demain (selon la DATE en France)
        $today   = (int)date('Ymd');                 // ex: 20251029
        $thatDay = (int)date('Ymd', $timestamp);     // date du timestamp
        $label   = null;

        if ($thatDay === $today)   $label = "Aujourd’hui";
        elseif ($thatDay === $today - 1) $label = "Hier";
        elseif ($thatDay === $today + 1) $label = "Demain";

        if ($label) {
            // Ex: "Aujourd’hui à 15:36" (respecte hSeparator)
            $out = $label;
            if ($relativeTime) {
                $out .= ' à ' . $formatTime($timestamp, $showSeconds, $hSep);
            }
            return $cap($out);
        }

        // Sinon on retombe sur un format court lisible :
        return date('d/m/Y', $timestamp) . ' à ' . $formatTime($timestamp, $showSeconds, $hSep);
    }

    if ($style === 'diff') {
        // Durée relative entre maintenant et le timestamp (passé/futur)
        $now  = time();
        $diff = $timestamp - $now; // positif = futur, négatif = passé
        $abs  = abs($diff);

        // Décompose en jours / heures / minutes / secondes
        $days = intdiv($abs, 86400);        $abs %= 86400;
        $hrs  = intdiv($abs, 3600);         $abs %= 3600;
        $min  = intdiv($abs, 60);           $sec = $abs % 60;

        // Construit une phrase compacte
        $parts = [];
        if ($days) $parts[] = $days . ' ' . ($days > 1 ? 'jours' : 'jour');
        if ($hrs)  $parts[] = $hrs . ' ' . ($hrs > 1 ? 'h' : 'h');
        if ($min)  $parts[] = $min . ' ' . ($min > 1 ? 'min' : 'min');
        if (!$days && !$hrs && !$min && $sec) $parts[] = $sec . ' s';

        $chunk = $parts ? implode(' ', $parts) : '0 s';

        $out = $diff < 0 ? "il y a $chunk" : "dans $chunk";
        return $cap($out);
    }

    // ------- Styles basés sur Intl (medium/long/full) -------
    // Note : si intl indisponible, on fournit un fallback correct.
    $dateStyle = match ($style) {
        'medium' => \IntlDateFormatter::MEDIUM,
        'long'   => \IntlDateFormatter::LONG,  // LONG = "29 octobre 2025" (sans jour de semaine)
        'full'   => \IntlDateFormatter::FULL,  // FULL = "mercredi 29 octobre 2025"
        default  => \IntlDateFormatter::MEDIUM,
    };

    // Heure : SHORT par défaut, on force l’affichage des secondes si demandé
    // ⚠ Intl ne permet pas facilement "HH:mm:ss" custom ; on combine proprement.
    if ($hasIntl) {
        // 1) Formatte la partie date en français via Intl
        $dateFmt = new \IntlDateFormatter('fr_FR', $dateStyle, \IntlDateFormatter::NONE, $tz, \IntlDateFormatter::GREGORIAN);
        $datePart = $dateFmt->format($timestamp);

        // 2) Ajoute la partie heure manuellement, pour garder "15h36" (ou ":" si désiré)
        $timePart = $formatTime($timestamp, $showSeconds || $style === 'full', $hSep);

        // Selon le style, on place virgule ou "à"
        // - medium : usage courant avec virgule (ex: "29 oct. 2025, 15:36")
        // - long/full : on préfère "à"
        if ($style === 'medium') {
            $out = $datePart . ', ' . ($hSep === 'h' ? str_replace('h ', 'h', $timePart) : $timePart);
        } else {
            $out = $datePart . ' à ' . ($hSep === 'h' ? str_replace('h ', 'h', $timePart) : $timePart);
        }
        return $cap($out);
    }

    // ------- Fallback si intl absent -------
    // On reconstruit quelque chose d'équivalent :
    if ($style === 'medium') {
        // Ex: "29 oct. 2025, 15:36"
        $months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
        $m      = (int)date('n', $timestamp);
        $datePart = date('d ', $timestamp) . $months[$m - 1] . date(' Y', $timestamp);
        return $cap($datePart . ', ' . $formatTime($timestamp, false, $hSep));
    }
    if ($style === 'long' || $style === 'full') {
        // "mercredi 29 octobre 2025 à 15:36(:42)"
        $days   = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
        $months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
        $w      = (int)date('w', $timestamp);
        $d      = (int)date('j', $timestamp);
        $m      = (int)date('n', $timestamp);
        $y      = date('Y', $timestamp);

        $datePart = ($style === 'full' ? $days[$w] . ' ' : '') . $d . ' ' . $months[$m - 1] . ' ' . $y;
        $timePart = $formatTime($timestamp, $showSeconds || $style === 'full', $hSep);
        return $cap($datePart . ' à ' . $timePart);
    }

    // ------- Secours ultime -------
    return date('d/m/Y', $timestamp) . ' à ' . $formatTime($timestamp, $showSeconds, $hSep);
}

// ======================
// Exemples rapides
// ======================
// echo formatDateFr(time(), 'short');         // 29/10/2025
// echo formatDateFr(time(), 'shortTime');     // 29/10/2025 à 15h36
// echo formatDateFr(time(), 'medium');        // 29 oct. 2025, 15:36
// echo formatDateFr(time(), 'long');          // mercredi 29 octobre 2025 à 15:36
// echo formatDateFr(time(), 'full');          // mercredi 29 octobre 2025 à 15:36:42
// echo formatDateFr(time(), 'iso');           // 2025-10-29T15:36:42+01:00
// echo formatDateFr(time(), 'db');            // 2025-10-29 15:36:42
// echo formatDateFr(time(), 'relative');      // Aujourd’hui à 15:36 / Hier à 20:10 / Demain à 09:00 / 29/10/2025 à 15h36
// echo formatDateFr(time()+3700, 'diff');     // dans 1 h 1 min
// echo formatDateFr(time(), 'shortTime', ['hSeparator' => ':']); // 29/10/2025 à 15:36
// echo formatDateFr(time(), 'long', ['capitalize' => true]);     // Mercredi 29 octobre 2025 à 15:36

}
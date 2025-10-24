<?php

class FUNC {


    /**
     * Génère (si besoin) et retourne un token CSRF stocké en session.
     * On expose ce token côté vue (meta ou JS) pour l’envoyer via header.
     */
    public static function csrf_token(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            // random_bytes -> chaîne aléatoire cryptographiquement sûre
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Vérifie le token CSRF reçu depuis le client (header ou post field).
     * @param string|null $tokenFromClient
     * @return bool
     */
    public static function csrf_verify(?string $tokenFromClient): bool
    {
        if (empty($_SESSION['csrf_token'])) return false;

        // hash_equals : protection timing-attack
        return $tokenFromClient !== null && hash_equals($_SESSION['csrf_token'], $tokenFromClient);
    }

    /*---------------------*/
	// Redirect
	/*---------------------*/
	public function boink_it( $url = "/" )
	{
		header("Location: ".$url);
		die;
    }


	public function error_404()
	{
        http_response_code(404);
		require_once ROOT . 'views/404_view.php';
        die;
    }


    public function load_view( string $name )
    {
		if( class_exists($name) ) {
			return new $name();
		}

		// Simply require and return
		if ( ! file_exists( ROOT.'views/'.$name.'.php')) {
			echo "<span style='background-color:#ccc; color:red; font-style: italic; padding:3px;'>'/views/".$name.".php' est introuvable !</span>";
			die;
		}
		else {
			require_once ROOT.'views/'.$name.'.php';
		}

		return new $name;
	}

    /**
     * ===========================================================
     *   📅 FONCTION : date_fr_universelle()
     * ===========================================================
     *  Objectif :
     *    Formater une date, un timestamp ou un objet DateTime
     *    en français, avec ou sans heure/secondes, en style court
     *    ou long, avec gestion d’"Aujourd'hui" et "Hier".
     * 
     * -----------------------------------------------------------
     *  Paramètres :
     * -----------------------------------------------------------
     *  @param int|DateTimeInterface|string $moment
     *      - Timestamp Unix (int)
     *      - Objet DateTime / DateTimeImmutable
     *      - Chaîne de date parsable (ex: "2025-08-13 15:42:07")
     *
     *  @param string $style
     *      Définit le format d'affichage :
     *        "court"            => 13/08/2025
     *        "court+heure"      => 13/08/2025 15:42
     *        "court+heure+sec"  => 13/08/2025 15:42:07
     *        "long"             => Mercredi 13 Août 2025
     *        "long+heure"       => Mercredi 13 Août 2025 15:42
     *        "long+heure+sec"   => Mercredi 13 Août 2025 15:42:07
     *
     *  @param bool $remplacerRelatif
     *      TRUE  => remplace la date du jour par "Aujourd'hui"
     *               et la veille par "Hier" (en conservant l'heure si demandée).
     *      FALSE => toujours afficher la date complète.
     *
     *  @param string|null $timezone
     *      Fuseau horaire IANA (ex: "Europe/Paris").
     *      Null => fuseau par défaut de PHP (date_default_timezone_get()).
     *
     * -----------------------------------------------------------
     *  Retour :
     * -----------------------------------------------------------
     *  @return string
     *      La date formatée en français selon le style choisi.
     *
     * -----------------------------------------------------------
     *  Compatibilité :
     * -----------------------------------------------------------
     *  - PHP 8.1+
     *  - Utilise IntlDateFormatter si disponible (gère les accents et locales)
     *  - Fallback manuel si extension intl absente
     *
     * -----------------------------------------------------------
     *  Exemples :
     * -----------------------------------------------------------
     *  echo date_fr_universelle(time(), 'court');
     *      // "13/08/2025"
     *
     *  echo date_fr_universelle(time(), 'court+heure');
     *      // "Aujourd'hui 15:42"
     *
     *  echo date_fr_universelle(time(), 'court+heure+sec');
     *      // "Aujourd'hui 15:42:07"
     *
     *  echo date_fr_universelle(time(), 'long');
     *      // "Mercredi 13 Août 2025"
     *
     *  echo date_fr_universelle(time(), 'long+heure');
     *      // "Mercredi 13 Août 2025 15:42"
     *
     *  echo date_fr_universelle('2025-12-25', 'long+heure+sec');
     *      // "Jeudi 25 Décembre 2025 00:00:00"
     *
     * -----------------------------------------------------------
     *  Astuce :
     * -----------------------------------------------------------
     *  - Utilise "long" pour des affichages lisibles pour l’utilisateur.
     *  - Utilise "court" pour les listes, tableaux, logs.
     *  - Active $remplacerRelatif pour un rendu plus humain ("Aujourd'hui"/"Hier").
     * ===========================================================
     */


    function date_fr_universelle(
        int|DateTimeInterface|string $moment,
        string $style = 'long',
        bool $remplacerRelatif = true,
        ?string $timezone = 'Europe/Paris'
    ): string {
        // ----------------------------
        // 1) Normalisation DateTime
        // ----------------------------
        try {
            $tz  = new DateTimeZone($timezone ?? date_default_timezone_get());
            if ($moment instanceof DateTimeInterface) {
                // On clone en DateTimeImmutable dans le bon fuseau
                $dt = (new DateTimeImmutable('@' . $moment->getTimestamp()))
                    ->setTimezone($tz);
            } elseif (is_numeric($moment)) {
                $dt = (new DateTimeImmutable('@' . (int)$moment))
                    ->setTimezone($tz);
            } else {
                // Chaîne parsable
                $tmp = new DateTimeImmutable((string)$moment, $tz);
                // Sécuriser en repassant par le timestamp (évite surprises TZ)
                $dt  = (new DateTimeImmutable('@' . $tmp->getTimestamp()))->setTimezone($tz);
            }
        } catch (Throwable $e) {
            return '';
        }

        // Helpers : savoir si on affiche l'heure et les secondes selon le style
        $avecHeure    = str_contains($style, '+heure');
        $avecSecondes = str_contains($style, '+sec');

        // ------------------------------------------
        // 2) Gestion "Aujourd'hui" / "Hier" (option)
        //    -> Comparaison en YYYY-mm-dd dans le TZ
        // ------------------------------------------
        if ($remplacerRelatif) {
            $aujourdHui = (new DateTimeImmutable('now', $tz))->format('Y-m-d');
            $hier       = (new DateTimeImmutable('yesterday', $tz))->format('Y-m-d');
            $dateCible  = $dt->format('Y-m-d');

            if ($dateCible === $aujourdHui) {
                $out = "aujourd'hui";
                if ($avecHeure) $out .= ' à ' . $dt->format($avecSecondes ? 'H:i:s' : 'H:i');
                return $out;
            }
            if ($dateCible === $hier) {
                $out = "hier";
                if ($avecHeure) $out .= ' à ' . $dt->format($avecSecondes ? 'H:i:s' : 'H:i');
                return $out;
            }
        }

        // ------------------------------------------
        // 3) Styles "court" : simple via ->format()
        // ------------------------------------------
        if (str_starts_with($style, 'court')) {
            $out = $dt->format('d/m/Y');
            if ($avecHeure) {
                $out .= ' à ' . $dt->format($avecSecondes ? 'H:i:s' : 'H:i');
            }
            return $out;
        }

        // ------------------------------------------------------
        // 4) Styles "long" : jour/mois en lettres + majuscules
        //    a) Si intl dispo, on l'utilise pour la locale fr
        //    b) Sinon fallback manuel (tableaux FR)
        // ------------------------------------------------------
        if (class_exists('IntlDateFormatter')) {
            // Jour semaine (mercredi), jour (13), mois (août), année (2025)
            $fmtJourSem = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE, $tz->getName(), null, 'EEEE');
            $fmtJour    = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE, $tz->getName(), null, 'd');
            $fmtMois    = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE, $tz->getName(), null, 'MMMM');
            $fmtAnnee   = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE, $tz->getName(), null, 'yyyy');

            // Récupération
            $jourSem = $fmtJourSem->format($dt);
            $jour    = $fmtJour->format($dt);
            $mois    = $fmtMois->format($dt);
            $annee   = $fmtAnnee->format($dt);

            // Majuscules initiales (UTF-8)
            $jourSem = mb_strtoupper(mb_substr($jourSem, 0, 1, 'UTF-8'), 'UTF-8') . mb_substr($jourSem, 1, null, 'UTF-8');
            $mois    = mb_strtoupper(mb_substr($mois, 0, 1, 'UTF-8'), 'UTF-8')     . mb_substr($mois, 1, null, 'UTF-8');

            $out = "$jourSem $jour $mois $annee";
            if ($avecHeure) {
                $fmtHeure = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE, $tz->getName(), null, $avecSecondes ? 'HH:mm:ss' : 'HH:mm');
                $out .= ' à ' . $fmtHeure->format($dt);
            }
            return $out;
        }

        // --- Fallback sans intl ---
        $joursFr = [0=>'Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
        $moisFr  = [1=>'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

        $jourSem = $joursFr[(int)$dt->format('w')];
        $jour    = $dt->format('d');
        $mois    = $moisFr[(int)$dt->format('n')];
        $annee   = $dt->format('Y');

        $out = "$jourSem $jour $mois $annee";
        if ($avecHeure) {
            $out .= ' à ' . $dt->format($avecSecondes ? 'H:i:s' : 'H:i');
        }
        return $out;
    }

}
<?php

class FUNC {

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
     * Convertit un timestamp en date française avec :
     * - Jour de la semaine en français
     * - Mois avec majuscule
     * - "Aujourd'hui" ou "Hier" si applicable
     * - Compatible PHP 8.1+ avec ou sans intl
     *
     * @param int|DateTimeInterface|string $timestamp  Timestamp, DateTime ou date parsable
     * @param bool                         $avecHeure  TRUE => ajoute "HH:mm"
     * @return string                                  Date formatée
     */
    function date_fr($timestamp, bool $avecHeure = false): string
    {
        // Normalisation en timestamp
        if ($timestamp instanceof DateTimeInterface) {
            $ts = $timestamp->getTimestamp();
        } elseif (is_numeric($timestamp)) {
            $ts = (int) $timestamp;
        } else {
            $ts = strtotime((string) $timestamp);
            if ($ts === false) return '';
        }

        // Vérifier si c'est aujourd'hui ou hier
        $dateDuJour = date('Y-m-d');
        $dateHier   = date('Y-m-d', strtotime('-1 day'));
        $dateCible  = date('Y-m-d', $ts);

        if ($dateCible === $dateDuJour) {
            $out = "aujourd'hui";
            if ($avecHeure) {
                $out .= ' à ' . date('H:i', $ts);
            }
            return $out;
        }

        if ($dateCible === $dateHier) {
            $out = "hier";
            if ($avecHeure) {
                $out .= ' à ' . date('H:i', $ts);
            }
            return $out;
        }

        // Affichage normal : jour + mois + année
        if (class_exists('IntlDateFormatter')) {
            // Intl pour jour, mois et année
            $fmtJourSem = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE);
            $fmtJourSem->setPattern('EEEE'); // "mercredi"

            $fmtJour = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE);
            $fmtJour->setPattern('d');

            $fmtMois = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE);
            $fmtMois->setPattern('MMMM');

            $fmtAnnee = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE);
            $fmtAnnee->setPattern('yyyy');

            // Capitaliser
            $jourSem = mb_strtoupper(mb_substr($fmtJourSem->format($ts), 0, 1, 'UTF-8'), 'UTF-8')
                    . mb_substr($fmtJourSem->format($ts), 1, null, 'UTF-8');
            $mois    = mb_strtoupper(mb_substr($fmtMois->format($ts), 0, 1, 'UTF-8'), 'UTF-8')
                    . mb_substr($fmtMois->format($ts), 1, null, 'UTF-8');
            $jour    = $fmtJour->format($ts);
            $annee   = $fmtAnnee->format($ts);

            $out = "$jourSem $jour $mois $annee";
            if ($avecHeure) {
                $fmtHeure = new IntlDateFormatter('fr_FR', IntlDateFormatter::NONE, IntlDateFormatter::NONE);
                $fmtHeure->setPattern('HH:mm');
                $out .= ' à ' . $fmtHeure->format($ts);
            }
            return $out;
        }

        // Fallback sans intl
        $joursFr = [
            0 => 'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
                'Jeudi', 'Vendredi', 'Samedi'
        ];
        $moisFr = [
            1 => 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        $jourSem = $joursFr[(int)date('w', $ts)];
        $jour    = date('d', $ts);
        $mois    = $moisFr[(int)date('n', $ts)];
        $annee   = date('Y', $ts);

        $out = "$jourSem $jour $mois $annee";
        if ($avecHeure) {
            $out .= ' à ' . date('H:i', $ts);
        }
        return $out;
    }

}
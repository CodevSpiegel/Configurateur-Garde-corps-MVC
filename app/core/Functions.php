<?php

class Functions {


    /**
     * Convertit un timestamp Unix (ex: time()) en date française lisible.
     *
     * @param int $timestamp   Timestamp Unix (ex: time()).
     * @return string          Date au format "29/10/2025 à 15h36".
     * 
     * 🧪 Exemple d'utilisation :
     * echo formatDateFr(time()); // 👉 29/10/2025 à 15h36
     */
    function formatDateFr(int $timestamp, $format = ''): string {
        // On fixe le fuseau horaire sur Paris (important si serveur étranger)
        date_default_timezone_set('Europe/Paris');

        // On formate la date manuellement pour un rendu clair et court
        if ($format === "heure") {
            return date('d/m/Y - H\hi', $timestamp);
        }
        else {
            return date('d/m/Y', $timestamp);
        }
    }

}
<?php

class about_controller {

    public function index(...$params) {
        // Les trois petits points ... que l’on voit
        // s’appellent l’opérateur de déballage (ou variadic operator en anglais).
        // Ils servent à dire à PHP :
        // "Je ne sais pas à l’avance combien de paramètres cette fonction va recevoir, alors prends-les tous et mets-les dans un tableau."

        // Afficher les paramètres pour test
        var_dump($params);

        // Affiche la vue "à propos"
        require ROOT . 'views/about_view.php';
    }
}

<?php

class FUNC {

    public function parse_incoming()
	{
        // // Récupère l'URI de la requête complète (par exemple, "/produits/chaussures/hiver?couleur=bleu")
        // $requestUri = $_SERVER['REQUEST_URI'];

        // // Extrait seulement le chemin de l'URL (enlève les paramètres GET s'il y en a)
        // $requestPath = parse_url($requestUri, PHP_URL_PATH);

        // // Supprime les slashes de début et de fin, puis divise la chaîne en un tableau de segments
        // $segments = explode('/', trim($requestPath, '/'));

        // // Parfois, explode peut laisser des segments vides si l'URL a des doubles slashes ou se termine par un slash.
        // // Filtrons-les pour avoir un tableau propre.
        // // $segments = array_filter($segments);
        // $segments = array_filter($segments, function($value) {
        //     // Pourquoi ajouter function($value) ? :
        //     // Cette condition garde toutes les valeurs qui ne sont PAS null, false, ou une chaîne vide.
        //     // Elle gardera spécifiquement 0 (int) et '0' (string) car elles ne sont pas considérées comme "empty" par cette logique,
        //     // mais elles sont "empty" pour array_filter sans callback.
        //     // Donc ! Sans cette condition, la valeur 0 (zéro) est considérée comme "false" et sera donc ignorée...
        //     return $value !== null && $value !== false && $value !== '';
        // });

        // // Si l'on veut réindexer le tableau pour qu'il commence toujours à 0
        // $segments = array_values($segments);

        // // A gerer ! http://novav4/home/?<script>alert("Si ça passe... Ca craint un max là !")</script>
        // // http://novav4/?<script>alert("Si ça passe... Ca craint un max là !")</script>
        // // Si des paramètres GET normaux ont été passés (grâce à QSA)
        // if (!empty($_GET)) {
        //     // Liste toutes les variables contenues dans $_GET
		// 	foreach( $_GET as $k => $v )
		// 	{
		// 		$k = htmlspecialchars($k);
		// 		$v = htmlspecialchars($v);

        //         $return[$k] = htmlspecialchars($v);
		// 	}
        //     $_GET = $return;
        // }

        // if (!empty($_POST)) {
        //     // Liste toutes les variables contenues dans $_POST
		// 	foreach( $_POST as $k => $v )
		// 	{
		// 		$k = htmlspecialchars($k);
		// 		$v = htmlspecialchars($v);

        //         $return[$k] = htmlspecialchars($v);
		// 	}
        //     $_POST = $return;
        // }

        // return $segments;
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

}
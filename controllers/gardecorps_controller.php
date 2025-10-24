<?php
/*
 *   * récupère l'action depuis l'URL (segment 2) ;
 *   * charge la vue via $func->load_view('home_view') ;
 *   * construit $this->output avec $this->html->start()/row()/end() ;
 *   * envoie la sortie via $print->add_output() puis $print->do_output().
 */
class gardecorps_controller {

    /** @var string|false Action demandée (segment 2 de l'URL) */
    public $action;

    /** @var string Buffer HTML final (construit via la vue) */
    public $output = "";

    /** @var string Titre de page (balise <title>) */
    public $page_title;

    /** @var string Meta description */
    public $page_description;

    public $css;
    public $script;

    /** @var object Instance de la vue "login_view" (méthodes start/row/end/etc.) */
    public $html;

    /**
     * Point d'entrée par défaut
     * -------------------------------------------------------------------------
     * URL attendues :
     *   - /home                       => Accueil
     *   - /home/action-01             => test 1
     *   - /home/action-02             => test 2
     */

    // Les trois petits points ...$params que l’on voit
    // s’appellent l’opérateur de déballage (ou variadic operator en anglais).
    // Ils servent à dire à PHP :
    // "Je ne sais pas à l’avance combien de paramètres cette fonction va recevoir, alors prends-les tous et mets-les dans un tableau."
    public function index(...$params) 
    {
        // Injecte des services globaux exposés par le bootstrap
        global $func, $print;

        // Afficher les paramètres pour test
        // var_dump($params);

        // 1) Récupère l'action (ex: "action-01" ou "action-02")
        $this->action = $params[0] ?? false;

        // require_once ROOT."models/home_model.php";

        // 2) Charge la vue dédiée a Home (classe définie dans /views/home_view.php)
        $this->html = $func->load_view('gardecorps_view');

        // 3) Router interne selon l'action
    	switch( $this->action ) {
    		case 'cables':
    			$this->show_section_1();
    			break;
    		case 'barres':
    			$this->show_section_2();
    			break;
    		default:
    			$this->show_page();
    			break;
    	}

        // Match.. Ne fonctionne pas sur www.squaldev.com (A VOIR !!!)
        // match($section) {
        //     'section_01' => $this->show_section_1(),
        //     'section_02' => $this->show_section_2(),
        //     default => $this->show_page()
        // };

        // 4) Envoie la sortie au moteur de rendu commun (Display)
        $print->add_output($this->output);
		$print->do_output( array( 'HEAD_TITLE' => $this->page_title, 
                                  'HEAD_DESCRIPTION' => $this->page_description,
                                  'ADD_CSS' => $this->css,
                                  'SCRIPT' => $this->script) );
    }


    public function show_page() {
        global $site, $func;

        // Si $this->action existe ici
        // c'est que la page n'existe pas.
        if( $this->action ) {
            $func->error_404();
        }

        $this->page_title = $site->const['WEBSITE_NAME'] ." - Gardes-corps";
        $this->page_description = "Description de la page Home";

        $csrf = func::csrf_token();

        $this->script = $this->html->script($csrf);
        $this->css = $this->html->css();

        // -- Construit la page via la vue
        $this->output = $this->html->start();

        $this->output .= $this->html->main_content();

        $this->output .= $this->html->end();
    }


    public function show_section_1() {

        $timeNow = time();

        $this->output = $this->html->start();
        $this->output .= $this->html->row($timeNow);
        $this->output .= $this->html->end();

    }


    public function show_section_2() {

       $this->output = $this->html->start();
        $this->output .= $this->html->row("Action 2");
        $this->output .= $this->html->end();
    }

}

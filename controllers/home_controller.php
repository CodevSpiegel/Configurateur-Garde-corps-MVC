<?php

class home_controller {

    public $action;
    public $output = "";
    public $page_title;
    public $page_description;
    public $html;

    public function index(...$params) {
        global $func, $print;
        // Les trois petits points ... que l’on voit
        // s’appellent l’opérateur de déballage (ou variadic operator en anglais).
        // Ils servent à dire à PHP :
        // "Je ne sais pas à l’avance combien de paramètres cette fonction va recevoir, alors prends-les tous et mets-les dans un tableau."

        // Afficher les paramètres pour test
        // var_dump($params);

        $this->action = $params[0] ?? false;

        require_once ROOT."models/home_model.php";

        $this->html = $func->load_view('home_view');

        //--------------------------------------------
    	// Decider quoi faire ?
    	//--------------------------------------------
    	switch( $this->action ) {
    		case 'action-01':
    			$this->show_section_1();
    			break;
    		case 'action-02':
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

        $print->add_output($this->output);
		$print->do_output( array( 'HEAD_TITLE' => $this->page_title, 'HEAD_DESCRIPTION' => $this->page_description ) );
    }


    public function show_page() {
        global $site, $func;

        // Si $this->action existe ici
        // c'est que la page n'existe pas.
        if( $this->action ) {
            $func->error_404();
        }

        $this->page_title = $site->const['WEBSITE_NAME'] ." - Show Page";
        $this->page_description = "Description de la page Home";

        $req = new home_model();
        $articles = $req->select_all_articles();

        $this->output = $this->html->start();

        if (!empty($articles)) {
            foreach ($articles as $article) :
                $this->output .= $this->html->row_article($article);
            endforeach;
        } else {
            $this->output .= $this->html->row("Aucun article trouvé.");
        }

        $this->output .= $this->html->end();
    }


    public function show_section_1() {

        $this->output = $this->html->start();
        $this->output .= $this->html->row("Action 1");
        $this->output .= $this->html->end();

    }


    public function show_section_2() {

       $this->output = $this->html->start();
        $this->output .= $this->html->row("Action 2");
        $this->output .= $this->html->end();
    }

}

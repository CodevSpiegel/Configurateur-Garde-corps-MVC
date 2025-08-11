<?php

class Display {

	public $to_print = "";

	//-------------------------------------------
	// Appends the parsed HTML to our _class var
	//-------------------------------------------
	public function add_output( string $to_add ) {
		$this->to_print .= $to_add;
		//return 'true' on success
		return true;
	}

	//-------------------------------------------
	// Parses all the information and prints it.
	//-------------------------------------------
	public function do_output( array $output_array )
	{
		global $site, $global_view, $Debug;

		// HEAD
		$head_datas['HEAD_TITLE'] = $output_array['HEAD_TITLE'] ?? "";
		$head_datas['HEAD_DESCRIPTION'] = $output_array['HEAD_DESCRIPTION'] ?? "";

		$output_array['HEAD'] = $global_view->site_head($head_datas);

		// HEADER
		$output_array['HEADER'] = $global_view->site_header();

		// MAIN
		$output_array['MAIN'] = $this->to_print;

		// FOOTER
		$output_array['FOOTER'] = $global_view->site_footer();
		$output_array['DEBUG'] = "";

		if( DEBUG_TIME_EXECUTION ) {
			// Code à mesurer
			// usleep(500000); // Attente de 0,5 seconde (500 ms)
			$Debug->stop();
			$dataString = $Debug->returnExecutionTime();

			$output_array['DEBUG'] = $global_view->site_debug($dataString);
		}

		$content = $output_array;

		ob_start();

		include ( ROOT."views/template.php" );

		$content = ob_get_clean();

		echo $content;
		// print $content;
		exit;
	}

}

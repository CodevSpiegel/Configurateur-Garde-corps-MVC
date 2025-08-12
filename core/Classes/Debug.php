<?php

class Debug
{
    // Variables pour stocker le temps de départ et de fin
    private float $startTime;
    private float $endTime;

    // Lance le chronomètre
    public function start(): void
    {
        $this->startTime = microtime(true); // Temps en secondes + microsecondes
    }

    // Arrête le chronomètre
    public function stop(): void
    {
        $this->endTime = microtime(true);
    }

    // Retourne le temps d'exécution en secondes
    public function getExecutionTime(): float
    {
        if (!isset($this->startTime) || !isset($this->endTime)) {
            throw new RuntimeException("start() et stop() doivent être appelés avant getExecutionTime().");
        }

        return round($this->endTime - $this->startTime, 4); // Temps en secondes, arrondi à 4 décimales
    }

    // Retourne le temps d'exécution formaté
    public function returnExecutionTime(string $label = "Temps d'exécution"): string
    {
        $return =  $label . " : " . $this->getExecutionTime() . " secondes<br>";
        return $return;
    }


    public function follow_script( string $string = '', $level = '' ) 
    {
		if ( DEBUG_SCRIPT ) 
		{
			if( $level == 1 )
			{
				$return = '<div>> '.$string.'</div>';
			}
			elseif( $level == 2 )
			{
				$return = '<div>> '.$string.'</div>';
			}
			elseif( $level == 'var' )
			{
				$return = "<div>> <span style='color:#007bff'>".$string."</span></div>";
			}
			else
			{
				$return = '<div>> '.$string.'</div>';
			}

			echo $return;
		}
    }



}
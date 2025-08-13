<?php

class home_view {

function start() {
global $site;
return <<<HTML
    <div>Start Home</div>

HTML;
}

function end() {
global $site;
return <<<HTML
    <div>End Home</div>

HTML;
}


function row(string $txt) {
global $site;
return <<<HTML
    <h2>$txt</h2>

HTML;
}

function row_article(array $data) {
global $site;
return <<<HTML
    <h2>{$data['a_title']}</h2>
    {$data['a_content']}
    <div><i>Publié {$data['date_fr']}</i></div>

HTML;
}





}

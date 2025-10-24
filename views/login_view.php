<?php

class login_view {

function start() {
global $site;
return <<<HTML
    <div>Start Login</div>

HTML;
}

function end() {
global $site;
return <<<HTML
    <div>End Login</div>

HTML;
}


function login_form(string $txt) {
global $site;
return <<<HTML
    <h2>$txt</h2>

HTML;
}


}

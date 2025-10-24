<?php

class gardecorps_view {

function start() {
global $site;
return <<<HTML
<div class="cfg-wrapper">

HTML;
}

function end() {
global $site;
return <<<HTML
</div>
<div id="app" style="display:none"></div>

HTML;
}


function main_content() {
global $site;
return <<<HTML
    <div id="bar">
        <div class="bar" id="links"></div>
    </div>
    <div class="cfg-container">
        <div id="cfg-preview"></div>
        <div class="cfg-rightcol">
            <div id="cfg-steps"></div>
            <div id="cfg-fields"></div>
            <div id="cfg-nav"></div>
        </div>
    </div>

HTML;
}


function css() {
global $site;
return <<<HTML
    <link rel="stylesheet" href="{$site->const['PUBLIC_PATH']}assets/css/gardecorps.css">

HTML;
}

function script() {
global $site;
return <<<HTML
<script src="{$site->const['PUBLIC_PATH']}assets/js/gardecorps/app.js" type="module"></script>
<script src="{$site->const['PUBLIC_PATH']}assets/js/gardecorps/bootstrap.js" type="module"></script>

HTML;
}





}

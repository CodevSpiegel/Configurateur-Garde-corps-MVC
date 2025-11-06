<?php
/*
 * ============================================================================
 * app\views\configurateur\index.php
 * ============================================================================
 */

$title='Configurateur';

?>
<link rel="stylesheet" href="<?= BASE_URL ?>assets/css/configurateur.css">
<section>
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
    <div id="app" style="display:none"></div>
</section>
<script src="<?= BASE_URL ?>assets/js/configurateur/app.js" type="module"></script>
<script src="<?= BASE_URL ?>assets/js/configurateur/bootstrap.js" type="module"></script>
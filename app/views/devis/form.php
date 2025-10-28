<?php $title = ($mode==='create'?'Créer':'Modifier') . " un devis"; ?>
<section>
  <h1><?= $title ?></h1>
  <form method="post" class="form">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
    <label>Type
      <input type="text" name="type_id" required value="<?= htmlspecialchars($row['type_id'] ?? '') ?>" placeholder="ex: javascript">
    </label>
    <label>Nom
      <input type="text" name="name" required value="<?= htmlspecialchars($row['name'] ?? '') ?>" placeholder="ex: JavaScript">
    </label>
    <label>Description
      <textarea name="description" rows="3" placeholder="Description courte..."><?= htmlspecialchars($row['description'] ?? '') ?></textarea>
    </label>
    <button type="submit"><?= $mode==='create'?'Créer':'Enregistrer' ?></button>
    <a class="btn" href="<?= BASE_URL ?>admin">Annuler</a>
  </form>
</section>
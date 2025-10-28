<?php $title = ($mode==='create'?'Créer':'Modifier') . " une astuce"; ?>
<section>
    <h1><?= $title ?></h1>
    <form method="post" class="form">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>">
        <label>Catégorie
            <select name="category_id" required>
                <?php foreach ($cats as $c): ?>
                <option value="<?= (int)$c['id'] ?>" <?= isset($row['category_id']) && $row['category_id']==$c['id'] ? 'selected':'' ?>>
                <?= htmlspecialchars($c['name']) ?>
                </option>
                <?php endforeach; ?>
            </select>
        </label>
        <label>Titre
            <input type="text" name="title" required value="<?= htmlspecialchars($row['title'] ?? '') ?>">
        </label>
        <label>Résumé
            <input type="text" name="summary" value="<?= htmlspecialchars($row['summary'] ?? '') ?>">
        </label>
        <label>Contenu
            <textarea name="content" rows="6" required><?= htmlspecialchars($row['content'] ?? '') ?></textarea>
        </label>
        <label>Code (optionnel)
            <textarea name="code" rows="6"><?= htmlspecialchars($row['code'] ?? '') ?></textarea>
        </label>
        <button type="submit"><?= $mode==='create'?'Créer':'Enregistrer' ?></button>
        <a class="btn" href="<?= BASE_URL ?>admin">Annuler</a>
    </form>
</section>
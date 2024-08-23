<?php

use Cake\Core\Configure;

?>
<?php if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) : ?>
    <?php if ($data->$masterCategory) : ?>
        <li><span class="category <?= h($data->$masterCategory->class) ?>"><?= h($data->$masterCategory->title) ?></span></li>
    <?php endif; ?>
<?php elseif (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) : ?>
    <?php if ($data->$masterCategory) : ?>
        <?php foreach ($data->$masterCategory as $category) : ?>
            <li><span class="category <?= h($category->class) ?>"><?= h($category->title) ?></span></li>
        <?php endforeach; ?>
    <?php endif; ?>
<?php endif; ?>
<?php

use Cake\Core\Configure;

?>
<?php if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) : ?>
    <?php if ($data->master_topic_category) : ?>
        <li><span class="category <?= h($data->master_topic_category->class) ?>"><?= h($data->master_topic_category->title) ?></span></li>
    <?php endif; ?>
<?php elseif (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) : ?>
    <?php if ($data->master_topic_categories) : ?>
        <?php foreach ($data->master_topic_categories as $category) : ?>
            <li><span class="category <?= h($category->class) ?>"><?= h($category->title) ?></span></li>
        <?php endforeach; ?>
    <?php endif; ?>
<?php endif; ?>
<?php

use Cake\Routing\Router;
use Cake\Core\Configure;

$url = $data->url ? $data->url : Router::url(['controller' => 'Topics', 'action' => 'detail', $data->slug ? $data->slug :  $data->id, 'plugin' => null, 'prefix' => false]);
?>

<li>
    <a href="<?= $url ?>" <?php if ($data->url && $data->url_is_blank) : ?>target="_blank" <?php endif; ?>>
        <div class="ph-part">
            <?php
            if (!empty($data->file_id)) {
                $opt = $data->file_alt ? ["alt" => h($data->file_alt)] : [];
                echo $this->Html->image($data->file->filePath, $opt);
            } else {
                echo $this->Utility->noImage();
            }
            ?>
        </div>
        <div class="txt-part">
            <p class="date"><?= h($data->published->format('Y年m月d日')) ?></p>
            <ul class="list-icon">
                <li><?= $this->element('Site/new_icon', ['published' => $data->published]) ?></li>
                <?php if ($data->master_topic_category || $data->master_topic_categories) : ?>
                    <?= $this->element("Topics/category_area", ['data' => $data]) ?>
                <?php endif; ?>
            </ul>
            <?php if (isset($isTop) && $isTop) : ?>
                <h3 class="ttl"><?= h($data->title) ?></h3>
            <?php else: ?>
                <h2 class="ttl"><?= h($data->title) ?></h2>
            <?php endif; ?>
            <?php if (Configure::read('CustomSettings.Topics.summary') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                <p class="txt"><?= mb_strimwidth ( $data->summary, 0, 84, "...", "utf-8" ) ?></p>
            <?php endif; ?>
        </div>
    </a>
</li>
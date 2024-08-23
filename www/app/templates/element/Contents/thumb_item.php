<?php

use Cake\Routing\Router;
use Cake\Core\Configure;

$url = $data->url ? $data->url : Router::url(['controller' => $Model, 'action' => 'detail', $data->slug ? $data->slug :  $data->id, 'plugin' => null, 'prefix' => false]);
?>

<li>
    <a href="<?= $url ?>" <?php if ($data->url && $data->url_is_blank) : ?>target="_blank" <?php endif; ?>>
        <div class="ph-part">
            <?php
            if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && !empty($data->file_id)) {
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
                <?php if ($data->$masterCategory || $data->$masterCategory) : ?>
                    <?= $this->element("Contents/category_area", ['data' => $data, 'masterCategory' => $masterCategory]) ?>
                <?php endif; ?>
            </ul>
            <h3 class="ttl"><?= h($data->title) ?></h3>
            <p class="txt"><?= mb_strimwidth ( $data->summary, 0, 84, "...", "utf-8" ) ?></p>
        </div>
    </a>
</li>
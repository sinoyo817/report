<?php

use Cake\Routing\Router;
use Cake\Core\Configure;

$url = $data->url ? $data->url : Router::url(['controller' => $Model, 'action' => 'detail', $data->slug ? $data->slug :  $data->id, 'plugin' => null, 'prefix' => false]);
?>

<li>
    <a href="<?= $url ?>" <?php if ($data->url && $data->url_is_blank) : ?>target="_blank" <?php endif; ?>>
        <div class="date-part">
            <p class="date-post">
                <?= h($data->published->format('Y年m月d日')) ?>
                <?= $this->element('Site/new_icon', ['published' => $data->published]) ?>
            </p>

            <?php if ($data->$masterCategory) : ?>
                <ul class="list-icon">
                    <?= $this->element("Contents/category_area", ['data' => $data, 'masterCategory' => $masterCategory]) ?>
                </ul>
            <?php endif; ?>

        </div>
        <p class="ttl"><?= h($data->title) ?></p>
        <p class="txt"><?= mb_strimwidth ( $data->summary, 0, 84, "...", "utf-8" ) ?></p>
    </a>
</li>
<?php

use Cake\Core\Configure;
use Cake\Routing\Router;

/** @var \App\Model\Entity\Spot $data */

$url = Router::url(['controller' => 'Events', 'action' => 'detail', $data->id, 'plugin' => null, 'prefix' => false]);

$image = $data->file ? $this->Html->image($data->file->filePath, ['alt' => h($data->file_alt)]) : $this->Utility->noImage();

?>

<a href="<?= $url ?>">

    <div class="ph-part">
        <?= $image ?>
    </div>
    <div class="txt-part">
        <p class="date"><?= h($data->published->format('Y年m月d日')) ?></p>
        <h4 class="ttl"><?= h($data->title) ?></h4>

        <?php if ($data->event_date_type === Configure::read('Master.Events.TypeKey.rangeKey')) : ?>
            <p class="calendar">
                <?php
                if ($data->event_start_date && $data->event_end_date) {
                    $startDate = $data->event_start_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_start_date->format('w')) . ")";
                    $endDate = $data->event_end_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_end_date->format('w')) . ")";
                    echo $startDate . '～' . $endDate;
                } elseif ($data->event_start_date) {
                    $startDate = $data->event_start_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_start_date->format('w')) . ")";
                    echo $startDate . '～';
                } elseif ($date->event_end_date) {
                    $endDate = $data->event_end_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_end_date->format('w')) . ")";
                    echo '～' . $endDate;
                }

                ?>
            </p>
        <?php elseif ($data->event_date_type === Configure::read('Master.Events.TypeKey.stepKey')) : ?>
            <?php if ($data->event_dates) : ?>
                <?php foreach ($data->event_dates as $eventDate) : ?>
                    <p class="calendar">
                        <?php
                        $date = $eventDate->date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($eventDate->date->format('w')) . ")";
                        echo $date;
                        ?>
                    </p>
                <?php endforeach; ?>
            <?php endif; ?>
        <?php elseif ($data->event_date_type === Configure::read('Master.Events.TypeKey.textKey')) : ?>
            <p class="calendar">
                <?= nl2br(h($data->event_date_text)) ?>
            </p>
        <?php endif; ?>

        <?php if ($data->master_areas || $data->master_area || $data->master_event_categories || $data->master_event_category) : ?>
            <ul class="list-icon">

                <?php if ($data->master_areas) : ?>
                    <?php foreach ($data->master_areas as $area) : ?>
                        <li>
                            <span class="<?= h($area->class ? $area->class : "category") ?>">
                                <?= h($area->title) ?>
                            </span>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
                <?php if ($data->master_area) : ?>
                    <li>
                        <span class="<?= h($data->master_area->class ? $data->master_area->class : "category") ?>">
                            <?= h($data->master_area->title) ?>
                        </span>
                    </li>
                <?php endif; ?>
                <?php if ($data->master_event_categories) : ?>
                    <?php foreach ($data->master_event_categories as $category) : ?>
                        <li>
                            <span class="<?= h($category->class ? $category->class : "category") ?>">
                                <?= h($category->title) ?>
                            </span>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
                <?php if ($data->master_event_category) : ?>
                    <li>
                        <span class="<?= h($data->master_event_category->class ? $data->master_event_category->class : "category") ?>">
                            <?= h($data->master_event_category->title) ?>
                        </span>
                    </li>
                <?php endif; ?>

            </ul>
        <?php endif; ?>
    </div>
</a>
<div class="fav-part">
    <button type="button" aria-pressed="true" class="icon-fav">お気に入りに登録する</button>
    <button type="button" aria-pressed="false" class="icon-fav active">お気に入りから除外する</button>
</div>

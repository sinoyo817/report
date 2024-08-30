<?php

/**
 * @var \App\View\AppView $this
 */

use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Chronos\Chronos;
?>

お疲れ様です。
<?= $data->create_admin->title ?>です。
本日の日報をお送りします。


◆ 業務日報
============================================================
日付         <?= $data->work_date->format('Y/m/d') . PHP_EOL ?>
勤務時間帯   <?= $data->start_time ?> ～ <?= $data->end_time . PHP_EOL ?>


◆ 作業
============================================================
<?php
// $blocks = Hash::extract($data->blocks, '{n}.value01');
$blocks = [];
foreach ($data->blocks as $block) {
    if (array_key_exists($block->value01, $ProductCodes)) {
        $blocks[] = "・ {$ProductCodes[$block->value01]}";
    }
}
?>
<?= implode(PHP_EOL, $blocks) ?>


<?= $data->create_admin->signature ?>

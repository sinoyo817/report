<?php

/**
 * @var \App\View\AppView $this
 */

use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Chronos\Chronos;
?>

<?= $admin->title ?>さんより、日報管理システムの改修依頼が来ています。


◆ 対応依頼内容
============================================================
[タイトル]
<?= $data->title . PHP_EOL ?>
[詳細]
<?= $data->summary . PHP_EOL ?>

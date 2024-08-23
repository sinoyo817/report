<?php

/**
 * @var \App\View\AppView $this
 */

use Cake\Core\Configure;
use Cake\Log\Log;

?>

<?= $admin->title ?>様

管理画面で確認
<?= Configure::read('Site.Settings.baseAdminUrl') . 'dead-links/' . PHP_EOL ?>

リンク切れ一覧
----------------------
<?php
foreach ($data as $item) {
    echo "ページタイトル:" . PHP_EOL . $item->title . PHP_EOL;
    echo "ページURL:" . PHP_EOL . $item->url . PHP_EOL;
    echo "URL一覧:" . PHP_EOL . str_replace(',', PHP_EOL, $item->target_url) . PHP_EOL;
    echo "--------------------------------------------" . PHP_EOL;
}

?>

<?php

/**
 * @var \App\View\AppView $this
 */

use Cake\Chronos\Chronos;

$now = new Chronos();

?>

<?= $admin->title ?>様

以下のコンテンツで「<?= $approvalTitle ?>」がありました。
申請者ID : <?= $user->cid . PHP_EOL ?>
申請者: <?= $user->title . PHP_EOL ?>
申請日: <?= $now->format('Y年m月d日') . PHP_EOL ?>
コンテンツ: <?= $content . PHP_EOL ?>
プレビュー: <?= $url['preview'] . PHP_EOL ?>
編集画面: <?= $url['crud'] . PHP_EOL ?>

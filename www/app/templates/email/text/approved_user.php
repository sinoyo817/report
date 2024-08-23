<?php

/**
 * @var \App\View\AppView $this
 */

use Cake\Chronos\Chronos;

$now = new Chronos();

?>

<?= $user->title ?>様

以下のコンテンツで「<?= $approvalTitle ?>」が行われました。
申請者: <?= $user->title . PHP_EOL ?>
申請日: <?= $now->format('Y年m月d日') . PHP_EOL ?>
コンテンツ: <?= $content . PHP_EOL ?>
プレビュー: <?= $url['preview'] . PHP_EOL ?>
編集画面: <?= $url['crud'] . PHP_EOL ?>
<?php
if (isset($summary) && $summary) {
    echo "差戻し理由: " . PHP_EOL . $summary . PHP_EOL;
} ?>

※上記内容について、ご不明な点等がある場合、メールの内容が自
　身のお手続き内容と異なる、またはお手続きに覚えのない場合は、
　大変恐れ入りますが、下記のお問合せ先にご連絡いただきます
ようお願いいたします。
※このメールは送信用アドレスとなっているため返信しても管理者
　へは送信されませんのでご了承ください。

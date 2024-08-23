<?php

/**
 * @var \App\View\AppView $this
 */

 use Cake\Core\Configure;
 use Cake\Log\Log;
 use Cake\Utility\Hash;
 
if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
    $categories = Hash::extract($data->master_contact_categories, '{n}.title');
}
?>

<?= __("{0} 様", Configure::read('CustomSettings.General.toName')) . PHP_EOL ?>

以下の内容でお問合せがありました。
内容をご確認のうえ、ご対応ください。

■お問い合わせ内容
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
<?php if (Configure::read('CustomSettings.Contacts.title') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
お名前    <?= $data->title . PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.email') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
メールアドレス  <?= $data->email . PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
郵便番号  <?= $data->zip_code . PHP_EOL ?>
住所    <?= $MasterPrefectures[$data->prefecture_id] . $data->address_city . $data->address_local. PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.tel') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
電話番号    <?= $data->tel . PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.gender') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
性別  <?= Configure::read("Master.Genders.{$data->gender}") . PHP_EOL ?><?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.birthday') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
生年月日  <?= $data->birthday . PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
興味のあるジャンル  <?= implode(', ', $categories) . PHP_EOL ?>
<?php endif; ?>
<?php if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
お問い合わせ内容
<?= $data->summary . PHP_EOL ?>
<?php endif; ?>
－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－


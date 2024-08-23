<?php

use Cake\Datasource\EntityInterface;
use Cake\Core\Configure;
use Cake\Utility\Hash;

$this->Breadcrumbs->add(Configure::read("Site.Meta.Page.subject"), null, [
    'aria-current' => "page"
]);

$js = <<<JS
$(function(){
    $('.submit').click(function() {
        $(this).parents('form').attr('action', $(this).data('action'));
        $(this).parents('form').submit();
    });
});
JS;
$this->Html->scriptBlock($js, ['block' => 'scriptBody']);
$this->Utility->getRecaptchaSrc();
?>

<?php $this->start('pageTitle') ?>
<!-- page-ttl -->
<div class="page-ttl">
    <h1 class="page-ttl">CONTACT<span><?= Configure::read("Site.Meta.Page.subject") ?></span></h1>
</div>
<!-- page-ttl -->
<?php $this->end(); ?>

<!-- main -->
<div class="main">

    <!-- inner -->
    <div class="inner-s">

        <!-- flow-area -->
        <div class="flow-area">
            <!-- step-bar -->
            <div class="step-bar">
                <ul>
                    <li class="visited"><span>1</span><br>お問い合わせ情報の入力</li>
                    <li class="visited"><span>2</span><br>お問い合わせ内容の確認</li>
                    <li><span>3</span><br>お問い合わせ完了</li>
                </ul>
            </div>
            <!-- step-bar -->
        </div>
        <!-- flow-area -->
        <!-- sentence-block -->
        <div class="sentence-block">
            <p>以下の内容で送信します。よくご確認の上、よろしければ、「送信」ボタンをクリックしてください。</p>
        </div>
        <!-- sentence-block -->
        <!-- form-area -->
        <div class="form-area confirm">

            <?= $this->Form->create($data, ['type' => 'post', 'url' => ['action' => 'complete'], 'novalidate' => true]) ?>

            <div class="table-form">
                <?php if (Configure::read('CustomSettings.Contacts.title') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>お名前（ご担当者名）<strong class="txt-required">必須</strong></dt>
                        <dd><?= h($data->title) ?></dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.email') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>メールアドレス<strong class="txt-required">必須</strong></dt>
                        <dd><?= h($data->email) ?></dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>住所<strong class="txt-required">必須</strong></dt>
                        <dd>
                            <dl>
                                <dt>郵便番号<strong class="txt-required">必須</strong></dt>
                                <dd><?= h($data->zip_code) ?></dd>
                                <dt>都道府県<strong class="txt-required">必須</strong></dt>
                                <dd><?= $MasterPrefectures[$data->prefecture_id] ?></dd>
                                <dt>市区町村<strong class="txt-required">必須</strong></dt>
                                <dd><?= h($data->address_city) ?></dd>
                                <dt>以降の住所<strong class="txt-required">必須</strong></dt>
                                <dd><?= h($data->address_local) ?></dd>
                            </dl>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.tel') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>電話番号<strong class="txt-required">必須</strong></dt>
                        <dd><?= h($data->tel) ?></dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.gender') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>性別<strong class="txt-required">必須</strong></dt>
                        <dd><?= $Genders[$data->gender] ?></dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.birthday') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>生年月日<strong class="txt-required">必須</strong></dt>
                        <dd><?= h($data->birthday) ?></dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>興味のあるジャンル<strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?php
                            $categories = Hash::combine($data->master_contact_categories, '{n}.id', ['<span>%s</span>', '{n}.title']);
                            echo implode('', $categories);
                            ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>添付</dt>
                        <dd>
                            <div class="file-upload">
                                <div class="file-upload-thumbnail" thumb-width="200">
                                    <?php if (isset($data->file_id) && $data->file_id) : ?>
                                        <?php
                                        $isEdit = true;
                                        $image = $this->cell('ContactImage::image', [$data->file_id, $isEdit, ['width' => 200,]]);
                                        if ($image) {
                                            echo $image;
                                        }
                                        ?>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.summary') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl>
                        <dt>お問い合わせ内容</dt>
                        <dd><?= nl2br(h($data->summary)) ?></dd>
                    </dl>
                <?php endif; ?>
            </div>

            <!-- btn-block -->
            <div class="btn-block center to-back">
                <!-- btn-base -->
                <?= $this->Form->button(__("戻る"), ["type" => "button", "data-action" => "/contacts/index", "name" => "action", "value" => "back", "class" => "btn-base edit submit"]); ?>
                <!-- btn-base -->
                <!-- btn-base -->
                <?= $this->Form->button(__("送信"), ["type" => "button", "data-action" => "/contacts/complete", "name" => "action", "value" => "complete", "class" => "btn-base arrow submit"]); ?>
                <!-- btn-base -->
            </div>
            <!-- btn-block -->
            <?= $this->Form->end(); ?>

        </div>
        <!-- form-area -->

    </div>
    <!-- inner -->

</div>
<!-- main -->

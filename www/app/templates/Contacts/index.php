<?php

use Cake\Datasource\EntityInterface;
use Cake\Core\Configure;

$this->Breadcrumbs->add(Configure::read("Site.Meta.Page.subject"), null, [
    'aria-current' => "page"
]);

$this->Utility->getRecaptchaSrc();
$this->Form->setTemplates([
    'error' => '<p class="txt-error">※{{content}}</p>',
    'inputContainer' => '{{content}}',
    'inputContainerError' => '{{content}}',
    'nestingLabel' => '{{hidden}}{{input}}<label{{attrs}}>{{text}}</label>',
    'formGroup' => '{{input}}{{label}}',
    'radioWrapper' => '<span>{{label}}</span>',
    'checkboxWrapper' => '<span>{{label}}</span>',
]);

$this->Html->script('https://yubinbango.github.io/yubinbango/yubinbango.js', ['block' => true]);

$js = <<<JS
$(function(){
    // 郵便番号変更時に県のセレクト
    $('.p-postal-code').on('change', function () {
        setPref ()
    });

    // yubinbango.jsからの戻りを待つためsetTimeout
    function setPref (){
        setTimeout(function(){
            var pref = $('.p-region').val();
            var value = $("select[name='prefecture_id'] option").filter(function(index){
                return $(this).text() === pref
            }).val();

            if (value) {
                $("select[name='prefecture_id'] option[value='"+value+"']").prop('selected', true);
            }
        },1000);
    }
});
JS;
$this->Html->scriptBlock($js, ['block' => 'scriptBody']);
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
                    <li class="visited"><span>1</span><br>お問い合わせ<br class="sp-block">情報の入力</li>
                    <li><span>2</span><br>お問い合わせ<br class="sp-block">内容の確認</li>
                    <li><span>3</span><br>お問い合わせ<br class="sp-block">完了</li>
                </ul>
            </div>
            <!-- step-bar -->

        </div>
        <!-- flow-area -->

        <?php if ($data->getErrors()) : ?>
            <?php
            $headerError = [
                'title',
                'email',
                'zip_code',
                'prefecture_id',
                'address_city',
                'address_local',
                'tel',
                'gender',
                'birthday',
                'master_contact_categories',
                'summary',
                'is_agree',
            ];
            ?>

            <!-- error-area -->
            <div class="error-area">
                <p class="ttl">未記入の項目があるか、書式が適切でない項目があります。</p>
                <?php foreach ($headerError as $key) : ?>
                    <?php if ($error = $data->getError($key)) : ?>
                        <?php
                        if (is_array($error)) $error = array_pop($error);
                        ?>
                        <?php if (in_array($key, ['zip_code', 'prefecture_id', 'address_city', 'address_local'])) : ?>
                            <p><a href="#link-address"><?= h($error) ?></a></p>
                        <?php else : ?>
                            <p><a href="#link-<?= h($key) ?>"><?= h($error) ?></a></p>
                        <?php endif; ?>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            <!-- error-area -->
        <?php endif; ?>

        <!-- form-area -->
        <div class="form-area">
            <?= $this->Form->create($data, ['type' => 'post', 'url' => ['action' => 'confirm'], 'novalidate' => true, 'id' => 'contactForm', 'class' => 'h-adr']) ?>
            <span class="p-country-name" style="display:none;">Japan</span>
            <div class="table-form">

                <?php if (Configure::read('CustomSettings.Contacts.title') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-title">
                        <dt><?= $this->Form->label('title', 'お名前（ご担当者名）') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('title') ?>
                            <p class="txt-ex">例）QT 太郎</p>
                            <?= $this->Form->control('title', ['type' => 'text', 'label' => false, 'error' => false]) ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.email') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-email">
                        <dt><?= $this->Form->label('email', 'メールアドレス') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('email') ?>
                            <p class="txt-ex">例）example@example.com</p>
                            <?= $this->Form->control('email', ['type' => 'text', 'label' => false, 'error' => false]) ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <div id="link-address">
                        <fieldset>
                            <legend>住所<strong class="txt-required">必須</strong></legend>
                            <div class="right-fl">
                                <div>
                                    <label for="zip_code">郵便番号<strong class="txt-required">必須</strong></label>
                                    <?= $this->Form->error('zip_code') ?>
                                    <p class="txt-ex">※半角数字のみ・ハイフンなしで入力してください<br>例）8100001</p>
                                    <?= $this->Form->control('zip_code', ['type' => 'text', "class" => "text-s p-postal-code", "label" => false, "required" => false]); ?>
                                </div>
                                <div>
                                    <label for="prefecture_id">都道府県<strong class="txt-required">必須</strong></label>
                                    <?= $this->Form->error('prefecture_id') ?>
                                    <p class="txt-ex">例）福岡県</p>
                                    <?= $this->Form->control("prefecture_id", ["type" => "select", 'options' => $MasterPrefectures, "label" => false, 'empty' => '未選択', "class" => "text-s sp-text-l", "error" => false]) ?>
                                    <?= $this->Form->control('pref', ['type' => 'text', "class" => "p-region", "label" => false, "style" => 'display:none']); ?>
                                </div>
                                <div>
                                    <label for="address_city">市区町村<strong class="txt-required">必須</strong></label>
                                    <?= $this->Form->error('address_city') ?>
                                    <p class="txt-ex">例）福岡市中央区天神</p>
                                    <?= $this->Form->control('address_city', ['type' => 'text', "class" => "p-locality p-street-address p-extended-address", "label" => false, "required" => false]); ?>
                                </div>
                                <div>
                                    <label for="address_local">以降の住所<strong class="txt-required">必須</strong></label>
                                    <?= $this->Form->error('address_local') ?>
                                    <p class="txt-ex">例）1丁目4-2 エルガーラオフィス棟5階</p>
                                    <?= $this->Form->control('address_local', ['type' => 'text', "label" => false, "required" => false]); ?>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.tel') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-tel">
                        <dt><?= $this->Form->label('tel', 'お電話番号') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('tel') ?>
                            <p class="txt-ex">※半角数字のみ・ハイフンなしで入力してください<br>例）0927262805</p>
                            <?= $this->Form->control('tel', ['type' => 'text', 'class' => 'text-s sp-text-l', 'label' => false, 'error' => false]) ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.gender') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-gender">
                        <dt><?= $this->Form->label('gender', '性別') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('gender') ?>
                            <fieldset>
                                <legend>性別を選択してください</legend>
                                <?= $this->Form->radio("gender", $Genders, ["required" => false]) ?>
                            </fieldset>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.birthday') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-birthday">
                        <dt><?= $this->Form->label('birthday', '生年月日') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('birthday') ?>
                            <?= $this->Form->control('birthday', ['type' => 'text', 'class' => 'text-m', 'label' => false]) ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-master_contact_categories">
                        <dt><label for="genre01">興味のあるジャンル</label><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('master_contact_categories') ?>
                            <fieldset>
                                <legend>興味のあるジャンルを選択してください</legend>
                                <?= $this->Form->control('master_contact_categories._ids', ['type' => 'multiCheckbox', 'options' => $MasterContactCategories, 'empty' => false, "label" => false, 'required' => false]); ?>
                            </fieldset>
                        </dd>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')): ?>
                    <dl id="link-file_id">
                        <dt><?= $this->Form->label("file_id", '添付') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('file_id') ?>
                            <p class="txt-upload">アップロード上限5MB</p>
                            <div class="file-upload">
                                <?= $this->Form->file("file", ['class' => 'file-upload-input']) ?>
                                <?= $this->Form->hidden("file_id", ['class' => 'file-upload-hidden']) ?>
                                <br>
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
                                <?= $this->Form->button('画像削除', ['type' => 'button', 'class' => 'file-upload-delete']) ?>
                            </div>
                        </dd>
                        <?php $this->Utility->fileUpload(); ?>
                    </dl>
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Contacts.summary') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) : ?>
                    <dl id="link-summary">
                        <dt><?= $this->Form->label('summary', 'お問い合わせ内容') ?><strong class="txt-required">必須</strong></dt>
                        <dd>
                            <?= $this->Form->error('summary') ?>
                            <?= $this->Form->control('summary', ['type' => 'textarea', 'label' => false, 'error' => false], ['rows' => 4]) ?>
                        </dd>
                    </dl>
                <?php endif; ?>

                <dl id="link-is_agree">
                    <dt>個人情報取扱規程<strong class="txt-required">必須</strong></dt>
                    <dd>
                        <div class="agree-part">
                            <?= $this->Form->error('is_agree') ?>
                            <p><a href="">利用規約</a>と<a href="">個人情報保護方針</a>をご確認いただき、同意いただいた場合はチェックボックスにチェックを入れてください。</p>
                            <div class="check-agree">
                                <fieldset>
                                    <legend>利用規約と個人情報保護方針に同意してください</legend>
                                    <?= $this->Form->checkbox('is_agree', ['value' => '1', 'label' => false,]) ?>
                                    <?= $this->Form->label("is_agree", 'プライバシーポリシーに同意します') ?>
                                </fieldset>
                            </div>
                        </div>
                    </dd>
                </dl>
            </div>

            <!-- btn-block -->
            <div class="btn-block center">

                <!-- btn-base -->
                <?= $this->Form->button('入力を確認', ["type" => "submit", "name" => "action", "value" => "confirm", "class" => "btn-base arrow"]); ?>
                <!-- btn-base -->

            </div>
            <!-- btn-block -->

            <?php /*
                <p>↓クラス名「grayout」を追加することでボタンをグレーアウトに出来ます。<br>
                    CSSでクリック・タッチを無効化しています。</p>

                <!-- btn-block -->
                <div class="btn-block center">
                    <!-- btn-base -->
                    <button class="btn-base arrow grayout" type="submit">入力を確認</button>
                    <!-- btn-base -->
                </div>
                <!-- btn-block -->
                */ ?>

            <?= $this->Form->end() ?>

        </div>
        <!-- form-area -->

    </div>
    <!-- inner -->

</div>
<!-- main -->

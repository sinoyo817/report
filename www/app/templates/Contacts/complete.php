<?php

use Cake\Datasource\EntityInterface;
use Cake\Core\Configure;

$this->Breadcrumbs->add(Configure::read("Site.Meta.Page.subject"), null, [
    'aria-current' => "page"
]);
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
                    <li class="visited"><span>3</span><br>お問い合わせ完了</li>
                </ul>
            </div>
            <!-- step-bar -->
        </div>
        <!-- flow-area -->
        <!-- form-area -->
        <div class="form-area">
            <!-- complete-part -->
            <div class="complete-part">
                <div class="ttl-large">
                    <h2>お問い合わせありがとうございます。</h2>
                </div>
                <p>ご入力いただいたメールアドレスに、自動返信メールをご送付しております。<br>
                    万が一、自動返信メールが届かない場合は、以下をご確認ください。</p>

            </div>
            <!-- complete-part -->
            <!-- complete-note -->
            <div class="complete-note">
                <!-- list-square -->
                <ul class="list-square">
                    <li>ご入力いただいたメールアドレスに間違いがあった可能性がございます。もう一度フォームよりお問い合わせ頂きますようお願いいたします。</li>
                    <li>お使いのメールサービス、メールソフト、ウィルス対策ソフト等の設定により「迷惑メール」と認識され、メールが届かないことがございます。この場合は「迷惑メールフォルダー」などをご確認いただくか、お使いのサービス、ソフトウェアの設定をご確認ください。</li>
                    <li>メールドメイン指定受信の設定をされている方はメールを受信できない可能性がございます。「<?= Configure::read('CustomSettings.General.fromMail') ?>」から届くメールを、ドメイン指定で受信許可としていただきますようお願い致します。メールドメイン指定受信許可の設定変更方法は、お使いの携帯電話のキャリアやご加入のプロバイダの設定方法に従ってください。</li>
                </ul>
                <!-- list-square -->
            </div>
            <!-- complete-note -->
            <!-- btn-block -->
            <div class="btn-block center">
                <!-- btn-base -->
                <p>
                    <a class="btn-base arrow" href="/">トップページへ</a>
                </p>
                <!-- btn-base -->
            </div>
            <!-- btn-block -->
        </div>
        <!-- form-area -->

    </div>
    <!-- inner -->

</div>
<!-- main -->

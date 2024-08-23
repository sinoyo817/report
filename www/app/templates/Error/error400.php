<?php

/**
 * @var \App\View\AppView $this
 */


$this->Breadcrumbs->add('404 Not Found');

?>


<?php $this->start('pageTitle') ?>
<!-- page-ttl -->
<h1 class="ttl">404 NOT FOUND</h1>
<!-- page-ttl -->
<?php $this->end(); ?>

<!-- inner -->
<div class="inner">

    <!-- static-wrap -->
    <div class="static-wrap">
        <p class="static-txt">指定されたURLが存在しません。<br>申し訳ありませんが、トップページより再度アクセスをお願いします。</p>
        <!-- btn-block -->
        <div class="btn-block center">
            <p>
                <a class="btn-base back" href="/">トップへ戻る</a>
            </p>
        </div>
        <!-- btn-block -->
    </div>
    <!-- static-wrap -->

</div>
<!-- inner -->
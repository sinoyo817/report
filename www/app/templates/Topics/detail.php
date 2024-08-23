<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic $data
 */

use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Routing\Router;

if ($data->metadata && !isset($isConfirm)) {
    if ($data->metadata->file) {
        Configure::write("Site.Meta.Page.image", $data->metadata->file->filePath);
    }
    if ($data->metadata->description) {
        Configure::write("Site.Meta.Page.description", $data->metadata->description);
    }
    if ($data->metadata->keywords) {
        Configure::write("Site.Meta.Page.keywords", $data->metadata->keywords);
    }
}

Configure::write("Site.Meta.Page.title", $data->title);
Configure::write("Site.Meta.Page.url", Router::url(["controller" => "topics", "action" => "detail", "prefix" => false, $data->slug ? $data->slug :  $data->id], true));

$this->Breadcrumbs->add('お知らせ', ['action' => 'index']);
$this->Breadcrumbs->add(h($data->title), null, [
    'aria-current' => "page"
]);

?>

<?php $this->start('pageTitle') ?>
<!-- page-ttl -->
<div class="page-ttl">
    <h1 class="ttl">NEWS<span>お知らせ</span></h1>
</div>
<!-- page-ttl -->
<?php $this->end(); ?>

<!-- main -->
<div class="main">

    <!-- inner -->
    <div class="inner-s">

        <!-- post-content -->
        <article class="post-content">

            <!-- post-date-block -->
            <div class="post-date-block">
                <?= $this->element("Site/new_icon", ["published" => $data->published]) ?>
                <!-- post-date -->
                <p class="post-date"><?= $data->published->format('Y年m月d日') ?></p>
                <!-- post-date -->
            </div>
            <!-- post-date-block -->

            <!-- icon-post-block -->
            <div class="icon-post-block">
                <ul class="list-icon">
                    <?= $this->element("Topics/category_area", ['data' => $data]) ?>
                </ul>
            </div>
            <!-- icon-post-block -->

            <!-- post-ttl -->
            <h1 class="post-ttl"><?= h($data->title) ?></h1>

            <?= $this->Block->getHtmls($data->blocks); ?>

        </article>
        <!-- post-content -->

        <!-- btn-postback -->
        <p class="btn-postback">
            <?= $this->Html->link(__("お知らせ一覧へ戻る"), ['action' => 'index'], ['class' => 'btn-base back']) ?>
        </p>
        <!-- btn-postback -->

    </div>
    <!-- inner -->

</div>
<!-- main -->

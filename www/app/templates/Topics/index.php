<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic[]|\Cake\Collection\CollectionInterface $datas
 */

use Cake\Core\Configure;
use Cake\Routing\Router;

$this->Breadcrumbs->add('お知らせ', null, [
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


<!-- 全ての記事のタブ -->
<!-- main -->
<div class="main">

    <!-- inner -->
    <div class="inner">

        <?php if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) : ?>
            <?php if ($MasterTopicCategories && !$MasterTopicCategories->isEmpty()) : ?>
                <!-- tab-article -->
                <ul class="tab-article sp-tab-btn col2">
                    <?php

                    $queryKey = 'master_topic_category_id';
                    if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
                        $queryKey = 'master_topic_categories';
                    }
                    // CMS側が単一選択

                    $active = empty($this->request->getQuery($queryKey)) ? 'active' : '';
                    ?>
                    <li><?= $this->Html->link('すべて', ['controller' => 'Topics', 'action' => 'index'], ['class' => $active]) ?></li>
                    <?php foreach ($MasterTopicCategories as $category) : ?>
                        <?php
                        $active = ($this->request->getQuery($queryKey) == $category->id) ? 'active' : '';
                        ?>
                        <li><?= $this->Html->link($category->title, ['controller' => 'Topics', 'action' => 'index', '?' => [$queryKey => $category->id]], ['class' => $active]) ?></li>
                    <?php endforeach; ?>
                </ul>
                <!-- tab-article -->
            <?php endif; ?>
        <?php endif; ?>

        <!-- count-disp -->
        <div class="count-disp">
            <!-- paging -->
            <?= $this->element("Site/paging_count") ?>
            <!-- paging -->
        </div>
        <!-- count-disp -->

        <?php if ($datas && !$datas->isEmpty()) : ?>
            <?php
            $ul_class = "list-article";
            $element = "item";
            if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $ul_class = "list-thumb col4 sp-card ratio-4-3";
                $element = "thumb_item";
            }
            ?>

            <!-- list-article -->
            <ul class="<?= $ul_class ?>">
                <?php foreach ($datas as $data) : ?>
                    <?= $this->element("Topics/{$element}", ['data' => $data]) ?>
                <?php endforeach; ?>
            </ul>
            <!-- list-article -->

        <?php endif; ?>

        <!-- count-disp -->
        <div class="count-disp">

            <!-- paging -->
            <?= $this->element("Site/paging") ?>
            <!-- paging -->

        </div>
        <!-- count-disp -->

    </div>
    <!-- inner -->
</div>
<!-- main -->

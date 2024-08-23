<?php
use Cake\Core\Configure;

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic[]|\Cake\Collection\CollectionInterface $data
 */

?>

<?php if ($data && !$data->isEmpty()) : ?>
    <?php
    $ul_class = "list-article";
    $element = "item";
    if ($isThumbnail) {
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $ul_class = "list-thumb col4 sp-card ratio-4-3";
            $element = "thumb_item";
        }
    }
    ?>
    <!-- news-area-top -->
    <section id="news" class="news-area-top">

        <!-- inner -->
        <div class="inner">

            <h2 class="ttl-top">お知らせ</h2>

            <!-- list-article -->
            <ul class="<?= $ul_class ?>">
                <?php foreach ($data as $item) : ?>
                    <?= $this->element("Topics/{$element}", ['data' => $item]) ?>
                <?php endforeach; ?>
            </ul>
            <!-- list-article -->

            <!-- btn-block -->
            <div class="btn-block center">

                <!-- btn-base arrrow-->
                <p>
                    <?= $this->Html->link('お知らせ一覧へ', ['controller' => 'Topics', 'action' => 'index',], ['class' => 'btn-base arrow']) ?>
                </p>
                <!-- btn-base arrow-->

            </div>
            <!-- btn-block -->

        </div>
        <!-- inner -->

    </section>
    <!-- news-area-top -->
<?php endif; ?>
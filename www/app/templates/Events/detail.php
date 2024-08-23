<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic $data
 */

use Cake\Core\Configure;
use Cake\Routing\Router;
use Medii\File\Utility\FileUtility;

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
Configure::write("Site.Meta.Page.url", Router::url(["controller" => "Events", "action" => "detail", "prefix" => false, $data->id], true));


$this->Breadcrumbs->add('イベント', ['action' => 'index']);
$this->Breadcrumbs->add(h($data->title), null, [
    'aria-current' => "page"
]);

$this->Html->css('/events/css/event.css', ['block' => true]);
$this->Html->css('/css/swiper-bundle.min.css', ['block' => true]);
$this->Html->css('https://cdnjs.cloudflare.com/ajax/libs/Modaal/0.4.4/css/modaal.min.css', ['block' => true]);
$this->Html->script('/js/swiper-bundle.min.js', ['block' => 'scriptBody']);
$this->Html->script('https://cdnjs.cloudflare.com/ajax/libs/Modaal/0.4.4/js/modaal.min.js', ['block' => 'scriptBody']);

$js = <<<JS
   //スライダー
   var slideLength = document.querySelectorAll('.gallery-top .swiper-slide').length;

// スライダーが1枚以下の時
if (slideLength <= 1) {
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 16,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints: {
            // 768px以上の場合
            768: {
                slidesPerView: 4,
                direction: 'vertical',
            },
        },
    });
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 0,
        slidesPerView: 1,
        loop: false,
        navigation: {
            nextEl: '.js-swiper-next00',
            prevEl: '.js-swiper-prev00',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
    });
}
// それ以外
else {
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 16,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints: {
            // 768px以上の場合
            768: {
                slidesPerView: 4,
                direction: 'vertical',
            },
        },
    });
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 0,
        slidesPerView: 1,
        loop: true,
        navigation: {
            nextEl: '.js-swiper-next00',
            prevEl: '.js-swiper-prev00',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
    });
}

//画像モーダル
$('.gallery').modaal({
    type: 'image',
});

JS;
$this->Html->scriptBlock($js, ['block' => 'scriptBody']);

// レコメンド、アクセス数
if (empty($this->request->getParam('prefix'))) {
    $this->Analyses->recommend($data->id, $data->getSource());
}

?>

<?php $this->start('pageTitle') ?>
<div class="page-ttl">
    <h1 class="ttl">EVENT<span>イベント</span></h1>
</div>
<?php $this->end(); ?>


<div class="main">

    <!-- spot-main -->
    <section class="spot-main">

        <!-- inner -->
        <div class="inner">

            <!-- spot-ttl-block -->
            <div class="spot-ttl-block">

                <!-- spot-ttl -->
                <div class="spot-ttl">
                    <h2 class="ttl"><?= h($data->title) ?><?php if ($data->title_kana) : ?><span><?= h($data->title_kana) ?></span><?php endif; ?></h2>
                    <?php if ($data->copy) : ?><p class="copy"><?= h($data->copy) ?></p><?php endif; ?>
                </div>
                <!-- spot-ttl -->

            </div>
            <!-- spot-ttl-block -->

            <?php if ($data->file_id || $data->event_images) : ?>
                <?php $images = []; ?>
                <!-- slider-thumb -->
                <div class="slider-block slider-thumb-vertical slider-ratio ratio-4-3">
                    <div class="slider-inner">
                        <div class="swiper gallery-top">
                            <div class="swiper-wrapper">
                                <?php if ($data->file_id) : ?>

                                    <?php
                                    $image = isset($isConfirm) && $isConfirm ? $this->cell('Medii/File.ConfirmFile::image', [$data->file_id, $data->file_alt]) : $this->Html->image($data->file->filePath, ['alt' => h($data->file_alt)]);
                                    preg_match('/src="([^"]+)"/', $image, $path);

                                    $images[] = [
                                        'path' => $path[1] ?? "",
                                        'alt' => $data->file_alt,
                                    ];
                                    ?>
                                    <div class="swiper-slide">
                                        <a href="<?= h($path[1] ?? "") ?>" class="gallery" data-group="gallery">
                                            <?= $image ?>
                                        </a>
                                    </div>
                                <?php endif; ?>
                                <?php if ($data->event_images) : ?>
                                    <?php foreach ($data->event_images as $eventImage) : ?>
                                        <?php
                                        $image = isset($isConfirm) && $isConfirm ? $this->cell('Medii/File.ConfirmFile::image', [$eventImage->file01_id, $eventImage->value01]) : $this->Html->image($eventImage->file01->filePath, ['alt' => h($eventImage->value01)]);
                                        preg_match('/src="([^"]+)"/', $image, $path);

                                        $images[] = [
                                            'path' => $path[1] ?? "",
                                            'alt' => $eventImage->value01,
                                        ]; ?>
                                        <div class="swiper-slide">
                                            <a href="<?= h($path[1] ?? "") ?>" class="gallery" data-group="gallery">
                                                <?= $image ?>
                                            </a>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="swiper-button-next js-swiper-next00"></div>
                        <div class="swiper-button-prev js-swiper-prev00"></div>
                    </div>
                    <div class="swiper gallery-thumbs">
                        <div class="swiper-wrapper">
                            <?php foreach ($images as $image) : ?>
                                <div class="swiper-slide">
                                    <?= $this->Html->image($image['path'], ['alt' => h($image['alt'])]) ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <!-- slider-thumb -->
            <?php endif; ?>

            <?php if ($data->summary) : ?>
                <!-- sentence -->
                <div class="sentence-block">
                    <p><?= nl2br(h($data->summary)) ?></p>
                </div>
                <!-- sentence -->
            <?php endif; ?>

            <!-- share-block -->
            <div class="share-block side-btn">
                <button type="button" aria-pressed="true" class="btn-bookmark">
                    <img src="/img/common/ico_bookmark_off.svg" alt="アイコン：保存">
                    <span>保存</span>
                </button>
                <dl>
                    <dt>シェア</dt>
                    <dd>
                        <?= $this->element('Site/share') ?>
                    </dd>
                </dl>
            </div>
            <!-- share-block -->

            <?php if ($data->pr) : ?>
                <!-- ttl-small -->
                <div class="ttl-small">
                    <h3>お勧めポイント</h3>
                </div>
                <!-- ttl-small -->

                <!-- sentence -->
                <div class="sentence-block">
                    <p><?= nl2br(h($data->pr)) ?></p>
                </div>
                <!-- sentence -->
            <?php endif; ?>

            <!-- ttl-small -->
            <div class="ttl-small">
                <h3>スポット概要</h3>
            </div>
            <!-- ttl-small -->

            <!-- spot-data -->
            <div class="spot-data">

                <dl>
                    <dt>開催日</dt>
                    <dd>

                        <?php if ($data->event_date_type === Configure::read('Master.Events.TypeKey.rangeKey')) : ?>
                            <p class="date">
                                <?php
                                if ($data->event_start_date && $data->event_end_date) {
                                    $startDate = $data->event_start_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_start_date->format('w')) . ")";
                                    $endDate = $data->event_end_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_end_date->format('w')) . ")";
                                    echo $startDate . '～' . $endDate;
                                } elseif ($data->event_start_date) {
                                    $startDate = $data->event_start_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_start_date->format('w')) . ")";
                                    echo $startDate . '～';
                                } elseif ($date->event_end_date) {
                                    $endDate = $data->event_end_date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($data->event_end_date->format('w')) . ")";
                                    echo '～' . $endDate;
                                }

                                ?>
                            </p>
                        <?php elseif ($data->event_date_type === Configure::read('Master.Events.TypeKey.stepKey')) : ?>
                            <?php if ($data->event_dates) : ?>
                                <?php foreach ($data->event_dates as $eventDate) : ?>
                                    <p class="date">
                                        <?php
                                        $date = $eventDate->date->format('Y年m月d日') . "(" . $this->Utility->getDayOfWeek($eventDate->date->format('w')) . ")";
                                        echo $date;
                                        ?>
                                    </p>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        <?php elseif ($data->event_date_type === Configure::read('Master.Events.TypeKey.textKey')) : ?>
                            <p class="date">
                                <?= nl2br(h($data->event_date_text)) ?>
                            </p>
                        <?php endif; ?>
                    </dd>
                </dl>
                <?php if ($data->event_time) : ?>
                    <dl>
                        <dt>開催時間</dt>
                        <dd><?= nl2br(h($data->event_time)) ?></dd>
                    </dl>
                <?php endif; ?>
                <?php if ($data->address) : ?>
                    <dl>
                        <dt>開催地</dt>
                        <dd><?= nl2br(h($data->address)) ?></dd>
                    </dl>
                <?php endif; ?>
                <?php if ($data->price) : ?>
                    <dl>
                        <dt>料金</dt>
                        <dd><?= nl2br(h($data->price)) ?></dd>
                    </dl>
                <?php endif; ?>
                <?php if ($data->parking) : ?>
                    <dl>
                        <dt>駐車場</dt>
                        <dd><?= nl2br(h($data->parking)) ?></dd>
                    </dl>
                <?php endif; ?>
                <?php if ($data->access) : ?>
                    <dl>
                        <dt>交通アクセス</dt>
                        <dd><?= nl2br(h($data->access)) ?></dd>
                    </dl>
                <?php endif; ?>
                <?php if (
                    $data->contact_title ||
                    $data->contact_tel ||
                    $data->contact_fax ||
                    $data->contact_mail ||
                    $data->contact_url
                ) : ?>
                    <dl>
                        <dt>お問い合わせ</dt>
                        <?php if ($data->contact_title) : ?>
                            <dd>名称：<?= h($data->contact_title) ?></dd>
                        <?php endif; ?>
                        <?php if ($data->contact_tel) : ?>
                            <dd>電話番号：<?= h($data->contact_tel) ?></dd>
                        <?php endif; ?>
                        <?php if ($data->contact_fax) : ?>
                            <dd>FAX：<?= h($data->contact_fax) ?></dd>
                        <?php endif; ?>
                        <?php if ($data->contact_mail) : ?>
                            <dd>メールアドレス：<?= h($data->contact_mail) ?></dd>
                        <?php endif; ?>
                        <?php if ($data->contact_url) : ?>
                            <dd>ホームページ：<?= $this->Html->link(($data->contact_url_title ? $data->contact_url_title : $data->contact_url) . '(外部リンク)', $data->contact_url, ['target' => 'blank']) ?></dd>
                        <?php endif; ?>
                    </dl>
                <?php endif; ?>
                <?php if ($data->event_links) : ?>
                    <dl>
                        <dt>関連リンク</dt>
                        <?php foreach ($data->event_links as $block) : ?>
                            <?php
                            if (!$block->value01) continue;
                            $text = $block->value02 ?: __("関連リンク");
                            $opt = !empty($block->value03) ? ["target" => "_blank"] : [];
                            $suffix = "";

                            if (parse_url($block->value01, PHP_URL_HOST)) {
                                $suffix = (parse_url($block->value01, PHP_URL_HOST) != parse_url(\Cake\Routing\Router::url("/", true), PHP_URL_HOST)) ? __("（外部リンク）") : "";
                            }

                            ?>
                            <dd>
                                <a href="<?= h($block->value01) ?>" <?php if (!empty($block->value03)) : ?>target="_blank" <?php endif; ?>>
                                    <?= h("{$text}{$suffix}"); ?>
                                </a>
                            </dd>
                        <?php endforeach; ?>
                    </dl>
                <?php endif; ?>
                <?php if ($data->event_files) : ?>
                    <dl>
                        <dt>関連ファイル</dt>
                        <?php foreach ($data->event_files as $block) : ?>
                            <?php
                            if (isset($isConfirm) && $isConfirm) {
                                $link = $this->cell('Medii/File.ConfirmFile::file', [$block->file01_id, $block->value01]);
                            } else {
                                $text = $block->value01 ?: __("添付ファイル");
                                $file = $block->file01;
                                $suffix = FileUtility::getSuffix($file);
                                $text .= $suffix;
                                $link = $this->Html->link($text, h($block->file01->filePath), ["target" => "_blank"]);
                            }
                            ?>
                            <dd>
                                <?= $link ?>
                            </dd>
                        <?php endforeach; ?>
                    </dl>
                <?php endif; ?>


                <div class="spot-note">
                    <p>変更になっている場合がございますので、お出かけの際は直接お問い合わせください。</p>
                </div>

            </div>
            <!-- spot-data -->

            <?php if ($data->lttd && $data->lgtd) : ?>
                <!-- access-block -->
                <div class="access-block">
                    <div class="access-map">
                        <iframe title="地図" src="<?= $this->Utility->getEmbedMapSrc($data->lttd, $data->lgtd) ?>" width="600" height="450" style="border:0" allowfullscreen=""></iframe>
                    </div>

                    <!-- btn-block -->
                    <div class="btn-block center">
                        <p>
                            <a class="btn-base arrow" target="_blank" href="<?= $this->Utility->getRouteMapLink($data->lttd, $data->lgtd) ?>">現在地からのルート</a>
                        </p>
                    </div>
                    <!-- btn-block -->

                </div>
                <!-- access-block -->
            <?php endif; ?>

            <!-- category-block -->
            <div class="category-block">
                <dl>
                    <?php if ($data->master_areas || $data->master_area) : ?>
                        <dt>エリア</dt>
                        <dd>
                            <!-- list-icon -->
                            <ul class="list-icon">
                                <?php if ($data->master_areas) : ?>
                                    <?php foreach ($data->master_areas as $area) : ?>
                                        <li>
                                            <?= $this->Html->link($area->title, ['controller' => 'Events', 'action' => 'index', 'prefix' => false, '?' => [
                                                'master_areas' => [h($area->id)]
                                            ]], ['class' => h($area->class ? $area->class : "category")]) ?>
                                        </li>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                                <?php if ($data->master_area) : ?>
                                    <li>
                                        <?= $this->Html->link($data->master_area->title, ['controller' => 'Events', 'action' => 'index', 'prefix' => false, '?' => [
                                            'master_areas' => [h($data->master_area->id)]
                                        ]], ['class' => h($data->master_area->class ? $data->master_area->class : "category")]) ?>
                                    </li>
                                <?php endif; ?>
                            </ul>
                            <!-- list-icon -->
                        </dd>
                    <?php endif; ?>
                    <?php if ($data->master_event_categories || $data->master_event_category) : ?>
                        <dt>ジャンル</dt>
                        <dd>
                            <!-- list-icon -->
                            <ul class="list-icon">
                                <?php if ($data->master_event_categories) : ?>
                                    <?php foreach ($data->master_event_categories as $category) : ?>
                                        <li>
                                            <?= $this->Html->link($category->title, ['controller' => 'Events', 'action' => 'index', 'prefix' => false, '?' => [
                                                'master_event_categories' => [h($category->id)]
                                            ]], ['class' => h($category->class ? $category->class : "category")]) ?>
                                        </li>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                                <?php if ($data->master_event_category) : ?>
                                    <li>
                                        <?= $this->Html->link($data->master_event_category->title, ['controller' => 'Events', 'action' => 'index', 'prefix' => false, '?' => [
                                            'master_event_categories' => [h($data->master_event_category->id)]
                                        ]], ['class' => h($data->master_event_category->class ? $data->master_event_category->class : "category")]) ?>
                                    </li>
                                <?php endif; ?>
                            </ul>
                            <!-- list-icon -->
                        </dd>
                    <?php endif; ?>
                    <dt>#タグ</dt>
                    <dd>
                        <!-- list-icon -->
                        <ul class="list-icon">
                            <li><a class="category" href="">#タグタグタグタグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                            <li><a class="category" href="">#タグタグタグ</a></li>
                        </ul>
                        <!-- list-icon -->
                    </dd>
                    <dt>Instagramでもチェック！</dt>
                    <dd>
                        <!-- list-icon -->
                        <ul class="list-icon">
                            <li><a class="category" href="">旅のテーマ</a></li>
                            <li><a class="category" href="">旅のテーマ</a></li>
                            <li><a class="category" href="">旅のテーマ</a></li>
                            <li><a class="category" href="">旅のテーマ</a></li>
                            <li><a class="category" href="">旅のテーマ</a></li>
                        </ul>
                        <!-- list-icon -->
                    </dd>
                </dl>

                <!-- btn-block -->
                <div class="btn-block center">
                    <p>
                        <a class="btn-base print" href="">印刷する</a>
                    </p>
                </div>
                <!-- btn-block -->

            </div>
            <!-- category-block -->

        </div>
        <!-- inner -->

    </section>
    <!-- spot-main -->

    <?php if ($data->lttd && $data->lgtd) : ?>
        <?= $this->cell('Events::nearEvent', [$data->id, $data->lttd, $data->lgtd]) ?>
    <?php endif; ?>
</div>

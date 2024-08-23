<?php

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     0.10.0
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 * @var \App\View\AppView $this
 */


$this->Html->css('/css/top.css', ['block' => true]);

$this->Html->script('/js/swiper-bundle.min.js', ['block' => 'scriptBody']);
$this->Html->css('/css/swiper-bundle.min.css', ['block' => 'scriptBody']);

$js = <<<JS

var swiperMv = new Swiper('.main-area-top .swiper', {
    loop: true,
    slidesPerView: 1,/* 1画面に見えるスライドの数 */
    spaceBetween: 0,/* スライドの間隔 */
    speed: 500,/* スライドの早さ */
    pagination: {/* ページネーション */
        el: '.main-area-top .swiper-pagination',
        clickable: true,/* クリックでそのスライドに移動できる */
    },
    navigation: {
        nextEl: '.main-area-top .swiper-button-next',
        prevEl: '.main-area-top .swiper-button-prev',
    },
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,/* ページネーションをクリックした後に自動再生する */
    },
});

/* 再生、停止ボタン */
$(window).on('load', function () {

    // 再生・停止ボタン1つ
    $(".stopbtn-block button").on("click", function () {
        if ($(this).hasClass('stop')) {
            $(this).parents('.stopbtn-block').find('.play').show();
            $(this).parents('.stopbtn-block').find('.stop').hide();
            swiperMv.autoplay.stop();
        } else {
            $(this).parents('.stopbtn-block').find('.play').hide();
            $(this).parents('.stopbtn-block').find('.stop').show();
            swiperMv.autoplay.start();
        }
    });


    // 再生・停止ボタン2つ並べる
    // $(".btn.stop").on("click", function () {
    //     swiperMv.autoplay.stop();
    //     $(this).addClass("active");
    //     $(this).parents('.btn-swiper').find('.play').removeClass("active");
    // });
    // $(".btn.play").on("click", function () {
    //     swiperMv.autoplay.start();
    //     $(this).addClass("active");
    //     $(this).parents('.btn-swiper').find('.stop').removeClass("active");
    // });

});

JS;

$this->Html->scriptBlock($js, ['block' => 'scriptBody']);
?>

<?php $this->start('mainArea') ?>
<!-- main-area-top -->
<div class="main-area-top">

    <!-- slider-block -->
    <div class="slider-block">

        <?php if(!empty($topImages)): ?>
            <!-- swiper -->
            <div class="swiper">

                <!-- swiper-wrapper -->
                <div class="swiper-wrapper">
                    <?php foreach ($topImages as $image): ?>
                        <?php
                        $pc_image = $this->cell('Medii/File.ConfirmFile::image', [$image->image_id, $image->image_alt, ["loading" => "lazy", "class" => "pc-block"]]);
                        $pc_slider = !empty($image->url) ? $this->html->link($pc_image, $image->url, ["target" => $image->url_is_blank ? "_blank" : '', 'escape' => false]) : $ps_image;

                        $sp_image = $this->cell('Medii/File.ConfirmFile::image', [$image->sp_image_id, $image->sp_image_alt, ["loading" => "lazy", "class" => "sp-block"]]);
                        $sp_slider = !empty($image->sp_url) ? $this->html->link($sp_image, $image->sp_url, ["target" => $image->sp_url_is_blank ? "_blank" : '', 'escape' => false]) : $sp_image;
                        ?>
                        <!-- swiper-slide -->
                        <div class="swiper-slide">
                            <?= $pc_slider; ?>
                            <?= $sp_slider; ?>
                        </div>
                        <!-- swiper-slide -->
                    <?php endforeach; ?>
                </div>
                <!-- swiper-wrapper -->

            </div>
            <!-- swiper -->

            <!-- Add Arrows -->
            <div class="swiper-button-next js-swiper-next"></div>
            <div class="swiper-button-prev js-swiper-next"></div>

            <!-- swiper-operation -->
            <div class="swiper-operation">
                <!-- Add Pagination -->
                <div class="swiper-pagination"></div>

                <!-- 停止ボタンノーマル -->
                <!-- <div class="stopbtn-block">
                    <p><button class="stopbtn play">再生</button></p>
                    <p><button class="stopbtn stop">停止</button></p>
                </div> -->
                <!-- 停止ボタンノーマル -->

                <!-- 停止ボタン画像切り替え -->
                <div class="stopbtn-block">
                    <p><button class="stopbtn02 play">再生</button></p>
                    <p><button class="stopbtn02 stop">停止</button></p>
                </div>
                <!-- 停止ボタン画像切り替え -->

                <!-- 停止ボタン画像並べる -->
                <!-- <div class="btn-swiper">
                    <p><button class="btn play">再生</button></p>
                    <p><button class="btn stop">停止</button></p>
                </div> -->
                <!-- 停止ボタン画像並べる -->
            </div>
            <!-- swiper-operation -->
        <?php endif; ?>
    </div>
    <!-- slider-block -->

</div>
<!-- main-area-top -->
<?php $this->end(); ?>

<?= $this->cell('TopTopics', ['isTop' => $isTop, 'isThumbnail' => true]) ?>

<?= $this->cell('Events::top') ?>

<?php
// ※一覧の各種テンプレートを作成しています。暫定で「Topics&カテゴリ複数」で作成しているので、適宜変数名と引数を変えて使ってください。
?>
<?php // リスト表示用 ?>
<?php if ($topicslist && !empty($topicslist)): ?>
    <!-- news-area-top -->
    <section class="news-area-top">
        <!-- inner -->
        <div class="inner">

            <h2 class="ttl-top">お知らせ（リスト表示）</h2>

            <!-- list-article -->
            <ul class="list-article">
                <?php foreach ($topicslist as $topic) : ?>
                    <?= $this->element("Contents/item", ['data' => $topic, 'Model' => 'Topics', 'masterCategory' => 'master_topic_categories']) ?>
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

<?php // ３列表示用 ~> Spots等への利用を想定 ?>
<?php if ($topics3line && !empty($topics3line)): ?>
    <!-- spot-area-top -->
    <section class="spot-area-top">
        <!-- inner -->
        <div class="inner">

            <h2 class="ttl-top">お知らせ（3列）</h2>

            <!-- list-ph -->
            <ul class="list-thumb col3 sp-col01">
                <?php foreach ($topics3line as $topic) : ?>
                    <?= $this->element("Contents/spot_item", ['data' => $topic, 'Model' => 'Topics', 'masterCategory' => 'master_topic_categories']) ?>
                <?php endforeach; ?>
            </ul>
            <!-- list-ph -->

            <!-- btn-block -->
            <div class="btn-block center">
                <!-- btn-base arrow-->
                <p>
                    <?= $this->Html->link('お知らせ一覧へ', ['controller' => 'Topics', 'action' => 'index',], ['class' => 'btn-base arrow']) ?>
                </p>
                <!-- btn-base arrow-->
            </div>
            <!-- btn-block -->

        </div>
        <!-- inner -->
    </section>
    <!-- spot-area-top -->
<?php endif; ?>

<?php // ４列表示用 => Eventsなどへの利用を想定 ?>
<?php if ($topics4line && !empty($topics4line)): ?>
    <!-- topics-area-top -->
    <section class="topics-area-top">
        <!-- inner -->
        <div class="inner">

            <h2 class="ttl-top">お知らせ（4列）</h2>

            <!-- list-ph -->
            <ul class="list-thumb col4 sp-col01">
                <?php foreach ($topics4line as $topic) : ?>
                    <?= $this->element("Contents/thumb_item", ['data' => $topic, 'Model' => 'Topics', 'masterCategory' => 'master_topic_categories']) ?>
                <?php endforeach; ?>
            </ul>
            <!-- list-ph -->

            <!-- btn-block -->
            <div class="btn-block center">
                <!-- btn-base arrow-->
                <p>
                    <?= $this->Html->link('お知らせ一覧へ', ['controller' => 'Topics', 'action' => 'index',], ['class' => 'btn-base arrow']) ?>
                </p>
                <!-- btn-base arrow-->
            </div>
            <!-- btn-block -->

        </div>
        <!-- inner -->
    </section>
    <!-- topics-area-top -->
<?php endif; ?>

<?php if ($bunners && !empty($bunners)): ?>
    <!-- bnr-area-top -->
    <section class="bnr-area-top">
        <div class="inner">
            <!-- ttl-small -->
            <div class="ttl-small">
                <h3>バナーエリア</h3>
            </div>
            <!-- ttl-small -->

            <!-- list-bnr -->
            <ul class="list-bnr">
                <?php foreach ($bunners as $bunner): ?>
                    <li>
                        <?php
                        $bunner_image = $this->cell('Medii/File.ConfirmFile::image', [$bunner->file_id, $bunner->file_alt, ["loading" => "lazy", "class" => "pc-block"]]);
                        $bun = !empty($bunner->url) ? $this->html->link($bunner_image, $bunner->url, ["target" => $bunner->url_is_blank ? "_blank" : '', 'escape' => false]) : $bunner_image;
                        ?>
                       <?= $bun ?>
                    </li>
                <?php endforeach; ?>
            </ul>
            <!-- list-bnr -->
        </div>
    </section>
    <!-- bnr-area-top -->
<?php endif; ?>

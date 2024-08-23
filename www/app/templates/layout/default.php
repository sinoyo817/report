<?php

declare(strict_types=1);

use Cake\Core\Configure;
use Cake\Routing\Router;

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @since         0.10.0
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 * @var \App\View\AppView $this
 */

$this->Breadcrumbs->setTemplates([
    'itemWithoutLink' => '<li{{attrs}}>{{title}}</li>{{separator}}',
    'separator' => '<li{{attrs}}>{{separator}}</li>'
]);

$crmbs = explode(" - ", strip_tags($this->Breadcrumbs->render([], ['separator' => ' - '])));
$temp  = array_filter(array_merge([Configure::read("CustomSettings.General.site")], $crmbs));
$this->assign('title', implode(" | ", array_reverse($temp)));

$this->Breadcrumbs->prepend(__("トップページ"), '/');

$crmbs = explode(" - ", strip_tags($this->Breadcrumbs->render([], ['separator' => ' - '])));

$googleTagManagerId = Configure::read('Site.Settings.GoogleTagManagerId');
?>
<!DOCTYPE html>
<html lang="<?= h(Configure::read('Site.Meta.Page.locale') ?? Configure::read('CustomSettings.General.locale')) ?>">

<head prefix="og: http://ogp.me/ns#  article: http://ogp.me/ns/website#">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">

    <title>
        <?= $this->fetch('title') ?>
    </title>

    <?php if (isset($googleTagManagerId) && $googleTagManagerId) : ?>
        <!-- Google Tag Manager -->
        <script>
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-<?= h($googleTagManagerId) ?>');
        </script>
        <!-- End Google Tag Manager -->
    <?php endif; ?>

    <?= $this->Html->script('/js/viewport.js'); ?>

    <meta name="description" content="<?= h(Configure::read('Site.Meta.Page.description') ?? Configure::read('CustomSettings.General.description')) ?>">
    <meta name="keywords" content="<?= h(Configure::read('Site.Meta.Page.keywords') ?? Configure::read('CustomSettings.General.keywords')) ?>">
    <meta name="format-detection" content="telephone=no">

    <!-- ogp -->
    <meta property="og:locale" content="<?= h(Configure::read('Site.Meta.Page.og_locale') ?? Configure::read('CustomSettings.General.og_locale')) ?>">
    <meta property="og:type" content="<?= isset($isTop) ? "website" : "page" ?>">
    <meta property="og:site_name" content="<?= h(Configure::read('CustomSettings.General.site')) ?>">
    <meta property="og:title" content="<?= h(Configure::read('Site.Meta.Page.title') ?? Configure::read('CustomSettings.General.site')) ?>">
    <meta property="og:description" content="<?= h(Configure::read('Site.Meta.Page.description') ?? Configure::read('CustomSettings.General.description')) ?>">
    <meta property="og:image" content="<?= Router::url(h(Configure::read('Site.Meta.Page.image') ?? Configure::read('CustomSettings.General.og_image')), true) ?>">
    <meta property="og:url" content="<?= Configure::read("Site.Meta.Page.url") ?? Router::url(null, true); ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= h(Configure::read('Site.Meta.Page.title') ?? Configure::read('CustomSettings.General.site')) ?>">
    <meta name="twitter:description" content="<?= h(Configure::read('Site.Meta.Page.description') ?? Configure::read('CustomSettings.General.description')) ?>">
    <meta name="twitter:image:src" content="<?= Router::url(h(Configure::read('Site.Meta.Page.image') ?? Configure::read('CustomSettings.General.og_image')), true) ?>">
    <meta name="thumbnail" content="<?= Router::url(h(Configure::read('Site.Meta.Page.image') ?? Configure::read('CustomSettings.General.og_image')), true) ?>">


    <!--favicon-->
    <?= $this->Html->meta(['rel' => 'shortcut icon', 'link' => '/favicon.ico']); ?>
    <?= $this->Html->meta(['rel' => 'apple-touch-icon', 'link' => '/img/common/apple-touch-icon-precomposed.png']); ?>

    <?= $this->fetch('meta') ?>


    <!-- webfont -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Noto+Sans+JP:wght@500;700&family=Noto+Serif+JP:wght@500;700&display=swap" rel="stylesheet">

    <?= $this->Html->css('/css/common.css'); ?>

    <?= $this->fetch('css') ?>

    <?= $this->Html->script('/js/jquery.min.js'); ?>
    <?= $this->fetch('script') ?>
</head>


<body>
    <?php if (isset($googleTagManagerId) && $googleTagManagerId) : ?>
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-<?= h($googleTagManagerId) ?>" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
    <?php endif; ?>

    <!-- wrapper -->
    <div class="wrapper">

        <?= $this->elementExists('Site/header') ? $this->element('Site/header', []) : '' ?>

        <?= $this->fetch('mainArea') ?>

        <!--contents-->
        <main id="contents">

            <?php if (isset($isTop) && $isTop) : ?>
                <?= $this->fetch('content') ?>
            <?php else : ?>

                <?php if ($this->fetch('pageTitle')) : ?>
                    <!-- page-ttl -->
                    <?= $this->fetch('pageTitle') ?>
                    <!-- page-ttl -->
                <?php endif; ?>

                <!-- breadCrumbs -->
                <nav class="breadCrumbs" aria-label="Breadcrumb">
                    <?= $this->Breadcrumbs->render() ?>
                </nav>
                <!-- breadCrumbs -->

                <!-- main -->
                <?= $this->fetch('content') ?>
                <!-- main -->

            <?php endif; ?>

        </main>
        <!--contents-->

        <?php if (!isset($isTop)) : ?>
            <!-- breadCrumbs -->
            <div class="breadCrumbs">
                <?= $this->Breadcrumbs->render() ?>
            </div>
            <!-- breadCrumbs -->
        <?php endif; ?>

        <?= $this->elementExists('Site/footer') ? $this->element('Site/footer', []) : '' ?>

    </div>
    <!-- wrapper -->

    <?= $this->Html->script('/js/common.js'); ?>
    <?= $this->fetch('scriptBody') ?>
</body>

</html>
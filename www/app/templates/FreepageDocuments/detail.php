<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic $data
 */

use Cake\Core\Configure;
use Cake\Routing\Router;
use Cake\Utility\Hash;

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

// if (isset($data->freepage_directories[0])) {
//     Configure::write("Site.Meta.Page.url", Router::url($data->freepage_directories[0]->path_url, true) . ".html");
// }

$customCss = Configure::read('CustomSettings.Freepages.customCss');
$customJs = Configure::read('CustomSettings.Freepages.customJs');
if ($customCss || $customJs) {
    $css = [];
    $js = [];
    if ($data->freepage_directories) {
        foreach ($data->freepage_directories as $dir) {

            // 確認画面ではディレクトリを選択するため
            $crumbsPath = isset($isConfirm) && $isConfirm ? [$dir] : $dir->crumbs_path;

            if ($crumbsPath) {

                foreach ($crumbsPath as $crumbPath) {
                    $path = $crumbPath->path;
                    if ($customCss) {
                        $checkCss = Hash::extract($customCss, "{n}[dir={$path}]")[0] ?? [];
                        if ($checkCss) {
                            if (!in_array($checkCss['path'], $css, true)) {
                                $css[] = $checkCss['path'];
                            }
                        }
                    }
                    if ($customJs) {
                        $checkJs = Hash::extract($customJs, "{n}[dir={$path}]")[0] ?? [];
                        if ($checkJs) {
                            if (!in_array($checkJs['path'], $js, true)) {
                                $js[] = $checkJs['path'];
                            }
                        }
                    }
                }
            }
        }
    }
    if ($css) {
        $this->Html->css($css, ['block' => true]);
    }
    if ($js) {
        $this->Html->script($js, ['block' => 'scriptBody']);
    }
}

$this->Breadcrumbs->add(h($data->title), null, [
    'aria-current' => "page"
]);

?>

<?php $this->start('pageTitle') ?>
<div class="page-ttl">
    <h1 class="ttl">
        <?php if ($data->sub_title) : ?>
            <?= h($data->sub_title) ?><span><?= h($data->title) ?></span>
        <?php else : ?>
            <?= h($data->title) ?>
        <?php endif; ?>
    </h1>
</div>
<?php $this->end(); ?>



    <?= $this->Block->getHtmls($data->blocks); ?>

<?php

declare(strict_types=1);

use Cake\Core\Configure;
use Cake\I18n\FrozenDate;
use Cake\Routing\Router;

/**
 * @var \App\View\AppView $this
 * @var \Cake\I18n\FrozenDate $published
 */

$url = Router::reverse($this->request, true);
$twitter = "https://twitter.com/share?url=" . rawurldecode($url);
$facebook = "https://www.facebook.com/sharer/sharer.php?u=" . rawurldecode($url);
$line = "https://line.me/R/msg/text/?" . rawurldecode($url);

?>


<!-- list-sns -->
<ul class="list-sns">
    <li class="icon-twitter"><a href="<?= $twitter ?>" target="_blank"><img title="twitter" src="/img/common/ico_x.svg" alt="x"></a></li>
    <li class="icon-facebook"><a href="<?= $facebook ?>" target="_blank"><img title="facebook" src="/img/common/ico_facebook.svg" alt="facebook"></a></li>
    <li class="icon-line"><a href="<?= $line ?>" target="_blank"><img title="line" src="/img/common/ico_line.svg" alt="line"></a></li>
</ul>
<!-- list-sns -->

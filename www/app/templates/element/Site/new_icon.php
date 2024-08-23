<?php

declare(strict_types=1);

use Cake\Core\Configure;
use Cake\I18n\FrozenDate;

/**
 * @var \App\View\AppView $this
 * @var \Cake\I18n\FrozenDate $published
 */

$today = new FrozenDate();
$class = $class ?? "icon-new";
$tag = $tag ?? "span";
$title = $title ?? __("NEW");

if ($published->diffInDays($today) < Configure::read("CustomSettings.General.newIconLimit")) {
    echo sprintf('<%s class="%s">%s</%s>', $tag, $class, $title, $tag);
}

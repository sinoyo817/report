<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Seminar[]|\Cake\Collection\CollectionInterface $data
 */

declare(strict_types=1);

if ($image) {

    $path = '/files/';

    echo $this->Html->image($path . $image->path, $opt);
}

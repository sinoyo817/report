<?php

declare(strict_types=1);

namespace App\View\Cell;

use Cake\ORM\Query;
use Cake\View\Cell;
use Medii\File\Model\Filter\FilesCollection;

/**
 * ContactImage cell
 */
class ContactImageCell extends Cell
{
    protected $defaultTable = 'Medii/File.Files';
    /**
     * List of valid options that can be passed into this
     * cell's constructor.
     *
     * @var array<string, mixed>
     */
    protected $_validCellOptions = [];


    /**
     * Initialization logic run at the end of object construction.
     *
     * @return void
     */
    public function initialize(): void
    {
    }

    /**
     * image method
     *
     * @param string $fileId
     * @param string $alt
     * @return void
     */
    public function image($fileId, $isEdit, $opt = [])
    {
        $image = $fileId ? $this->fetchTable()
            ->find('search', [
                'search' => ['id' => $fileId],
            ])
            ->firstOrFail() : [];
        $this->set(compact('image', 'opt', 'isEdit'));
    }
}

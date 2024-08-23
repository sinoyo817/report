<?php

declare(strict_types=1);

namespace App\Model\Entity;

use Cake\Log\Log;
use Cake\ORM\TableRegistry;

/**
 * FreepageDirectory Entity
 *
 * @property string $id
 * @property string|null $parent_id
 * @property int|null $lft
 * @property int|null $rght
 * @property string|null $type
 * @property string $title
 * @property string|null $path
 * @property string|null $path_url
 * @property string|null $freepage_document_id
 * @property string|null $status
 * @property string|null $public
 * @property string|null $searchtext
 * @property \Cake\I18n\FrozenTime|null $created
 * @property string|null $created_by_admin
 * @property string|null $created_by_user
 * @property \Cake\I18n\FrozenTime|null $modified
 * @property string|null $modified_by_admin
 * @property string|null $modified_by_user
 * @property int $cid
 *
 * @property \App\Model\Entity\ParentFreepageDirectory $parent_freepage_directory
 * @property \App\Model\Entity\FreepageDocument $freepage_document
 * @property \App\Model\Entity\ChildFreepageDirectory[] $child_freepage_directories
 */
class FreepageDirectory extends AppEntity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array<string, bool>
     */
    protected $_accessible = [
        'parent_id' => true,
        'lft' => true,
        'rght' => true,
        'type' => true,
        'title' => true,
        'path' => true,
        'path_url' => true,
        'freepage_document_id' => true,
        'status' => true,
        'public' => true,
        'searchtext' => true,
        'created' => true,
        'modified' => true,
        'parent_freepage_directory' => true,
        'freepage_document' => true,
        'child_freepage_directories' => true,
        'id' => true,
        'cid' => true,
    ];

    protected function _getCrumbsPath()
    {
        $crumbs = [];
        $freepageDirectoriesTable = TableRegistry::getTableLocator()->get('FreepageDirectories');
        if (!empty($this->_fields['parent_id'])) {
            $id = $this->_fields['parent_id'];
            $crumbs =  $freepageDirectoriesTable->find('path', ['for' => $id])->toArray();
        }
        // トップ要素は不要なので外しておく
        array_shift($crumbs);

        return ($crumbs);
    }
}

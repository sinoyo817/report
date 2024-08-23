<?php

declare(strict_types=1);

namespace App\Model\Entity;

use Cake\Log\Log;
use Cake\ORM\TableRegistry;

/**
 * FreepageDocument Entity
 *
 * @property string $id
 * @property string $title
 * @property string|null $path
 * @property string|null $file_id
 * @property string|null $file_alt
 * @property string|null $summary
 * @property string|null $summary_files
 * @property \Cake\I18n\FrozenDate|null $published
 * @property \Cake\I18n\FrozenTime|null $start_date
 * @property \Cake\I18n\FrozenTime|null $end_date
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
 * @property \App\Model\Entity\File $file
 * @property \App\Model\Entity\FreepageDirectory[] $freepage_directories
 */
class FreepageDocument extends AppEntity
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
        'title' => true,
        'sub_title' => true,
        'path' => true,
        'file_id' => true,
        'file_alt' => true,
        'summary' => true,
        'summary_files' => true,
        'published' => true,
        'start_date' => true,
        'end_date' => true,
        'status' => true,
        'public' => true,
        'searchtext' => true,
        'created' => true,
        'modified' => true,
        'file' => true,
        'freepage_directories' => true,
        'id' => true,
        'blocks' => true,
        'metadata' => true,
        'cid' => true,
    ];

    protected function _getPathTrees()
    {
        $crumbs = [];
        $freepageDirectoriesTable = TableRegistry::getTableLocator()->get('FreepageDirectories');
        if (!empty($this->_fields['freepage_directories'])) {
            foreach ($this->_fields['freepage_directories'] as $dir) {
                if ($dir->parent_id === "root") {
                    continue;
                }
                $tmp = $freepageDirectoriesTable->find('path', ['for' => $dir->parent_id]);
                $arr = [];
                foreach ($tmp as $v) {
                    $arr[] = $v->title;
                }
                $crumbs[$dir->parent_id] = implode(" > ", $arr);
            }
        }
        return $crumbs;
    }

    protected function _getParentIds()
    {
        $ids = [];
        if (!empty($this->_fields["freepage_directories"])) {
            foreach ($this->_fields["freepage_directories"] as $dir) {
                $ids[] = $dir->parent_id ?? $dir->id;
            }
        }

        return ($ids);
    }

    // protected function _getCrumbsPath()
    // {
    //     $crumbs = [];
    //     $freepageDirectoriesTable = TableRegistry::getTableLocator()->get('FreepageDirectories');

    //     if (!empty($this->_fields["parent_id"])) {
    //         $id = $this->_fields["parent_id"];
    //         $crumbs = $freepageDirectoriesTable->find('path', ['for' => $id])->toArray();
    //     }
    //     // トップ要素は不要なので外しておく
    //     array_shift($crumbs);

    //     return ($crumbs);
    // }
}

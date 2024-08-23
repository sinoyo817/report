<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Behavior\Translate\TranslateTrait;

/**
 * TopImage Entity
 *
 * @property string $id
 * @property string $title
 * @property string|null $image_id
 * @property string|null $image_alt
 * @property string|null $url
 * @property string|null $url_is_blank
 * @property string|null $sp_image_id
 * @property string|null $sp_image_alt
 * @property string|null $sp_url
 * @property string|null $sp_url_is_blank
 * @property \Cake\I18n\FrozenDate|null $published
 * @property \Cake\I18n\FrozenDate|null $start_date
 * @property \Cake\I18n\FrozenDate|null $end_date
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
 */
class TopImage extends AppEntity
{
    use TranslateTrait;
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
        'image_id' => true,
        'image_alt' => true,
        'url' => true,
        'url_is_blank' => true,
        'sp_image_id' => true,
        'sp_image_alt' => true,
        'sp_url' => true,
        'sp_url_is_blank' => true,
        'published' => true,
        'start_date' => true,
        'end_date' => true,
        'status' => true,
        'public' => true,
        'searchtext' => true,
        'created' => true,
        'modified' => true,
        'cid' => true,
        'id' => true,
        '_translations' => true,
        '_i18n' => true,
    ];
}

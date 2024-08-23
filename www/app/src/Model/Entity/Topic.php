<?php

declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Behavior\Translate\TranslateTrait;

/**
 * Topic Entity
 *
 * @property string $id
 * @property string $title
 * @property string|null $url
 * @property string|null $url_is_blank
 * @property string|null $summary
 * @property string|null $summary_files
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
 *
 * @property \Medii\Block\Model\Entity\Block[] $blocks
 * @property \Medii\Metadata\Model\Entity\Metadata $metadata
 */
class Topic extends AppEntity
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
        'url' => true,
        'url_is_blank' => true,
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
        'blocks' => true,
        'metadata' => true,
        'id' => true,
        'master_topic_categories' => true,
        'master_topic_categories_topics' => true,
        'master_topic_category_id' => true,
        'file_id' => true,
        'file_alt' => true,
        'slug' => true,
        'cid' => true,
        '_translations' => true,
        '_i18n' => true,
    ];
}

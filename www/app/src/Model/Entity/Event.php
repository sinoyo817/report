<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * Event Entity
 *
 * @property string $id
 * @property string|null $is_top
 * @property string|null $area
 * @property string $title
 * @property string|null $url
 * @property string|null $url_is_blank
 * @property string|null $file_id
 * @property string|null $file_alt
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
 * @property \Cake\I18n\FrozenTime|null $modified_admin
 * @property int $cid
 *
 * @property \App\Model\Entity\File $file
 * @property \App\Model\Entity\MasterEventCategoriesEventsPrivate[] $master_event_categories_events_private
 * @property \App\Model\Entity\MasterEventCategory[] $master_event_categories
 */
class Event extends AppEntity
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
        'is_top' => true,
        'area' => true,
        'title' => true,
        'title_kana' => true,
        'copy' => true,
        'url' => true,
        'url_is_blank' => true,
        'file_id' => true,
        'file_alt' => true,
        'file_caption' => true,
        'file_is_blank' => true,
        'summary' => true,
        'pr' => true,
        'summary_files' => true,
        'published' => true,
        'start_date' => true,
        'end_date' => true,
        'application_start_date' => true,
        'application_end_date' => true,
        'postal_code' => true,
        'address' => true,
        'lttd' => true,
        'lgtd' => true,
        'event_date_type' => true,
        'event_date_text' => true,
        'event_dates_values' => true,
        'event_start_date' => true,
        'event_end_date' => true,
        'event_time' => true,
        'price' => true,
        'parking' => true,
        'access' => true,
        'remark' => true,
        'contact_title' => true,
        'contact_tel' => true,
        'contact_fax' => true,
        'contact_mail' => true,
        'contact_url' => true,
        'contact_url_title' => true,
        'status' => true,
        'public' => true,
        'searchtext' => true,
        'created' => true,
        'modified' => true,
        'modified_admin' => true,
        'file' => true,
        'master_areas' => true,
        'master_areas_events' => true,
        'master_area_id' => true,
        'master_event_categories' => true,
        'master_event_categories_events' => true,
        'master_event_category_id' => true,
        'id' => true,
        'event_dates' => true,
        'metadata' => true,
        'event_images' => true,
        'event_files' => true,
        'event_links' => true,
        'cid' => true,
    ];
}

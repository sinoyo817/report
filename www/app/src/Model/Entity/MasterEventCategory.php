<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * MasterEventCategory Entity
 *
 * @property string $id
 * @property string $title
 * @property int $sequence
 * @property string|null $status
 * @property string|null $public
 * @property \Cake\I18n\FrozenTime|null $created
 * @property string|null $created_by_admin
 * @property string|null $created_by_user
 * @property \Cake\I18n\FrozenTime|null $modified
 * @property string|null $modified_by_admin
 * @property string|null $modified_by_user
 * @property int $cid
 *
 * @property \App\Model\Entity\Event[] $events
 * @property \App\Model\Entity\EventsPrivate[] $events_private
 */
class MasterEventCategory extends AppEntity
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
        'class' => true,
        'sequence' => true,
        'status' => true,
        'public' => true,
        'created' => true,
        'modified' => true,
        'events' => true,
        'events_private' => true,
        'id' => true,
        'cid' => true,
    ];
}

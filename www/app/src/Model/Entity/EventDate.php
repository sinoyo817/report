<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * EventDate Entity
 *
 * @property string $id
 * @property int|null $sequence
 * @property string $event_id
 * @property \Cake\I18n\FrozenDate|null $date
 *
 * @property \App\Model\Entity\Event $event
 */
class EventDate extends AppEntity
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
        'sequence' => true,
        'event_id' => true,
        'date' => true,
        'event' => true,
        'id' => true,
        'cid' => true,
    ];
}

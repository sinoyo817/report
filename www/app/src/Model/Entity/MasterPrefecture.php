<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * MasterPrefecture Entity
 *
 * @property string $id
 * @property string|null $title
 * @property int|null $sequence
 * @property string|null $note
 * @property \Cake\I18n\FrozenTime|null $created
 * @property \Cake\I18n\FrozenTime|null $modified
 */
class MasterPrefecture extends AppEntity
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
        'sequence' => true,
        'note' => true,
        'created' => true,
        'modified' => true,
        'id' => true,
        'cid' => true,
    ];
}

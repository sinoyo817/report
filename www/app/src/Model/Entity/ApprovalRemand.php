<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * ApprovalRemand Entity
 *
 * @property string $id
 * @property string|null $summary
 * @property string $model
 * @property \Cake\I18n\FrozenTime|null $created
 * @property string|null $created_by_admin
 * @property \Cake\I18n\FrozenTime|null $modified
 * @property int $cid
 */
class ApprovalRemand extends AppEntity
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
        '*' => true,
    ];
}

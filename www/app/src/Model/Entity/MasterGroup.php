<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Behavior\Translate\TranslateTrait;

/**
 * MasterGroup Entity
 *
 * @property string $id
 * @property string|null $title
 * @property string|null $email
 * @property string|null $mail_body
 * @property string|null $note
 * @property string|null $status
 * @property string|null $public
 * @property \Cake\I18n\FrozenTime|null $created
 * @property string|null $created_by_admin
 * @property string|null $created_by_user
 * @property \Cake\I18n\FrozenTime|null $modified
 * @property string|null $modified_by_admin
 * @property string|null $modified_by_user
 * @property int $cid
 */
class MasterGroup extends AppEntity
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
        'email' => true,
        'mail_body' => true,
        'note' => true,
        'sequence' => true,
        'status' => true,
        'public' => true,
        'created' => true,
        'modified' => true,
        'cid' => true,
        'id' => true,
        'blocks' => true,
        'metadata' => true,
        '_translations' => true,
        '_i18n' => true,
    ];
}

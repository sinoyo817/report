<?php

declare(strict_types=1);

namespace App\Model\Entity;

/**
 * Contact Entity
 *
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string|null $zip_code
 * @property string|null $prefecture_id
 * @property string|null $address_city
 * @property string|null $address_local
 * @property string|null $tel
 * @property string $gender
 * @property string $birthday
 * @property string|null $file_id
 * @property string|null $body
 * @property int $is_agree
 * @property string|null $status
 * @property string|null $public
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
 * @property \App\Model\Entity\MasterContactCategory[] $master_contact_categories
 */
class Contact extends AppEntity
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
        'email' => true,
        'zip_code' => true,
        'prefecture_id' => true,
        'address_city' => true,
        'address_local' => true,
        'tel' => true,
        'gender' => true,
        'birthday' => true,
        'file_id' => true,
        'summary' => true,
        'is_agree' => true,
        'status' => true,
        'public' => true,
        'created' => true,
        'modified' => true,
        'modified_admin' => true,
        'file' => true,
        'master_contact_categories' => true,
        'id' => true,
        'cid' => true,
    ];
}

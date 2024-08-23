<?php

declare(strict_types=1);

namespace App\Model\Entity;

use Authentication\PasswordHasher\DefaultPasswordHasher;
use App\Model\Entity\AppEntity;

/**
 * Admin Entity
 *
 * @property string $id
 * @property string $title
 * @property string $lastname
 * @property string $firstname
 * @property string $lastname_kana
 * @property string $firstname_kana
 * @property string $username
 * @property string $password
 * @property string $password_raw
 * @property string $role
 * @property string $email
 * @property string $status
 * @property string $public
 * @property \Cake\I18n\FrozenTime|null $created
 * @property \Cake\I18n\FrozenTime|null $modified
 * @property int $cid
 */
class Admin extends AppEntity
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
        'username' => true,
        'password' => true,
        'password_new' => true,
        'password_confirm' => true,
        'note' => true,
        'role' => true,
        'email' => true,
        'status' => true,
        'public' => true,
        'created' => true,
        'modified' => true,
        'id' => true,
        'cid' => true,
        'superuser' => false
    ];

    protected $_virtual = ['admin_id', 'user_id', 'title'];

    // Automatically hash passwords when they are changed.
    protected function _setPassword(string $password)
    {
        $hasher = new DefaultPasswordHasher();
        return $hasher->hash($password);
    }

    protected function _getAdminId(): string
    {
        if ($this->id) {
            return $this->id;
        }
        return "";
    }

    protected function _getUserId(): string
    {
        if ($this->role !== 'Admin') {
            return $this->id;
        } else {
            return "";
        }
    }
}

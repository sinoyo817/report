<?php

declare(strict_types=1);

namespace App\Policy;

use App\Model\Entity\Admin;
use Authorization\Policy\BeforePolicyInterface;
use Cake\Core\Configure;
use Cake\Datasource\RepositoryInterface;
use Cake\Log\Log;
use Cake\ORM\Query;
use Cake\Utility\Hash;

class AppTablePolicy implements BeforePolicyInterface
{

    /**
     * before method
     *
     * @param \Authorization\Identity|null $identity Identity object.
     * @param \Cake\Datasource\RepositoryInterface $resource The resource being operated on.
     * @param string $action The action/operation being performed.
     * @return \Authorization\Policy\ResultInterface|bool|null
     */
    public function before($user, $resource, $action)
    {
        if ($user) {

            if ($user->superuser) {
                return true;
            }
            if ($user->role === 'Admin') {
                return true;
            }

            return null;
        }
        return false;
    }

    /**
     * scopeIndex method
     *
     * @param \Authorization\Identity|null $user
     * @param \Cake\ORM\Query $query
     * @return \Cake\ORM\Query
     */
    public function scopeIndex($user, Query $query)
    {
        if ($user) {
            if ($user->superuser) {
                return $query;
            }
            if ($user->role === 'Admin') {
                return $query;
            }
            $userEntity = $user->getOriginalData();
            if ($userEntity instanceof Admin) {
                return $query->find('createdByAdmin', ['admin' => $user]);
            }
        }
        // queryを返す必要あり
        return $query->find('empty');
    }

    /**
     * Check if $user can index
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canIndex($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can index
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canConfirm($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can add
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canAdd($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can edit
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canEdit($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can delete
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canDelete($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can view
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canView($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can preview
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canPreview($user, RepositoryInterface $table)
    {
        return true;
    }

    /**
     * Check if $user can status
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\RepositoryInterface $table
     * @return bool
     */
    public function canStatus($user, RepositoryInterface $table)
    {
        return true;
    }
}

<?php

declare(strict_types=1);

namespace App\Policy;

use Authorization\Policy\BeforePolicyInterface;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Log\Log;

class AppEntityPolicy implements BeforePolicyInterface
{

    /**
     * before
     *
     * @param \Authorization\Identity|null $identity Identity object.
     * @param mixed $resource The resource being operated on.
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
     * Check if $user can add
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canAdd($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return true;
        }
        return false;
    }

    /**
     * Check if $user can confirm
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canConfirm($user, EntityInterface $entity)
    {
        $isEdit = !$entity->isNew();
        if ($isEdit) {
            if ($user->role === 'Editor') {
                return $user->id === $entity->created_by_user;
            }
        } else {
            if ($user->role === 'Editor') {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if $user can edit
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canEdit($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return $user->id === $entity->created_by_user;
        }
        return false;
    }

    /**
     * Check if $user can delete
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canDelete($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return $user->id === $entity->created_by_user;
        }
        return false;
    }

    /**
     * Check if $user can view
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canView($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return $user->id === $entity->created_by_user;
        }
        return false;
    }

    /**
     * Check if $user can preview
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canPreview($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return $user->id === $entity->created_by_user;
        }
        return false;
    }

    /**
     * Check if $user can status
     *
     * @param \Authorization\Identity|null $user The user.
     * @param \Cake\Datasource\EntityInterface $entity
     * @return bool
     */
    public function canStatus($user, EntityInterface $entity)
    {
        if ($user->role === 'Editor') {
            return $user->id === $entity->created_by_user;
        }
        return false;
    }
}

<?php

declare(strict_types=1);

namespace App\Policy;

use Cake\Datasource\EntityInterface;

/**
 * Admin policy
 */
class AdminPolicy extends AppEntityPolicy
{

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
            return $user->id === $entity->id;
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
        return $user->id === $entity->id;
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
        return $user->id === $entity->id;
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
        return false;
    }
}

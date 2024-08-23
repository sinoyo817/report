<?php

declare(strict_types=1);

namespace App\Policy;

use App\Model\Entity\Admin;
use Cake\ORM\Query;

/**
 * Admin policy
 */
class AdminsTablePolicy extends AppTablePolicy
{
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
            return $query->find('ignoreSuperuser');
        }
        return $query->find('empty');
    }
}

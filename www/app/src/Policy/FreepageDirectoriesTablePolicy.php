<?php

declare(strict_types=1);

namespace App\Policy;

use App\Model\Entity\Admin;
use Cake\Datasource\RepositoryInterface;
use Cake\ORM\Query;

/**
 * FreepageDirectoriesTable policy
 */
class FreepageDirectoriesTablePolicy extends AppTablePolicy
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
            $userEntity = $user->getOriginalData();
            if ($userEntity instanceof Admin) {
                return $query->find('createdByAdminOnlyDocument', ['admin' => $user]);
            }
        }
        return $query->find('empty');
    }
}

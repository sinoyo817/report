<?php

declare(strict_types=1);

namespace App\Policy\Medii\File;

use App\Model\Entity\Admin;
use Cake\Datasource\RepositoryInterface;
use Cake\Log\Log;
use Cake\ORM\Query;
use Medii\File\Policy\FilesTablePolicy as PolicyFilesTablePolicy;

/**
 * Files policy
 */
class FilesTablePolicy extends PolicyFilesTablePolicy
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
            if ($user->role === 'Admin') {
                return $query;
            }
        }
        // queryを返す必要あり
        return $query->find('empty');
    }
}

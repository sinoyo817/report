<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;

class AdminsCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $this->value('role');

        $this->value('group_id');

        $this->add('q', 'Search.Like', [
            'before' => true,
            'after' => true,
            'mode' => 'or',
            'comparison' => 'LIKE',
            'wildcardAny' => '*',
            'wildcardOne' => '?',
            'fields' => [
                'Admins.username',
                'Admins.email',
                'Admins.lastname',
                'Admins.firstname',
                'Admins.lastname_kana',
                'Admins.firstname_kana',
                'Admins.tel',
            ],
        ]);
    }
}

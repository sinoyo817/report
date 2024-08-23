<?php

declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * App Entity
 */
class AppEntity extends Entity
{
    protected $_hidden = [
        'password',
        'token',
        'created_by_admin',
        'created_by_user',
        'modified_by_admin',
        'modified_by_user',
    ];

    const dayOfWeekJp = [
        '日', '月', '火', '水', '木', '金', '土'
    ];
}

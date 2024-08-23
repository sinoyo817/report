<?php
declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;

class MasterAreasCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        $this->like('title');
        $this->like('class');
        $this->value('sequence');
        $this->like('status');
        $this->like('public');
        $this->value('created_by_admin');
        $this->value('created_by_user');
        $this->value('modified_by_admin');
        $this->value('modified_by_user');
        $this->value('cid');
    }
}

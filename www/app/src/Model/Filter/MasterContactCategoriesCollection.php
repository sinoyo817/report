<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;

class MasterContactCategoriesCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        $this
            ->add('q', 'Search.Like', [
                'before' => true,
                'after' => true,
                'mode' => 'or',
                'comparison' => 'LIKE',
                'wildcardAny' => '*',
                'wildcardOne' => '?',
                'fields' => ['MasterContactCategories.title']
            ]);
        $this->value('id');
        $this->value('status');
        $this->value('public');
    }
}
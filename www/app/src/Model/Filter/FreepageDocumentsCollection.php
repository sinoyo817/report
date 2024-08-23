<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;

class FreepageDocumentsCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();
        $table = $this->_manager->getRepository()->getAlias();

        $this->add('q', 'Search.Like', [
            'before' => true,
            'after' => true,
            'mode' => 'or',
            'comparison' => 'LIKE',
            'wildcardAny' => '*',
            'wildcardOne' => '?',
            'multiValueSeparator' => ' ',
            // 'valueMode' => 'AND',
            'beforeProcess' => function (\Cake\ORM\Query\SelectQuery $query, array $args, \Search\Model\Filter\Base $filter) {
                if (isset($args['q'])) {
                    $args['q'] = mb_convert_kana($args['q'], 's');
                    return $args;
                }
            },
            'fields' => ["{$table}.searchtext"]
        ]);

        $this->value('id');

        $this->value('status');
        $this->value('public');
    }
}

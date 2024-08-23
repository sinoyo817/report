<?php
declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;
class MasterProductCodesCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
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
            'fields' => [$table->aliasField("searchtext")]
        ]);
        $this->like('title');
            $this->like('code');
            $this->like('can');
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

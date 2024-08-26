<?php
declare(strict_types=1);

namespace App\Model\Filter;
use Cake\ORM\TableRegistry;

use Search\Model\Filter\FilterCollection;

class MasterProductCodesCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {

        $alias = $this->_manager->getRepository()->getAlias();
        $table = TableRegistry::getTableLocator()->get($alias);

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
        $this->value('id');
        $this->value('status');
        $this->value('public');
        // 追加: created_by_admin フィールドのフィルタリング
        $this->value('created_by_admin');
    }
}

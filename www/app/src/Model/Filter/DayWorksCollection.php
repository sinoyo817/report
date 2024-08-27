<?php
declare(strict_types=1);

namespace App\Model\Filter;
use Cake\ORM\TableRegistry;

use Cake\Database\Expression\QueryExpression;
use Cake\ORM\Query\SelectQuery;
use Search\Model\Filter\Base;
use Search\Model\Filter\FilterCollection;

class DayWorksCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

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
        $this->add("start_date", 'Search.Callback', [
            'callback' => function (SelectQuery $query, array $args, Base $filter) use ($table) {
                $query->andWhere(["{$table->getAlias()}.work_date >= " => $args['start_date']]);
                return true;
            }
        ]);
        $this->add("end_date", 'Search.Callback', [
            'callback' => function (SelectQuery $query, array $args, Base $filter) use ($table) {
                $query->andWhere(["{$table->getAlias()}.work_date <= " => $args['end_date']]);
                return true;
            }
        ]);
        $this->like('title');
        $this->value('created_by_admin');
        $this->value('created_by_user');
        $this->value('modified_by_admin');
        $this->value('modified_by_user');
        $this->value('cid');
    }
}

<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Cake\ORM\TableRegistry;
use Search\Model\Filter\FilterCollection;

class MasterTopicCategoriesCollection extends FilterCollection
{
    /**
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $alias = $this->_manager->getRepository()->getAlias();

        $table = TableRegistry::getTableLocator()->get($alias);

        $isForeign = $table->hasBehavior('Translate');

        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        $this
            ->add('q', 'Search.Like', [
                'before' => true,
                'after' => true,
                'mode' => 'or',
                'comparison' => 'LIKE',
                'wildcardAny' => '*',
                'wildcardOne' => '?',
                'beforeProcess' => function (\Cake\ORM\Query\SelectQuery $query, array $args, \Search\Model\Filter\Base $filter) {
                    if (isset($args['q'])) {
                        $args['q'] = mb_convert_kana($args['q'], 's');
                        return $args;
                    }
                },
                'fields' => [$table->$fieldMethod("title")]
            ]);
        $this->value('id', [
            'fields' => $table->$fieldMethod("id"),
            'aliasField' => false,
        ]);
        $this->value('status', [
            'fields' => $table->$fieldMethod("status"),
            'aliasField' => false,
        ]);
        $this->value('public', [
            'fields' => $table->$fieldMethod("public"),
            'aliasField' => false,
        ]);
    }
}

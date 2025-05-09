<?php
declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;use Cake\ORM\TableRegistry;

class MasterGroupsCollection extends FilterCollection
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
            'fields' => [$table->$fieldMethod("searchtext")]
        ]);

        $this->like(
            'title',
            [
                'fields' => $table->$fieldMethod('title'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'email',
            [
                'fields' => $table->$fieldMethod('email'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'mail_body',
            [
                'fields' => $table->$fieldMethod('mail_body'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'status',
            [
                'fields' => $table->$fieldMethod('status'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'public',
            [
                'fields' => $table->$fieldMethod('public'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'created_by_admin',
            [
                'fields' => $table->$fieldMethod('created_by_admin'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'created_by_user',
            [
                'fields' => $table->$fieldMethod('created_by_user'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'modified_by_admin',
            [
                'fields' => $table->$fieldMethod('modified_by_admin'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'modified_by_user',
            [
                'fields' => $table->$fieldMethod('modified_by_user'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'cid',
            [
                'fields' => $table->$fieldMethod('cid'),
                'aliasField' => false,
            ]
        );    }
}

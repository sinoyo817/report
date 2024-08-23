<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Cake\ORM\Query;
use Search\Model\Filter\Base;
use Search\Model\Filter\FilterCollection;
use Cake\Core\Configure;
use Cake\ORM\TableRegistry;

class TopicsCollection extends FilterCollection
{
    /**
     * initialize method
     *
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

        $this->value('id', [
            'fields' => $table->$fieldMethod("id"),
            'aliasField' => false,
        ]);
        $this->value('is_top', [
            'fields' => $table->$fieldMethod("is_top"),
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
        $this->value('master_topic_category_id', [
            'fields' => $table->$fieldMethod("master_topic_category_id"),
            'aliasField' => false,
        ]);
        $this->add("master_topic_categories", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table, $fieldMethod) {

                $params = !is_array($args['master_topic_categories']) ? [$args['master_topic_categories']] : $args['master_topic_categories'];

                if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
                    $query->matching('MasterTopicCategories')
                        ->where(["MasterTopicCategories.id" . " IN " => $params])
                        ->group([$table->$fieldMethod("id")]);
                } else if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
                    $query->where([$table->$fieldMethod("master_topic_category_id") . " IN " => $params]);
                }

                return true;
            }
        ]);
        $this->add("start_date", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table, $fieldMethod) {
                $startDataField = $table->$fieldMethod("start_date");
                $endDataField = $table->$fieldMethod("end_date");
                $query->andWhere([
                    'OR' => [
                        [
                            [$startDataField  . ' <= ' => $args['start_date']],
                            [$endDataField . ' >= ' => $args['start_date']],
                        ], [
                            [$startDataField . ' <= ' => $args['start_date']],
                            [$endDataField . ' IS ' => null],
                        ], [
                            [$startDataField . ' >= ' => $args['start_date']],
                        ], [
                            [$startDataField . ' IS ' => null],
                            [$endDataField . ' >= ' => $args['start_date']],
                        ], [
                            [$startDataField . ' IS ' => null],
                            [$endDataField . ' IS ' => null],
                        ]
                    ]
                ]);
                return true;
            }
        ]);
        $this->add("end_date", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table, $fieldMethod) {
                $startDataField = $table->$fieldMethod("start_date");
                $endDataField = $table->$fieldMethod("end_date");
                $query->andWhere([
                    'OR' => [
                        [
                            [$endDataField . ' <= ' => $args['end_date']],
                        ], [
                            [$startDataField . ' <= ' => $args['end_date']],
                            [$endDataField . ' >= ' => $args['end_date']],
                        ], [
                            [$startDataField  . ' IS ' => null],
                            [$endDataField . ' >= ' => $args['end_date']],
                        ], [
                            [$startDataField  . ' <= ' => $args['end_date']],
                            [$endDataField . ' IS ' => null],
                        ], [
                            [$startDataField  . ' IS ' => null],
                            [$endDataField . ' IS ' => null],
                        ]
                    ]
                ]);
                return true;
            }
        ]);
    }
}

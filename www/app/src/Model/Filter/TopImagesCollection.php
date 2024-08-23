<?php
declare(strict_types=1);

namespace App\Model\Filter;

use Search\Model\Filter\FilterCollection;use Cake\ORM\TableRegistry;

class TopImagesCollection extends FilterCollection
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
        $this->value(
            'image_id',
            [
                'fields' => $table->$fieldMethod('image_id'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'image_alt',
            [
                'fields' => $table->$fieldMethod('image_alt'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'url',
            [
                'fields' => $table->$fieldMethod('url'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'url_is_blank',
            [
                'fields' => $table->$fieldMethod('url_is_blank'),
                'aliasField' => false,
            ]
        );
        $this->value(
            'sp_image_id',
            [
                'fields' => $table->$fieldMethod('sp_image_id'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'sp_image_alt',
            [
                'fields' => $table->$fieldMethod('sp_image_alt'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'sp_url',
            [
                'fields' => $table->$fieldMethod('sp_url'),
                'aliasField' => false,
            ]
        );
        $this->like(
            'sp_url_is_blank',
            [
                'fields' => $table->$fieldMethod('sp_url_is_blank'),
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

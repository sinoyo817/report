<?php

declare(strict_types=1);

namespace App\Model\Filter;

use Cake\Core\Configure;
use Cake\Database\Expression\QueryExpression;
use Cake\ORM\Query;
use Search\Model\Filter\Base;
use Search\Model\Filter\FilterCollection;

class EventsCollection extends FilterCollection
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
        $this->value('is_top');
        $this->value('status');
        $this->value('public');
        $this->value('master_area_id');

        $this->add("areas", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {

                $params = !is_array($args['areas']) ? [$args['areas']] : $args['areas'];



                if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
                    $query->matching('MasterAreas')
                        ->where(["MasterAreas.id" . " IN " => $params])
                        ->group(["{$table}.id"]);
                } else if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
                    $query->where(["{$table}.master_area_id" . " IN " => $params]);
                }
                return true;
            }
        ]);

        $this->value('master_event_category_id');
        $this->add("master_event_categories", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {

                $params = !is_array($args['master_event_categories']) ? [$args['master_event_categories']] : $args['master_event_categories'];

                if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
                    $query->matching('MasterEventCategories')
                        ->where(["MasterEventCategories.id" . " IN " => $params])
                        ->group(["{$table}.id"]);
                } else if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
                    $query->where(["{$table}.master_event_category_id" . " IN " => $params]);
                }

                return true;
            }
        ]);

        $this->add("event_dates", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {


                $params = explode(",", $args['event_dates']);

                $query->where(function (QueryExpression $exp, Query $q) use ($params, $table) {
                    $in = [];
                    // $in[] = $q->leftJoinWith('EventDates')->newExpr()->add(["EventDates.date" . " IN " => $params]);

                    foreach ($params as $param) {
                        $in[] = $q->newExpr()->and(["{$table}.event_start_date <= " => $param, "{$table}.event_end_date >= " => $param,]);
                    }

                    return $exp->Or($in);
                })->group(["{$table}.id"]);

                return true;
            }
        ]);

        $this->add("start_date", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {
                $query->andWhere([
                    'OR' => [
                        [
                            ["{$table}.start_date" . ' <= ' => $args['start_date']],
                            ["{$table}.end_date" . ' >= ' => $args['start_date']],
                        ], [
                            ["{$table}.start_date" . ' <= ' => $args['start_date']],
                            ["{$table}.end_date" . ' IS ' => null],
                        ], [
                            ["{$table}.start_date" . ' >= ' => $args['start_date']],
                        ], [
                            ["{$table}.start_date" . ' IS ' => null],
                            ["{$table}.end_date" . ' >= ' => $args['start_date']],
                        ], [
                            ["{$table}.start_date" . ' IS ' => null],
                            ["{$table}.end_date" . ' IS ' => null],
                        ]
                    ]
                ]);
                return true;
            }
        ]);
        $this->add("end_date", 'Search.Callback', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {
                $query->andWhere([
                    'OR' => [
                        [
                            ["{$table}.end_date" . ' <= ' => $args['end_date']],
                        ], [
                            ["{$table}.start_date" . ' <= ' => $args['end_date']],
                            ["{$table}.end_date" . ' >= ' => $args['end_date']],
                        ], [
                            ["{$table}.start_date"  . ' IS ' => null],
                            ["{$table}.end_date" . ' >= ' => $args['end_date']],
                        ], [
                            ["{$table}.start_date"  . ' <= ' => $args['end_date']],
                            ["{$table}.end_date" . ' IS ' => null],
                        ], [
                            ["{$table}.start_date"  . ' IS ' => null],
                            ["{$table}.end_date" . ' IS ' => null],
                        ]
                    ]
                ]);
                return true;
            }
        ]);

        $this->callback('event_start_date', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {
                if ($args['event_start_date']) {
                    if (isset($args['event_end_date']) && $args['event_end_date']) {
                        $query->where([
                            [
                                'OR' => [
                                    // ["{$table}.event_start_date" . ' >= ' => $args['event_start_date']],
                                    // ["{$table}.event_start_date" . ' IS ' => null, "{$table}.event_end_date" . ' IS ' => null],
                                    [
                                        "{$table}.event_start_date" . ' <= ' => $args['event_start_date'],
                                        "{$table}.event_end_date" . ' >= ' => $args['event_start_date'],
                                    ],
                                    [
                                        "{$table}.event_start_date" . ' >= ' => $args['event_start_date'],
                                        "{$table}.event_end_date" . ' <= ' => $args['event_end_date'],
                                    ],
                                    [
                                        "{$table}.event_start_date" . ' <= ' => $args['event_end_date'],
                                        "{$table}.event_end_date" . ' >= ' => $args['event_end_date'],
                                    ],
                                    // [
                                    //     "{$table}.event_start_date" . ' IS ' => null,
                                    //     "{$table}.event_end_date" . ' >= ' => $args['event_start_date'],
                                    //     "{$table}.event_end_date" . ' >= ' => $args['event_end_date'],
                                    // ],
                                ],
                            ],
                        ]);
                    } else {
                        $query->where([
                            [
                                'OR' => [
                                    ["{$table}.event_start_date" . ' >= ' => $args['event_start_date']],
                                    // ["{$table}.event_start_date" . ' IS ' => null],
                                    [
                                        "{$table}.event_start_date" . ' <= ' => $args['event_start_date'],
                                        "{$table}.event_end_date" . ' >= ' => $args['event_start_date'],
                                    ],
                                ],
                            ],
                        ]);
                    }
                }
                return true;
            }
        ]);
        $this->callback('event_end_date', [
            'callback' => function (Query $query, array $args,  Base $filter) use ($table) {
                if ($args['event_end_date']) {
                    if (isset($args['event_start_date']) && $args['event_start_date']) {
                    } else {
                        $query->where([
                            [
                                'OR' => [
                                    ["{$table}.event_end_date" . ' <= ' => $args['event_end_date']],
                                    // ["{$table}.event_end_date" . ' IS ' => null],
                                    [
                                        "{$table}.event_start_date" . ' <= ' => $args['event_end_date'],
                                        "{$table}.event_end_date" . ' >= ' => $args['event_end_date'],
                                    ],
                                ]
                            ],
                        ]);
                    }
                }
                return true;
            }
        ]);
    }
}

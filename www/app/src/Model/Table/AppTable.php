<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\Chronos\Chronos;
use Cake\ORM\Query;
use Cake\ORM\Table;
use Cake\Datasource\EntityInterface;

/**
 * AppTable
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class AppTable extends Table
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->addBehavior('Timestamp');
        $this->addBehavior('Search.Search');

        $this->addBehavior('Muffin/Footprint.Footprint', [
            'events' => [
                'Model.beforeSave' => [
                    'created_by_admin' => 'new',
                    'created_by_user' => 'new',
                    'modified_by_admin' => 'always',
                    // 'modified_by_city' => 'always',
                    'modified_by_user' => 'always',
                ]
            ],
            'propertiesMap' => [
                'created_by_admin' => '_footprint.admin_id',
                'created_by_user' => '_footprint.user_id',
                'modified_by_admin' => '_footprint.admin_id',
                // 'modified_by_city' => '_footprint.master_city_id',
                'modified_by_user' => '_footprint.user_id',
            ],
        ]);
    }

    /**
     * findCreatedByAdmin method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findCreatedByAdmin(Query $query, array $options)
    {
        $admin = $options['admin'];
        return $query->where(["{$this->_alias}.created_by_admin" => $admin->admin_id]);
    }

    /**
     * findCreatedByUser method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findCreatedByUser(Query $query, array $options)
    {
        $admin = $options['admin'];
        return $query->where(["{$this->_alias}.created_by_user" => $admin->user_id]);
    }

    /**
     * findPublic method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findPublic(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->where([$this->$fieldMethod("public") => 'published']);
    }

    /**
     * findPublicPeriod method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findPublicPeriod(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        $now = new Chronos();

        $start = $now->format('Y-m-d');
        $end = $now->format('Y-m-d');

        return $query->where([
            [
                $this->$fieldMethod("public") => 'published'
            ],
            [
                'OR' => [
                    [$this->$fieldMethod("start_date") . ' <= ' => $start],
                    [$this->$fieldMethod("start_date") . ' IS ' => null]
                ]
            ],
            [
                'OR' => [
                    [$this->$fieldMethod("end_date") . ' >= ' => $end],
                    [$this->$fieldMethod("end_date") . ' IS' => null]
                ],
            ]
        ]);
    }

    /**
     * findPublicPeriod method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findPublicPeriodDatetime(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        $now = new Chronos();

        $start = $now->format('Y-m-d H:i:s');
        $end = $now->format('Y-m-d H:i:s');

        return $query->where([
            [
                $this->$fieldMethod("public") => 'published'
            ],
            [
                'OR' => [
                    [$this->$fieldMethod("start_date") . ' <= ' => $start],
                    [$this->$fieldMethod("start_date") . ' IS ' => null]
                ]
            ],
            [
                'OR' => [
                    [$this->$fieldMethod("end_date") . ' >= ' => $end],
                    [$this->$fieldMethod("end_date") . ' IS' => null]
                ],
            ]
        ]);
    }

    /**
     * findEmpty method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findEmpty(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->where([$this->$fieldMethod("id") . " IS NULL"]);
    }

    /**
     * findOrderByDefault method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findOrderByDefault(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->order([
            $this->$fieldMethod("published") => 'DESC',
            $this->$fieldMethod("modified") => 'DESC',
        ]);
    }
    /**
     * findOrderByModified method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findOrderByModified(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->order([
            $this->$fieldMethod("modified") => 'DESC',
        ]);
    }

    /**
     * findPublic method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findIsTop(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->where([$this->$fieldMethod("is_top") => "yes"]);
    }

    /**
     * findOrderByTagAndPublished method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findOrderByTagAndPublished(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->order([
            $this->$fieldMethod("is_top") => 'DESC',
            $this->$fieldMethod("published") => 'DESC',
        ]);
    }

    /**
     * findOrderByTagAndPublished method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findOrderByTagAndModified(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        return $query->order([
            $this->$fieldMethod("is_top") => 'DESC',
            $this->$fieldMethod("modified") => 'DESC',
        ]);
    }

    /**
     * findEmpty method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findIgnoreId(Query $query, array $options)
    {
        $isForeign = $this->hasBehavior('Translate');
        $fieldMethod = $isForeign ? 'translationField' : 'aliasField';

        if (isset($options['id'])) {
            return $query->where([$this->$fieldMethod("id") . " != " => $options['id']]);
        }
        return $query;
    }

    public function reOrder(array $findOptions = [])
    {
        if ($this->hasBehavior('Sequence')) {
            $sequenceBehaviorConfig = $this->getBehavior('Sequence')->getConfig();
            $this->removeBehavior('Sequence');
            $orders = [];
            if ($sequenceBehaviorConfig['scope']) {
                $scope =  $sequenceBehaviorConfig['scope'];
                $orders = $scope;
            }
            $order = $sequenceBehaviorConfig["sequenceField"];
            $orders[] = $order;
            $all = $this->find("all", $findOptions + ["order" => $orders]);
            $tmp = [];
            foreach ($all as $v) {
                $key  = "all";
                if (!empty($scope)) {
                    foreach ($scope as $s) {
                        $key .= $v->{$s};
                    }
                }
                if (!array_key_exists($key, $tmp)) {
                    $tmp[$key] = 1;
                }
                $seq = $tmp[$key]++;
                $primaryKey = $this->getPrimaryKey();
                $this->updateAll(['sequence' => $seq], [$primaryKey => $v->{$primaryKey}]);
            }
            if ($this->hasBehavior('Approval') && $this->getApprovalMode() == 'Private') {
                $this->changePublic();
                $table_name = $this->getTable();
                $q = $this->updateQuery()
                    ->update("{$table_name} t, {$table_name}_private p")
                    ->set(['t.sequence = p.sequence'])
                    ->where(
                        function ($exp, $q) {
                            return $exp->add('t.id = p.id');
                        }
                    )
                    ->execute();
                $this->changePrivate();
            }
            $this->addBehavior('ADmad/Sequence.Sequence', $sequenceBehaviorConfig);
        }
    }

    // 新規記事を一番前に持ってっ来る関数
    // afterSaveにすると公開処理時にもisNew判定で動いてしまうので、関数にして適宜addから呼ぶ
    public function changeSequence(EntityInterface $entity)
    {
        //新規登録時
        if ($this->getApprovalMode() == 'Private' && $entity->isNew()) {
            //idあれば
            if ($entity->id) {
                //id配列に入れる
                $reorder = [$entity->id];
                // 該当記事以外のidを配列で取る
                $ids = $this->find()
                    ->select(['id'])
                    ->where(['id NOT IN'=>[$entity->id]])
                    ->order([
                        'sequence'=>'ASC',
                        'modified'=>'DESC'
                    ])
                    ->all()
                    ->extract('id')
                    ->toArray();

                //他記事あればid入れた配列渡してsetOrderで並び替え
                if (!empty($ids)) {
                    $reorders =  array_merge($reorder, $ids);
                    $this->setOrder(
                        $reorders
                    );
                }
            }
        }
    }

}

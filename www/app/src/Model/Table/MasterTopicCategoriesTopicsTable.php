<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterTopicCategories Model
 *
 * @property \App\Model\Table\TopicsTable&\Cake\ORM\Association\BelongsToMany $Topics
 * @property \App\Model\Table\TopicsPrivateTable&\Cake\ORM\Association\BelongsToMany $TopicsPrivate
 *
 * @method \App\Model\Entity\MasterTopicCategory newEmptyEntity()
 * @method \App\Model\Entity\MasterTopicCategory newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterTopicCategory get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterTopicCategory|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterTopicCategory[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterTopicCategoriesTopicsTable extends AppTable
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

        $this->setTable('master_topic_categories_topics');
    }
}

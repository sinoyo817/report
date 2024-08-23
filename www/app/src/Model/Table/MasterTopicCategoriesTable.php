<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\Core\Configure;
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
class MasterTopicCategoriesTable extends AppTable
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

        $this->setTable('master_topic_categories');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->addBehavior('Translate', [
                'allowEmptyTranslations' => true,
                'strategyClass' => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class,
            ]);
        }

        $this->addBehavior('ADmad/Sequence.Sequence', [
            'sequenceField' => 'sequence',
        ]);

        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => [
                $this
            ],
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->scalar('title')
            ->maxLength('title', 255)
            ->notEmptyString('title', '※タイトルを入力してください');

        return $validator;
    }
}

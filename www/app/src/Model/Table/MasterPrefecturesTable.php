<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterPrefectures Model
 *
 * @method \App\Model\Entity\MasterPrefecture newEmptyEntity()
 * @method \App\Model\Entity\MasterPrefecture newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterPrefecture[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterPrefecture get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterPrefecture findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterPrefecture patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterPrefecture[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterPrefecture|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterPrefecture saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterPrefecture[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterPrefecture[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterPrefecture[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterPrefecture[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterPrefecturesTable extends AppTable
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

        $this->setTable('master_prefectures');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadatas' => false,
            ],
        ]);
        $this->addBehavior('Medii/File.File', [
            'fileIdFields' => [
                'fields' => [],
            ],
            'commonAssociation' => [
                'blocks' => false,
                'metadata' => false,
            ],
        ]);
        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => [],
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
            ->allowEmptyString('title')
            ->add('title', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
            ->integer('sequence')
            ->allowEmptyString('sequence');

        $validator
            ->scalar('note')
            ->allowEmptyString('note');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->isUnique(['title'], ['allowMultipleNulls' => true]), ['errorField' => 'title']);

        return $rules;
    }
}

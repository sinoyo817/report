<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterContactCategories Model
 *
 * @property \App\Model\Table\MasterContactCategoriesContactsTable&\Cake\ORM\Association\HasMany $MasterContactCategoriesContacts
 *
 * @method \App\Model\Entity\MasterContactCategory newEmptyEntity()
 * @method \App\Model\Entity\MasterContactCategory newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterContactCategory[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterContactCategory get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterContactCategory findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterContactCategory patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterContactCategory[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterContactCategory|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterContactCategory saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterContactCategory[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterContactCategory[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterContactCategory[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterContactCategory[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterContactCategoriesTable extends AppTable
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

        $this->setTable('master_contact_categories');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('ADmad/Sequence.Sequence', [
            'sequenceField' => 'sequence',
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
            ->notEmptyString('title', '※タイトルを入力してください');

        return $validator;
    }
}

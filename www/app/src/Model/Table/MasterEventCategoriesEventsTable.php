<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterEventCategoriesEvents Model
 *
 * @property \App\Model\Table\EventsTable&\Cake\ORM\Association\BelongsTo $Events
 * @property \App\Model\Table\MasterEventCategoriesTable&\Cake\ORM\Association\BelongsTo $MasterEventCategories
 *
 * @method \App\Model\Entity\MasterEventCategoriesEvent newEmptyEntity()
 * @method \App\Model\Entity\MasterEventCategoriesEvent newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategoriesEvent[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterEventCategoriesEventsTable extends AppTable
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

        $this->setTable('master_event_categories_events');
    }
}

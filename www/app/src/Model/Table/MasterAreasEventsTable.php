<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterAreasEvents Model
 *
 * @property \App\Model\Table\EventsTable&\Cake\ORM\Association\BelongsTo $Events
 * @property \App\Model\Table\MasterAreasTable&\Cake\ORM\Association\BelongsTo $MasterAreas
 *
 * @method \App\Model\Entity\MasterAreasEvent newEmptyEntity()
 * @method \App\Model\Entity\MasterAreasEvent newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterAreasEvent get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterAreasEvent|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterAreasEvent[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterAreasEventsTable extends AppTable
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

        $this->setTable('master_areas_events');
    }
}

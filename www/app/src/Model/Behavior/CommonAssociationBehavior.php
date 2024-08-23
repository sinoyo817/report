<?php

declare(strict_types=1);

namespace App\Model\Behavior;

use Cake\Core\Configure;
use Cake\ORM\Behavior;

/**
 * CommonAssociation Behavior
 *
 * メインテーブル用
 *
 */
class CommonAssociationBehavior extends Behavior
{

    /**
     * メインテーブルエイリアス
     *
     * @var string
     */
    protected $modelAlias;

    /**
     * Default configuration.
     *
     * @var array<string, mixed>
     */
    protected $_defaultConfig = [
        'isAssociation' => [
            'blocks' => true,
            'metadatas' => true,
        ],
    ];

    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->modelAlias = $this->_table->getAlias();

        $isBlocks = $this->getConfig('isAssociation.blocks');
        if ($isBlocks) {
            $this->_table->hasMany("Blocks")
                ->setClassName('Medii/Block.Blocks')
                ->setForeignKey('foreign_id')
                ->setDependent(true)
                ->setCascadeCallbacks(true)
                ->setSaveStrategy('replace')
                ->setConditions(['Blocks.model' => $this->modelAlias])
                ->setSort(['sequence' => 'asc']);

            $BlocksTable = $this->_table->getAssociation('Blocks')->getTarget();

            $BlocksTable->addBehavior('CustomBlock');

            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $BlocksTable->addBehavior('Translate', [
                    'allowEmptyTranslations' => true,
                    'strategyClass' => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class,
                ]);
            }

            $BlocksTable->belongsTo('File01')
                ->setClassName('Medii/File.Files')
                ->setForeignKey('file01_id')
                ->setConditions(['File01.model' => $this->modelAlias])
                ->setDependent(false);

            $BlocksTable->belongsTo('File02')
                ->setClassName('Medii/File.Files')
                ->setForeignKey('file02_id')
                ->setConditions(['File02.model' => $this->modelAlias])
                ->setDependent(false);

            $BlocksTable->belongsTo('File03')
                ->setClassName('Medii/File.Files')
                ->setForeignKey('file03_id')
                ->setConditions(['File03.model' => $this->modelAlias])
                ->setDependent(false);
        }

        $isMetadatas = $this->getConfig('isAssociation.metadatas');
        if ($isMetadatas) {
            $this->_table->hasOne("Metadatas")
                ->setClassName('Medii/Metadata.Metadatas')
                ->setForeignKey('id')
                ->setDependent(true)
                ->setCascadeCallbacks(true)
                ->setConditions(['Metadatas.model' => $this->modelAlias]);

            $MetadatasTable = $this->_table->getAssociation('Metadatas')->getTarget();

            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $MetadatasTable->addBehavior('Translate', [
                    'allowEmptyTranslations' => true,
                    'strategyClass' => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class,
                ]);
            }

            $MetadatasTable->belongsTo('Files')
                ->setClassName('Medii/File.Files')
                ->setForeignKey('file_id')
                ->setConditions(['Files.model' => $this->modelAlias])
                ->setDependent(false);
        }
    }
}

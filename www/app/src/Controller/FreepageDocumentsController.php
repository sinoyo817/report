<?php

declare(strict_types=1);

namespace App\Controller;

use Cake\Core\Configure;
use Cake\Http\Exception\NotFoundException;
use Medii\Crud\Interfaces\ReadInterface;

/**
 * FreepageDocuments Controller
 *
 * @property \App\Model\Table\FreepageDocumentsTable $FreepageDocuments
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class FreepageDocumentsController extends AppController
{
    protected $defaultTable = 'FreepageDocuments';

    public $paginate = [
        'limit' => 20,
    ];

    /**
     * Detail method
     *
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function detail()
    {
        $path = $this->request->getParam('path');
        $path = preg_replace("&//&", "/", preg_match("&\.html&", $path) ? $path : $path . "/index.html");

        $path = pathinfo($path);
        $path = sprintf("%s/%s", $path["dirname"], $path["filename"]);
        $path = preg_replace("&^\./&", "", $path);

        $dirTable = $this->fetchTable('FreepageDirectories');

        $documentDir = $dirTable->find('search', [
            'search' => [
                'type' => Configure::read('Site.Settings.FreepageTypeKey.documentKey'),
                'path_url' => $path,
            ]
        ])->firstOrFail();

        $parents = $dirTable->find('path', ['for' => $documentDir->parent_id]);
        foreach ($parents as $p) {
            if ($p->public === Configure::read('Approvals.allStatusKey.unpublishedKey')) {
                throw new NotFoundException();
            }
        }

        $table = $this->fetchTable();
        $data = $table->find('publicPeriodDatetime')->find('search', [
            'search' => [
                'id' => $documentDir->freepage_document_id,
            ]
        ])->contain([
            'Blocks', 'Blocks.File01', 'Blocks.File02', 'Metadatas', 'Metadatas.Files', 'FreepageDirectories'
        ])->firstOrFail();

        $this->set(compact('data'));
    }
}

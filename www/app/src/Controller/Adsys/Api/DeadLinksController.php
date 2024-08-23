<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use Cake\Core\Configure;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * DeadLinks Controller
 *
 * @method \App\Model\Entity\DeadLink[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class DeadLinksController extends AppController
{
    protected $defaultTable = 'DeadLinks';

    public $paginate = [
        'limit' => 20,
    ];

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        // $associated = [];
        // $search->setfindOptions(['contain' => $associated]);
        $this->set('data', $search->search($this));
    }

    /**
     * Metadata method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function metadata()
    {
        $data = [];

        $json = file_get_contents(Configure::read('Master.DeadLinkFilePath'));
        if ($json) {
            $data['exec'] = json_decode($json);
        }

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }
}

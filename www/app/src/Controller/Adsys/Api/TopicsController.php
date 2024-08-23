<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\Topic;
use App\Model\Filter\TopicsCollection;
use App\Model\Table\MasterTopicCategoriesTable;
use ArrayObject;
use Cake\Chronos\Chronos;
use Cake\Collection\Collection;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\Http\CallbackStream;
use Cake\I18n\I18n;
use Cake\Log\Log;
use Cake\Mailer\MailerAwareTrait;
use Cake\ORM\Query;
use Cake\Utility\Hash;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv as WriterCsv;

/**
 * Topics Controller
 *
 * @property \App\Model\Table\TopicsTable $Topics
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class TopicsController extends AppController
{
    use MailerAwareTrait;

    protected $defaultTable = 'Topics';

    public $paginate = [
        'limit' => 20,
        'order' => [
            'Topics.created' => 'DESC',
            'Topics.modified' => 'DESC',
        ],
    ];

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = [];
        $associated[] = 'CreateAdmins';
        $associated[] = 'ModifiedAdmins';

        if (Configure::read('CustomSettings.Topics.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $associated[] = 'CreateUsers';
            $associated[] = 'ModifiedUsers';
            $associated[] = 'ApprovalRemands';
            $associated[] = 'ApprovalRemands.CreateAdmins';
        }
        // カテゴリ
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterTopicCategories";
        }

        $search->setfindOptions(['contain' => $associated]);

        $this->set('data', $search->search($this));
    }

    /**
     * Add method
     *
     * @param \Medii\Crud\Interfaces\CreateInterface $create
     * @return \Cake\Http\Response|null|void Redirects on successful add, renders view otherwise.
     */
    public function add(CreateInterface $create)
    {
        $associated = ['Blocks', 'Metadatas'];
        // カテゴリ複数
        if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterTopicCategories";
        }
        $create->setPatchEntityOptions([
            'associated' => $associated
        ]);

        $user = $this->Authentication->getIdentity();

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_topic_categories']) && !isset($data['master_topic_categories']['_ids'])
            ) {
                $data['master_topic_categories']['_ids'] = $data['master_topic_categories'];
            }
        });
        $table->getEventManager()->on('Model.beforeSave', function (EventInterface $event, EntityInterface $entity) use ($user) {

            if ($entity instanceof Topic) {
                $entity->status = 'draft';
                $now = new Chronos();
                if ($user->role === 'Admin') {
                    $entity->modified_admin = $now->format('Y-m-d H:i:s');
                } else {
                    $entity->modified_user = $now->format('Y-m-d H:i:s');
                }
            }
        });

        $this->set('data', $create->save($this));
    }

    /**
     * Edit method
     *
     * @param \Medii\Crud\Interfaces\UpdateInterface $update
     * @return \Cake\Http\Response|null|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit(UpdateInterface $update)
    {
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $locale = $this->getRequest()->getQuery('locale');
            $isForeign = $locale && $locale !== I18n::getDefaultLocale();
        }
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        // カテゴリ複数
        if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterTopicCategories";
            $patchAssociated[] = "MasterTopicCategories";
        }

        $update->setfindOptions(['contain' => $findAssociated]);
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $update->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => $isForeign ? 'locale' : 'default',
            ]);
        } else {
            $update->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => 'default',
            ]);
        }


        $user = $this->Authentication->getIdentity();

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_topic_categories']) && !isset($data['master_topic_categories']['_ids'])
            ) {
                $data['master_topic_categories']['_ids'] = $data['master_topic_categories'];
            }
        });

        $table->getEventManager()->on('Model.afterMarshal', function (EventInterface $event, EntityInterface $entity, $data, $options) {

            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $isForeignExists = $event->getData('options')['isForeignExists'] ?? true;
                $originalEntity = $event->getData('options')['originalEntity'] ?? [];

                // created_by_adminが無いとPolicyに引っかかるため追加
                if (!$isForeignExists && $originalEntity) {
                    $now = new Chronos();
                    $entity->created_by_admin = $originalEntity->created_by_admin;
                    $entity->created_by_user = $originalEntity->created_by_user;
                    $entity->public = "unpublished";
                    $entity->created = $now->format('Y-m-d H:i:s');
                    $entity->modified = $now->format('Y-m-d H:i:s');
                }
            }
        });

        // TranslateBehaviorのbeforeSaveより先に実行させる
        $table->getEventManager()->on('Model.beforeSave', ['priority' => 3], function (EventInterface $event, EntityInterface $entity) use ($user) {
            if ($entity instanceof Topic) {
                $entity->status = 'draft';
                $now = new Chronos();
                if ($user->role === 'Admin') {
                    $entity->modified_admin = $now->format('Y-m-d H:i:s');
                } else {
                    $entity->modified_user = $now->format('Y-m-d H:i:s');
                }
            }
        });

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $update->ignoreAddDefaultLocaleData();
        }

        $this->set('data', $update->save($this));
    }

    /**
     * Confirm method
     *
     * @param \Medii\Crud\Interfaces\ConfirmInterface $confirm
     * @return \Cake\Http\Response|null|void Redirects on successful confirm, renders view otherwise.
     */
    public function confirm(ConfirmInterface $confirm)
    {
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $locale = $this->getRequest()->getQuery('locale');
            $isForeign = $locale && $locale !== I18n::getDefaultLocale();
        }
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        // カテゴリ複数
        if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterTopicCategories";
            $patchAssociated[] = "MasterTopicCategories";
        }
        // カテゴリ単一
        else if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
            $findAssociated[] = "MasterTopicCategories";
        }

        // // サムネイル
        // if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
        //     $findAssociated[] = "Files";
        // }


        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_topic_categories']) && !isset($data['master_topic_categories']['_ids'])
            ) {
                $data['master_topic_categories']['_ids'] = $data['master_topic_categories'];
            }
        });

        $confirm->setfindOptions(['contain' => $findAssociated]);
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $confirm->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => $isForeign ? 'locale' : 'default',
            ]);

            $confirm->ignoreAddDefaultLocaleData();
        } else {
            $confirm->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => 'default',
            ]);
        }

        $this->set('data', $confirm->confirm($this));
    }

    /**
     * View method
     *
     * @param \Medii\Crud\Interfaces\ReadInterface $read
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view(ReadInterface $read)
    {
        $associated = ['Blocks' => function (Query $q) {
            // 多言語のデータが無いときに並び順が変わってしまうため、元データの並び順で並び替える
            return $q->orderAsc('Blocks.sequence', true);
        }, 'Metadatas'];

        // カテゴリ
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterTopicCategories";
        }
        // サムネイル
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $associated[] = "Files";
        }
        $read->setfindOptions(['contain' => $associated]);

        $this->set('data', $read->read($this));
    }

    /**
     * Preview method
     *
     * @param \Medii\Crud\Interfaces\PreviewInterface $preview
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function preview(PreviewInterface $preview)
    {
        $associated = ['Blocks', 'Blocks.File01', 'Blocks.File02', 'Metadatas', 'Metadatas.Files'];

        // カテゴリ
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterTopicCategories";
        }
        // サムネイル
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $associated[] = "Files";
        }
        $preview->setfindOptions(['contain' => $associated]);

        return  $preview->preview($this);
    }

    /**
     * Status method
     *
     * @param \Medii\Crud\Interfaces\StatusInterface $status
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function status(StatusInterface $status)
    {
        if (Configure::read('CustomSettings.Topics.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->AdminUtility->approvalMail(send: Configure::read('Site.Settings.Release'), roles: ['Editor'], content: 'お知らせ');
        }

        $associated = ['Blocks', 'Metadatas'];
        if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterTopicCategoriesTopics";
        }
        $status->setStatusOptions(['copyAssociated' => $associated, 'contents' => 'Topics', 'copyChangeFields' => ['slug']]);

        $this->set('data', $status->status($this));
    }

    /**
     * Metadata method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function metadata()
    {

        $data = [];
        $data['settings'] = Configure::read('CustomSettings.Topics');

        // カテゴリマスタ
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $table = $this->fetchTable('MasterTopicCategories');
            $categories = $table->find()->find('public')->select(['id', 'title']);
            $data['master_topic_categories'] = $categories;
        }

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }

    /**
     * csvDownload method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function csvDownload()
    {

        $spreadsheet = new Spreadsheet();

        $this->setCsvData($spreadsheet);

        // $writer = new Xlsx($spreadsheet);

        $writer = new WriterCsv($spreadsheet);
        $writer->setUseBOM(false);
        $writer->setOutputEncoding('SJIS-WIN');
        $writer->setEnclosure('"');

        // Save the file in a stream
        $stream = new CallbackStream(function () use ($writer) {
            $writer->save('php://output');
        });


        $filename = 'News_' . date('YmdHis');
        $response = $this->response;

        // Return the stream in a response
        return $response->withType('csv')
            ->withHeader('Content-Disposition', "attachment;filename=\"{$filename}.csv\"")
            ->withBody($stream);
    }
    /**
     * setCsvData function
     *
     * @param \PhpOffice\PhpSpreadsheet\Spreadsheet $spreadsheet
     * @return void
     */
    private function setCsvData($spreadsheet)
    {

        $sheet = $spreadsheet->getActiveSheet();

        $sheet->fromArray($this->_getHeaderCell(), null, 'A1', true);
        $this->_getBodyCell($sheet);
        // $sheet->fromArray($this->_getBodyCell(), null, 'A2', true);
    }

    private function _getHeaderCell()
    {
        $header = [];

        foreach (range('A', 'H') as $col) {
            $header[] = $this->_getCellData($col, true);
        }

        return $header;
    }

    /**
     * _getBodyCell function
     *
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return void
     */
    private function _getBodyCell($sheet)
    {

        $role = $this->Authentication->getIdentityData('role');
        $roleData = Configure::read("Roles." . $role) ?? [];

        if (!$roleData) {
            return;
        }
        $statusOptionKey = $roleData['statusOptions']['topics'] ?? $roleData['statusOptions']['default'];
        $statusOption = Configure::read("Approvals.allStatusOption." . $statusOptionKey);
        $statusOption = Hash::combine($statusOption, '{n}.status', '{n}.title');

        $associated = [
            'CreateAdmins',
            'CreateUsers',
        ];

        $table = $this->fetchTable();
        $query = $this->Authorization->applyScope($table->find('search', [
            'search' => $this->request->getQueryParams(),
            'collection' => TopicsCollection::class
        ])->contain($associated)->order(['Topics.created' => 'desc', 'Topics.modified' => 'desc']), 'index');

        /** @var \App\Model\Entity\Topic[] $data  */
        $data = $query->all()->toArray();

        if ($data) {
            $index = 2;
            foreach ($data as $d) {

                foreach (range('A', 'H') as $col) {
                    $field = $this->_getCellData($col);
                    if ($field) {
                        if (strpos($field, '.') !== false) {
                            $split = explode('.', $field);
                            if (isset($split[0]) && $d->{$split[0]}) {
                                $sheet->setCellValue("{$col}{$index}", $d->{$split[0]}->{$split[1]});
                            }
                        } else {
                            $sheet->setCellValue("{$col}{$index}", $d->{$field});
                        }
                    } else {
                        if ($col === 'C') {
                            $sheet->setCellValue("{$col}{$index}", $statusOption[$d->status] ?? "");
                        }
                        if ($col === 'D') {
                            $sheet->setCellValue("{$col}{$index}", $statusOption[$d->public] ?? "");
                        }
                        if ($col === 'E') {
                            $sheet->setCellValue("{$col}{$index}", $d->published->format('Y/m/d') ?? "");
                        }
                        if ($col === 'F') {
                            $open = '常時公開';
                            if ($d->start_date && $d->end_date) {
                                $open = $d->start_date->format('Y/m/d') . '~' . $d->end_date->format('Y/m/d');
                            } elseif ($d->start_date) {
                                $open = $d->start_date->format('Y/m/d') . '~';
                            } elseif ($d->end_date) {
                                $open = '~' . $d->end_date->format('Y/m/d');
                            }
                            $sheet->setCellValue("{$col}{$index}", $open);
                        }
                    }
                }


                $index++;
            }
        }
    }

    protected function _getCellData($col, $isHeader = false,)
    {
        $ret = null;
        switch ($col) {
            case "A":
                $ret = $isHeader ? 'ID' : 'cid';
                break;
            case "B":
                $ret = $isHeader ? 'タイトル' : 'title';
                break;
            case "C":
                $ret = $isHeader ? 'ステータス' : null;
                break;
            case "D":
                $ret = $isHeader ? '公開状態' : null;
                break;
            case "E":
                $ret = $isHeader ? '公開日' : null;
                break;
            case "F":
                $ret = $isHeader ? '公開期間' : null;
                break;
            case "G":
                $ret = $isHeader ? 'ユーザ名' : 'create_user.title';
                break;
            case "H":
                $ret = $isHeader ? '最終更新日時' : 'modified';
                break;
        }

        return $ret;
    }
}

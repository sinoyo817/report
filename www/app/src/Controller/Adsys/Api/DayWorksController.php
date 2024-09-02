<?php
declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\DayWork;
use App\Model\Filter\DayWorksCollection;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

use Cake\ORM\Query;
use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Mailer\MailerAwareTrait;
use Cake\Http\CallbackStream;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv as WriterCsv;

use Cake\Collection\Collection;
use Cake\Chronos\Chronos;

/**
 * DayWorks Controller
 *
 * @method \App\Model\Entity\DayWork[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class DayWorksController extends AppController
{
    use MailerAwareTrait;
    protected $defaultTable = 'DayWorks';

    public $paginate = [
        'limit' => 20,
        'order' => [
            'DayWorks.work_date' => 'DESC',
            'DayWorks.created' => 'DESC',
            'DayWorks.modified' => 'DESC',
        ],
    ];

    public function initialize(): void
    {
        parent::initialize();

        // Authenticationコンポーネントをロード
        $this->loadComponent('Authentication.Authentication');
    }

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = ['Blocks', 'Metadatas', 'CreateAdmins', 'ModifiedAdmins'];


        // 初期表示では当月分を表示する
        $param = $this->request->getQueryParams();
        $conditions = [];
        if (!isset($param['start_date']) && !isset($param['end_date'])) {
            // 現在の日付をから今月の月初と月末を取得
            $now = Chronos::now();
            $firstDayOfMonth = $now->startOfMonth()->format('Y-m-d');
            $lastDayOfMonth = $now->endOfMonth()->format('Y-m-d');

            $conditions = [
                'DayWorks.work_date >= ' => $firstDayOfMonth,
                'DayWorks.work_date <=' => $lastDayOfMonth
            ];
        }

        // ログインしているユーザーのIDを取得
        $result = $this->Authentication->getResult();
        if ($result->isValid()) {
            $identity = $this->request->getAttribute('identity');
            $superuser = $identity->get('superuser');

            // スーパーユーザーじゃなければ自分が登録したものだけ
            if (!$superuser) {
                $userId = $identity->getIdentifier();
                $conditions['DayWorks.created_by_admin'] = $userId;
            }
        }

        $search->setfindOptions([
            'contain' => $associated,
            'conditions' => $conditions
        ]);
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
        $create->setPatchEntityOptions([
            'associated' => $associated
        ]);

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
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $update->setfindOptions(['contain' => $findAssociated]);
        $update->setPatchEntityOptions([
            'associated' => $patchAssociated,
            'validate' => 'default',
        ]);
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
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $confirm->setfindOptions(['contain' => $findAssociated]);
        $confirm->setPatchEntityOptions([
            'associated' => $patchAssociated,
            'validate' => 'default',
        ]);
        $confirm->ignorePublicView();

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
        $associated = ['Blocks', 'Metadatas'];
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
        $associated = ['Blocks', 'Metadatas'];
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
        $associated = ['Blocks', 'Metadatas'];
        $status->setStatusOptions(['copyAssociated' => $associated, 'forceContain' => []]);

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

        // 必要なマスタデータ等を追加していく

        // ログインしているユーザーのIDを取得
        $conditions = [];
        $result = $this->Authentication->getResult();
        if ($result->isValid()) {
            $identity = $this->request->getAttribute('identity');
            $superuser = $identity->get('superuser');
            // スーパーユーザーじゃなければ自分が登録したものだけ
            if (!$superuser) {
                $userId = [Configure::read('Master.SuperUserId')];
                $userId[] = $identity->getIdentifier();
                $conditions = ['MasterProductCodes.created_by_admin IN ' => $userId];
            }
        }

        $table = $this->fetchTable('MasterProductCodes');
        $ProductCodes = $table->find()->find('public')->select(['id', 'title'])->where($conditions);

        $table = $this->fetchTable('MasterWorkCodes');
        $WorkCodes = $table->find()->find('public')->select(['id', 'title']);

        $data = [
            'master_product_codes' => $ProductCodes,
            'master_work_codes' => $WorkCodes,
        ];

         $this->set('data', $data);
    }

    public function report()
    {
        $id = $this->request->getQueryParams()['id'];

        $associated = [
            'Blocks' => function (Query $q) {
                return $q->where(['value04' => '1'])->distinct('value01');
            },
            'CreateAdmins'
        ];

        $table = $this->fetchTable();
        
        if($id && $table->exists(["DayWorks.id" => $id])) {
            $data = $table->findById($id)->contain($associated)->firstOrFail();

            $table = $this->fetchTable('MasterProductCodes');
            $ProductCodes = $table->find('list')->select(['id', 'title'])->toArray();

            $this->getMailer('Report')->send('sendReport', [$data, $ProductCodes]);
        }

        return $this->redirect(['controller' => 'DayWorks' , 'action' => 'index', 'prefix' => 'Adsys']);
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

        $start_date = $this->request->getQueryParams()['start_date'] ?? "";
        $end_date = $this->request->getQueryParams()['end_date'] ?? "";

        if (!empty($start_date) || !empty($end_date)) {
            $period = [$start_date, $end_date];
            $filename = implode(' ～ ', $period) . '日報_' . date('YmdHis');
        } else {
            $filename = '日報_' . date('YmdHis');
        }

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

        foreach (range('A', 'F') as $col) {
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
        // 出力対象のDataを抽出
        $data = $this->_getData();

        // Master用のテーブルを取得しとく
        $MasterProductCodesTable = $this->fetchTable('MasterProductCodes');
        $MasterProductCodesTable->changePrivate();
        $MasterWorkCodesTable = $this->fetchTable('MasterWorkCodes');
        $MasterWorkCodesTable->changePrivate();

        if ($data) {
            // ブロックのデータを集計して配列を作成
            $reports = [];

            // 同じ案件をまとめて出力したいのでソート用にcode取得する
            $Codes = $MasterProductCodesTable->find('list', ['keyField' => 'id', 'valueField' => 'code'])->toArray();

            $total = 0;
            foreach ($data as $d) {
                if (!empty($d->blocks)) {

                    foreach ($d->blocks as $block) {
                        // 合計値用の計算をしておく
                        $total = (double) $total + (double) $block->value03;

                        if (array_key_exists($block->value01, $Codes)) {
                            $code = $Codes[$block->value01];

                        // pr($code);
                            if (isset($reports[$code]) && array_key_exists($block->value01, $reports[$code]) && array_key_exists($block->value02, $reports[$code][$block->value01])) {
                                // 同じ案件＆同じ作業コードのものが計上済みなら加算
                                $sum = ((double) $reports[$code][$block->value01][$block->value02]['time'] + (double) $block->value03);
                                $reports[$code][$block->value01][$block->value02] = [
                                    'product_code' => $block->value01,
                                    'work_code' => $block->value02,
                                    'time' => $sum,
                                ];
                            } else {
                                $reports[$code][$block->value01][$block->value02] = [
                                    'product_code' => $block->value01,
                                    'work_code' => $block->value02,
                                    'time' => $block->value03,
                                ];
                            }

                        } else {
                            $reports[][$block->value01][$block->value02] = [
                                'product_code' => $block->value01,
                                'work_code' => $block->value02,
                                'time' => $block->value03,
                            ];
                        }
                    }
                }
            }
            // pr($reports);

            $ProductCodes = $MasterProductCodesTable->find()->toArray();
            $WorkCodes = $MasterWorkCodesTable->find()->toArray();

            $index = 2;
            foreach ($reports as $key => $report_list) {
                foreach ($report_list as $report) {
                    foreach ($report as $rep) {
                        $product = Hash::extract($ProductCodes, "{n}[id={$rep['product_code']}]");
                        $product = Hash::get($product, '0');
                        $work = Hash::extract($WorkCodes, "{n}[id={$rep['work_code']}]");
                        $work = Hash::get($work, '0');
    
                        foreach (range('A', 'F') as $col) {
                            
                            if ($col === 'A') {
                                $sheet->setCellValue("{$col}{$index}", $key);
                            } elseif ($col === 'B') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->can : "");
                            } elseif ($col === 'C') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->title : "");
                            } elseif ($col === 'D') {
                                $sheet->setCellValue("{$col}{$index}", $work ? $work->title : "");
                            } elseif ($col === 'E') {
                                $sheet->setCellValue("{$col}{$index}", $rep['time'] ?? "");
                            } elseif ($col === 'F') {
                                $text = ""; 
                                if (!empty($product)) {
                                    $text = $product->can ? "{$product->can} : {$product->title}" : "";
                                }
                                $sheet->setCellValue("{$col}{$index}", $text);
                            }
                        }
    
                        $index++;
                    }
                }
            }
            // 最終行にトータルを入れる
            $sheet->setCellValue("D{$index}", $total);
            // exit;
        }
    }

    protected function _getCellData($col, $isHeader = false,)
    {
        $ret = null;
        switch ($col) {
            case "A":
                $ret = $isHeader ? '予算コード' : null;
                break;
            case "B":
                $ret = $isHeader ? 'CAN' : null;
                break;
            case "C":
                $ret = $isHeader ? '案件名' : null;
                break;
            case "D":
                $ret = $isHeader ? '作業内容' : null;
                break;
            case "E":
                $ret = $isHeader ? '工数' : null;
                break;
            case "F":
                $ret = $isHeader ? '備考' : null;
                break;
        }

        return $ret;
    }

    private function _getData()
    {
        $role = $this->Authentication->getIdentityData('role');
        $roleData = Configure::read("Roles." . $role) ?? [];

        if (!$roleData) {
            return;
        }

        $associated = [
            'Blocks',
            'CreateAdmins',
        ];

        $table = $this->fetchTable();
        $query = $this->Authorization->applyScope($table->find('search', [
            'search' => $this->request->getQueryParams(),
            'collection' => DayWorksCollection::class
        ])->contain($associated)->order(['DayWorks.created' => 'desc', 'DayWorks.modified' => 'desc']), 'index');

        /** @var \App\Model\Entity\DayWorks[] $data  */
        $data = $query->all()->toArray();

        return $data;
    }
}

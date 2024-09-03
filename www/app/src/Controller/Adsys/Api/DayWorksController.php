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
     * トータルCSVダウンロード
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
     * csvDownload method
     *
     * @return \Cake\Http\Response|null|void Renders view
     * 日別CSVダウンロード
     */
    public function csvDailyDownload()
    {
        $spreadsheet = new Spreadsheet();

        $this->setCsvData($spreadsheet, true);

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
     * トータル＆日別共通
     */
    private function setCsvData($spreadsheet, $is_daily=false)
    {
        $sheet = $spreadsheet->getActiveSheet();

        if ($is_daily) {
            // 出力対象のDataを抽出
            $datas = $this->_getData();

            // ABCをキーに並べ直す
            list($lastKey, $results) = $this->_getDailyCellData($datas, 'E');

            $sheet->fromArray($this->_getHeaderCell($is_daily, $results, $lastKey), null, 'A1', true);
            $this->_getDailyBodyCell($sheet, $results, $lastKey);
        } else {
            $sheet->fromArray($this->_getHeaderCell(), null, 'A1', true);
            $this->_getBodyCell($sheet);
            // $sheet->fromArray($this->_getBodyCell(), null, 'A2', true);
        }
    }

    /**
     * getHeaderCell function
     *
     * @param \PhpOffice\PhpSpreadsheet\Spreadsheet $spreadsheet
     * @return void
     * トータル＆日別共通：ヘッダ取得
     */
    private function _getHeaderCell($is_daily=false, $results=[], $lastKey=null)
    {
        $header = [];

        if ($is_daily) {
            foreach ($results as $col => $val) {
                if (in_array($col, ['A', 'B', 'C', 'D', $lastKey])) {
                    $header[] = $val;
                } else {
                    $header[] = $val->work_date->format('m/d');
                }
            }
        } else {
            foreach (range('A', 'F') as $col) {
                $header[] = $this->_getCellData($col, true);
            }
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
                                $sum = ((double) $reports[$code][$block->value01][$block->value02] + (double) $block->value03);
                                $reports[$code][$block->value01][$block->value02] = $sum;
                            } else {
                                $reports[$code][$block->value01][$block->value02] = $block->value03;
                            }

                        } else {
                            $reports[][$block->value01][$block->value02] = $block->value03;
                        }
                    }
                }
            }
            // pr($reports);

            $ProductCodes = $MasterProductCodesTable->find()->toArray();
            $WorkCodes = $MasterWorkCodesTable->find()->toArray();

            $index = 2;
            foreach ($reports as $product_code => $report_list) {
                foreach ($report_list as $product_id =>$report) {
                    foreach ($report as $work_code => $rep) {
                        $product = Hash::extract($ProductCodes, "{n}[id={$product_id}]");
                        $product = Hash::get($product, '0');
                        $work = Hash::extract($WorkCodes, "{n}[id={$work_code}]");
                        $work = Hash::get($work, '0');
    
                        foreach (range('A', 'F') as $col) {                            
                            if ($col === 'A') {
                                $sheet->setCellValue("{$col}{$index}", $product_code);
                            } elseif ($col === 'B') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->can : "");
                            } elseif ($col === 'C') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->title : "");
                            } elseif ($col === 'D') {
                                $sheet->setCellValue("{$col}{$index}", $work ? $work->title : "");
                            } elseif ($col === 'E') {
                                $sheet->setCellValue("{$col}{$index}", $rep ?? "");
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
            // 最終列にトータルを入れる
            $sheet->setCellValue("E{$index}", $total);
            // exit;
        }
    }

    /**
     * _getBodyCell function
     *
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return void
     */
    private function _getDailyBodyCell($sheet, $data, $lastKey)
    {
        // Master用のテーブルを取得しとく
        $MasterProductCodesTable = $this->fetchTable('MasterProductCodes');
        $MasterProductCodesTable->changePrivate();
        $MasterWorkCodesTable = $this->fetchTable('MasterWorkCodes');
        $MasterWorkCodesTable->changePrivate();

        unset($data['A']);
        unset($data['B']);
        unset($data['C']);
        unset($data['D']);
        // pr($data);
        // exit;

        if ($data) {
            // ブロックのデータを集計して配列を作成
            $reports = [];

            // 同じ案件をまとめて出力したいのでソート用にcode取得する
            $Codes = $MasterProductCodesTable->find('list', ['keyField' => 'id', 'valueField' => 'code'])->toArray();

            $totalCell = [];
            foreach ($data as $col => $d) {
                if (!empty($d->blocks)) {

                    foreach ($d->blocks as $block) {
                        if (array_key_exists($block->value01, $Codes)) {
                            $code = $Codes[$block->value01];
                            $reports[$code][$block->value01][$block->value02][$col] = $block->value03;

                        } else {
                            $reports[][$block->value01][$block->value02][$col] = $block->value03;
                        }

                        // 縦軸の合計値を配列にまとめる
                        if (isset($totalCell[$col])) {
                            $totalCell[$col] = (double) $totalCell[$col] + (double) $block->value03;
                        } else {
                            $totalCell[$col] = $block->value03;
                        }
                    }
                }
            }
// pr($totalCell);
// pr($reports);
// exit;
            $ProductCodes = $MasterProductCodesTable->find()->toArray();
            $WorkCodes = $MasterWorkCodesTable->find()->toArray();

            $index = 2;            
            $totalAll = 0;
            foreach ($reports as $product_code => $report_list) {
                foreach ($report_list as $product_id => $report) {
                    foreach ($report as $work_code => $rep) {
                        $product = Hash::extract($ProductCodes, "{n}[id={$product_id}]");
                        $product = Hash::get($product, '0');
                        $work = Hash::extract($WorkCodes, "{n}[id={$work_code}]");
                        $work = Hash::get($work, '0');
                        // pr($product);
                        // pr($work);
                        // pr($rep);
    
                        $total = 0;
                        foreach (range('A', $lastKey) as $col) {
                            
                            if ($col === 'A') {
                                $sheet->setCellValue("{$col}{$index}", $product_code);
                            } elseif ($col === 'B') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->can : "");
                            } elseif ($col === 'C') {
                                $sheet->setCellValue("{$col}{$index}", $product ? $product->title : "");
                            } elseif ($col === 'D') {
                                $sheet->setCellValue("{$col}{$index}", $work ? $work->title : "");
                            } elseif ($col === $lastKey) {
                                $sheet->setCellValue("{$col}{$index}", $total);
                            } else {
                                $sheet->setCellValue("{$col}{$index}", array_key_exists($col, $rep) ? $rep[$col] : "");
                                if (isset($rep[$col])) {
                                    $total = (double) $total + (double) $rep[$col];
                                }
                            }
                        }
    
                        $index++;
                        $totalAll = (double) $totalAll + (double) $total;
                    }
                }
            }
            // 最終行と最終列にトータルを入れる
            foreach ($totalCell as $col => $sum) {
                $sheet->setCellValue("{$col}{$index}", $sum);
            }
            $sheet->setCellValue("{$lastKey}{$index}", $totalAll);
        }
        // exit;
    }

    
    // トータル＆日別共通：データ取得
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

        $conditions = [];

        if (!empty($this->request->getQueryParams())) {
            $conditions = $this->request->getQueryParams();
        } else {
            // 検索条件が何も入っていなかったら今月を取得する
            $now = Chronos::now();
            $conditions = [
                'start_date' => $now->startOfMonth()->toDateString(),
                'end_date' => $now->endOfMonth()->toDateString(),
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
                $conditions['created_by_admin'] = $userId;
            }
        }

        $table = $this->fetchTable();
        $query = $this->Authorization->applyScope($table->find('search', [
            'search' => $conditions,
            'collection' => DayWorksCollection::class
        ])->contain($associated)->order(['DayWorks.Work_date' => 'asc', 'DayWorks.created' => 'desc', 'DayWorks.modified' => 'desc']), 'index');

        /** @var \App\Model\Entity\DayWorks[] $data  */
        $data = $query->all()->toArray();

        return $data;
    }

    // トータルCSVのヘッダ取得
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

    // 日別CSVのヘッダ取得
    private function _getDailyCellData($datas, $startKey = 'A')
    {
        $ret = [
            "A" => '予算コード',
            "B" => 'CAN',
            "C" => '案件名',
            "D" => '作業内容',
        ];
        $currentKey = $startKey;

        foreach ($datas as $data) {
            $ret[$currentKey] = $data;
            $currentKey = $this->_getNextKey($currentKey);
        }
        $lastKey = $currentKey;
        $ret[$lastKey] = '合計';

        return [$lastKey, $ret];
    }

    // 日別CSV：動的に行追加
    private function _getNextKey($key)
    {
        $length = strlen($key);
        $lastChar = substr($key, -1);
        $rest = substr($key, 0, $length - 1);

        if ($lastChar === 'Z') {
            if ($rest === '') {
                return 'AA';
            }
            return $this->_getNextKey($rest) . 'A';
        }
        return $rest . chr(ord($lastChar) + 1);
    }
}

<?php

declare(strict_types=1);

namespace App\Controller\Component;

use Cake\Cache\Cache;
use Cake\Controller\Component;
use Cake\Controller\ComponentRegistry;
use Cake\Http\Client;
use Cake\Utility\Text;

/**
 * Search component
 */
class SearchComponent extends Component
{
    /**
     * query variable
     *
     * @var string
     */
    protected $q = "";

    /**
     * page variable
     *
     * @var int
     */
    protected $page = 1;

    /**
     * controller variable
     *
     * @var \Cake\Controller\Controller
     */
    protected $controller;

    /**
     * Default configuration.
     *
     * @var array<string, mixed>
     */
    protected $_defaultConfig = [
        'fessUrl' => 'https://search-api2.coara.or.jp/json/',
        'label' => null,
        'perPage' => 20,
        'pageKey' => 'page',
        'queryKey' => 'q',
        'sort' => 'score.desc',
    ];

    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->controller = $this->getController();

        $query = $this->controller->getRequest()->getQuery($this->getConfig('queryKey'));

        if (isset($query) && is_array($query)) {
            $this->q = array_shift($query);
        } else {
            $this->q = $query;
        }

        $page = $this->controller->getRequest()->getQuery($this->getConfig('pageKey')) ?: 1;
        if (isset($page) && $page) {
            if (is_array($page)) {
                $this->page = (int)array_shift($page);
            } else {
                $this->page = (int)$page;
            }
        }
    }

    /**
     * setResult function
     *
     * @return void
     */
    public function setResult()
    {
        $results = $this->getResult();

        $controller = $this->getController();

        $request = $controller->getRequest();
        $model = $controller->getName();

        $request = $request->withAttribute('paging', [
            $model => [
                "current" => $results["page_number"] ?? 0,
                "page" => $results["page_number"] ?? 1,
                "start" => $results["start_record_number"] ?? 0,
                "end" => $results["end_record_number"] ?? 0,
                "prevPage" => $results["prev_page"] ?? false,
                "nextPage" => $results["next_page"] ?? false,
                "pageCount" => $results["page_count"] ?? 1,
                "count" => $results["record_count"] ?? 0,
            ],
        ]);

        $controller->setRequest($request);


        $controller->set('data', $results['result'] ?? []);

        $controller->set('q', $this->q);
    }

    /**
     * getResult method
     *
     * @return void
     */
    public function getResult()
    {
        $ret = [];

        $url = $this->_buildQuery();

        if (!$url) {
            return $ret;
        }

        $cacheKey = md5($this->getConfig('label') . $this->q . '_page_' . $this->page);

        $ret = Cache::remember($cacheKey, function () use ($url) {
            $http = new Client();

            $response = $http->get($url);

            if ($response->isSuccess()) {
                $json = $response->getJson();

                $data = [];
                if (isset($json['response'])) {
                    if (isset($json['response']['result'])) {
                        foreach ($json['response']['result'] as $result) {
                            $data['result'][] = [
                                'url_link' => $result['url_link'],
                                'content_title' => $result['content_title'],
                                'content_description' => $result['content_description'],
                            ];
                        }
                    }
                    $data["page_number"] = $json['response']["page_number"] ?? null;
                    $data["start_record_number"] = $json['response']["start_record_number"] ?? null;
                    $data["end_record_number"] = $json['response']["end_record_number"] ?? null;
                    $data["prev_page"] = $json['response']["prev_page"] ?? null;
                    $data["next_page"] = $json['response']["next_page"] ?? null;
                    $data["page_count"] = $json['response']["page_count"] ?? null;
                    $data["record_count"] = $json['response']["record_count"] ?? null;
                }

                return $data;
            } else {
                return [];
            }
        }, 'fess');

        return $ret;
    }

    private function _buildQuery()
    {
        $url = "";
        if (!$this->getConfig('label')) {
            return $url;
        }

        if (!$this->q) {
            return $url;
        }

        $url .= $this->getConfig('fessUrl') . '?';
        $url .= 'q=' . rawurlencode($this->q);
        $url .= '&start=' . ($this->page - 1) * ((int)$this->getConfig('perPage'));
        $url .= '&num=' . (int)$this->getConfig('perPage');
        $url .= '&sort=' . rawurlencode($this->getConfig('sort'));
        $url .= '&fields.label=' . rawurlencode($this->getConfig('label'));

        return $url;
    }
}

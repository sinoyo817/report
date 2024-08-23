<?php

declare(strict_types=1);

namespace App\Controller\Adsys;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\Http\Exception\BadRequestException;
use Cake\Http\Exception\ForbiddenException;
use Cake\Http\Exception\UnauthorizedException;
use Cake\Log\Log;
use Cake\Routing\Router;

/**
 * Admins Controller
 *
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AdminsController extends AppController
{

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->Authentication->allowUnauthenticated(['login', 'me']);
    }

    /**
     * login method
     *
     * @return \Cake\Http\Response|void
     */
    public function login()
    {

        $result = $this->Authentication->getResult();
        // ユーザーがログインしている場合は、そのユーザーを送り出してください。

        if ($this->request->is('post') && $this->request->is('ajax')) {
            // $this->response = $this->response->withHeader('Content-Type','application/vnd.api+json');
            if ($result && $result->isValid()) {

                $data = $this->_authResponseData();
            } else {
                $statusCode = 422;
                $this->response = $this->response->withStatus($statusCode);
                $data = [
                    'title' => __('ユーザ名とパスワードが無効です'),
                    'status' => $statusCode,
                ];
            }
            $this->set('data', $data);
            $this->viewBuilder()->setOption('serialize', 'data');
        }
        if ($this->request->is('get') && $this->request->is('ajax')) {
            throw new UnauthorizedException();
        }
        if ($this->request->is('get') && $result && $result->isValid()) {

            $target = $this->Authentication->getLoginRedirect() ?? Router::url(['controller' => 'Pages', 'action' => 'index']);
            return $this->redirect($target);
        }
    }

    /**
     * logout method
     *
     * @return \Cake\Http\Response
     */
    public function logout()
    {

        $target = $this->Authentication->logout() ?? ['action' => 'login'];
        return $this->redirect($target);
    }

    /**
     * me method
     *
     * @return \Cake\Http\Response
     * @throws BadRequestException|UnauthorizedException
     */
    public function me()
    {

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        if ($result && $result->isValid()) {
            $data = $this->_authResponseData();
        } else {
            $statusCode = 404;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
}

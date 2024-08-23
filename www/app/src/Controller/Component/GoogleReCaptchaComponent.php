<?php

declare(strict_types=1);

namespace App\Controller\Component;

use Cake\Controller\Component;
use Cake\Core\Configure;
use Cake\Http\Exception\BadRequestException;
use Cake\Log\Log;
use Cake\Routing\Router;
use Cake\Utility\Hash;

/**
 * GoogleReCaptcha component
 */
class GoogleReCaptchaComponent extends Component
{
    /**
     * Default configuration.
     *
     * @var array<string, mixed>
     */
    protected $_defaultConfig = [
        'verifyUri' => 'https://www.google.com/recaptcha/api/siteverify',
        'threshold' => 0.5,
        'tokenField' => 'g-recaptcha-response',
    ];

    public function initialize(array $config): void
    {
        parent::initialize($config);
    }

    public function check()
    {

        $controller = $this->getController();

        if ($controller->getRequest()->getMethod() === "GET") {
            return true;
        }

        if (env('SERVER_NAME') === '127.0.0.1' || env('SERVER_NAME') === 'localhost') {
            return true;
        }


        if (!Configure::check('Site.Settings.reCAPTCHA.secretKey')) {
            return false;
        }

        $secretKey = Configure::read('Site.Settings.reCAPTCHA.secretKey');

        $token = $controller->getRequest()->getData($this->getConfig('tokenField'));
        if (!$token) {
            return false;
        }

        $controller->setRequest($controller->getRequest()->withoutData($this->getConfig('tokenField')));

        $param = [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $controller->getRequest()->clientIp(),
        ];

        $option = [
            CURLOPT_RETURNTRANSFER => true, //文字列として返す
            CURLOPT_TIMEOUT => 3, // タイムアウト時間
            CURLOPT_POST => true, //POST
            CURLOPT_POSTFIELDS => http_build_query($param),
        ];

        $url = $this->getConfig('verifyUri');

        $ch = curl_init($url);
        curl_setopt_array($ch, $option);

        $json    = curl_exec($ch);
        $info    = curl_getinfo($ch);
        $errorNo = curl_errno($ch);

        curl_close($ch);
        // OK以外はエラーなので空白配列を返す
        if ($errorNo !== CURLE_OK) {
            // 詳しくエラーハンドリングしたい場合はerrorNoで確認
            // タイムアウトの場合はCURLE_OPERATION_TIMEDOUT
            return false;
        }
        // 200以外のステータスコードは失敗とみなし空配列を返す
        if ($info['http_code'] !== 200) {
            return false;
        }

        // 文字列から変換
        $jsonArray = json_decode($json, true);

        Log::write('debug', "reCAPTCHA Verify:" . $json);

        $check = $jsonArray['success'] && $jsonArray['hostname'] == env('SERVER_NAME') && $jsonArray['score'] > $this->getConfig('threshold');

        if (!$check) {
            throw new BadRequestException();
        }

        return $check;
    }
}

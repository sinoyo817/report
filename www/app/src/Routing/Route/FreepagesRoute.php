<?php

declare(strict_types=1);

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @since         3.0.0
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Routing\Route;

use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\ORM\TableRegistry;
use Cake\Routing\Route\Route;
use Psr\Http\Message\ServerRequestInterface;

/**
 * This route class will transparently inflect the controller and plugin routing
 * parameters, so that requesting `/my_controller` is parsed as `['controller' => 'MyController']`
 */
class FreepagesRoute extends Route
{

    /**
     * Checks to see if the given URL can be parsed by this route.
     *
     * If the route can be parsed an array of parameters will be returned; if not
     * `null` will be returned.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request The URL to attempt to parse.
     * @return array|null An array of request parameters, or `null` on failure.
     */
    public function parseRequest(ServerRequestInterface $request): ?array
    {
        $params = parent::parseRequest($request);

        if (!$params) {
            return null;
        }
        $url = $params['path'] ?? "";

        $path = parse_url($url, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        $url = preg_replace("&/$&", "", preg_replace("&^/&", "", preg_replace("&\..+$&", "", $url)));

        $table = TableRegistry::getTableLocator()->get('FreepageDirectories');
        if ($url && $table->exists(['path_url' => $url])) {
            return $params;
        }


        return null;
    }
}

<?php

declare(strict_types=1);

namespace App\Utility\Formatters;

use Cake\Chronos\Date;
use Cake\Utility\Text;
use Josbeir\Filesystem\Formatter\DefaultFormatter;

class ContactFormatter extends DefaultFormatter
{
    /**
     * Default configuration
     *
     * @var array
     */
    protected $_defaultConfig = [
        'uuid' => "",
        'request' => "",
    ];

    /**
     * CakePHP Request variable
     *
     * @var \Cake\Http\ServerRequest
     */
    protected $request;

    /**
     * uuid variable
     *
     * @var string
     */
    protected $uuid;

    /**
     * @inheritDoc
     */
    public function __construct(string $filename, $data = null, array $config = [])
    {
        parent::__construct($filename, $data, $config);

        $this->uuid = $this->getConfig('uuid');
    }

    /**
     * Undocumented function
     *
     * @param \Cake\Http\ServerRequest $model
     *
     * @return string
     */
    public function getPath(): string
    {
        return 'Contacts/' . $this->uuid . DS . $this->getBaseName();
    }
}

<?php

declare(strict_types=1);

namespace App\Model\Behavior;

use Medii\Block\Model\Behavior\BlockBehavior;

/**
 * CustomBlock behavior
 */
class CustomBlockBehavior extends BlockBehavior
{
    /**
     * Default configuration.
     *
     * @var array<string, mixed>
     */
    protected $_defaultConfig = [];

    public function initialize(array $config): void
    {
        parent::initialize($config);
    }
}

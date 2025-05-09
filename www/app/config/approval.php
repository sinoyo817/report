<?php

// approvalBehavior用

// allStatussKey

$allStatusKey = [
    'draftKey' => 'draft',
    'pendingKey' => 'pending',
    'remandKey' => 'remand',
    'publishedKey' => 'published',
    'unpublishedKey' => 'unpublished',
    'suspendKey' => 'suspend',
    'deletedKey' => 'deleted',
    'copiedKey' => 'copied',
    'publishedReqKey' => 'published_req',
    'unpublishedReqKey' => 'unpublished_req',
    'unsupportedtKey' => 'draft',
    'supportedtKey' => 'published',
    'finishedKey' => 'unpublished',
];
$allStatus = [
    $allStatusKey['draftKey'] => '編集中',
    $allStatusKey['pendingKey'] => '承認依頼',
    $allStatusKey['remandKey'] => '差戻し',
    $allStatusKey['publishedKey'] => '公開',
    $allStatusKey['unpublishedKey'] => '非公開',
    $allStatusKey['suspendKey'] => '停止',
    $allStatusKey['deletedKey'] => '削除',
    $allStatusKey['copiedKey'] => 'コピー',
    $allStatusKey['publishedReqKey'] => '公開申請',
    $allStatusKey['unpublishedReqKey'] => '非公開申請',
];

$allActionKey = [
    'toPublishKey' => 'toPublish',
    'toPrivateKey' => 'toPrivate',
    'toDeleteKey' => 'toDelete',
    'toCopyKey' => 'toCopy',
];

$allAction = [
    $allActionKey['toPublishKey'] => '公開アクション',
    $allActionKey['toPrivateKey'] => '非公開アクション',
    $allActionKey['toDeleteKey'] => '削除アクション',
    $allActionKey['toCopyKey'] => 'コピーアクション',
];

// allApprovalActions

/** @var array 全承認処理アクション */
$allApprovalActions = [
    [
        'status' => $allStatusKey['draftKey'],
        'actions' => [],
    ],
    [
        'status' => $allStatusKey['pendingKey'],
        'actions' => [],
    ],
    [
        'status' => $allStatusKey['remandKey'],
        'actions' => [],
    ],
    [
        'status' => $allStatusKey['publishedKey'],
        'actions' => [$allActionKey['toPublishKey']],
    ],
    [
        'status' => $allStatusKey['unpublishedKey'],
        'actions' => [$allActionKey['toPrivateKey']],
    ],
    [
        'status' => $allStatusKey['suspendKey'],
        'actions' => [$allActionKey['toPrivateKey']],
    ],
    [
        'status' => $allStatusKey['deletedKey'],
        'actions' => [$allActionKey['toDeleteKey']],
    ],
    [
        'status' => $allStatusKey['copiedKey'],
        'actions' => [$allActionKey['toCopyKey']],
    ],
    [
        'status' => $allStatusKey['publishedReqKey'],
        'actions' => [],
    ],
    [
        'status' => $allStatusKey['unpublishedReqKey'],
        'actions' => [],
    ],
];

$allApprovalStatusOption = [
    $allStatusKey['publishedKey'] => [
        'title' => "公開",
        'status' => $allStatusKey['publishedKey'],
        'sequence' => 1,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'green',
    ],
    $allStatusKey['publishedKey'] . "onlyDisplay" => [
        'title' => "公開",
        'status' => $allStatusKey['publishedKey'],
        'sequence' => 1,
        'forSelect' => false,
        'forSearch' => true,
        'colorScheme' => 'green',
    ],
    $allStatusKey['unpublishedKey'] => [
        'title' => "非公開",
        'status' => $allStatusKey['unpublishedKey'],
        'sequence' => 2,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'gray',
    ],
    $allStatusKey['unpublishedKey'] . "onlyDisplay" => [
        'title' => "非公開",
        'status' => $allStatusKey['unpublishedKey'],
        'sequence' => 2,
        'forSelect' => false,
        'forSearch' => true,
        'colorScheme' => 'gray',
    ],
    $allStatusKey['publishedKey'] . "enabled" => [
        'title' => "有効",
        'status' => $allStatusKey['publishedKey'],
        'sequence' => 1,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'green',
    ],
    $allStatusKey['unpublishedKey'] . "disabled" => [
        'title' => "無効",
        'status' => $allStatusKey['unpublishedKey'],
        'sequence' => 2,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'gray',
    ],
    $allStatusKey['remandKey'] . "forAdmin" => [
        'title' => "差戻し",
        'status' => $allStatusKey['remandKey'],
        'sequence' => 3,
        'forSelect' => false,
        'forSearch' => true,
        'colorScheme' => 'red',
    ],
    $allStatusKey['remandKey'] . "forUser" => [
        'title' => "差戻し",
        'status' => $allStatusKey['remandKey'],
        'sequence' => 3,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'red',
    ],
    $allStatusKey['publishedReqKey'] . "forAdmin" => [
        'title' => "公開申請",
        'status' => $allStatusKey['publishedReqKey'],
        'sequence' => 4,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'cyan',
    ],
    $allStatusKey['publishedReqKey'] . "forUser" => [
        'title' => "公開申請",
        'status' => $allStatusKey['publishedReqKey'],
        'sequence' => 4,
        'forSelect' => false,
        'forSearch' => true,
        'colorScheme' => 'cyan',
    ],
    $allStatusKey['unpublishedReqKey'] . "forAdmin" => [
        'title' => "非公開申請",
        'status' => $allStatusKey['unpublishedReqKey'],
        'sequence' => 5,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'purple',
    ],
    $allStatusKey['unpublishedReqKey'] . "forUser" => [
        'title' => "非公開申請",
        'status' => $allStatusKey['unpublishedReqKey'],
        'sequence' => 5,
        'forSelect' => false,
        'forSearch' => true,
        'colorScheme' => 'purple',
    ],
    $allStatusKey['copiedKey'] => [
        'title' => "コピー",
        'status' => $allStatusKey['copiedKey'],
        'sequence' => 10,
        'forSelect' => true,
        'forSearch' => false,
    ],
    $allStatusKey['suspendKey'] => [
        'title' => "停止",
        'status' => $allStatusKey['suspendKey'],
        'sequence' => 15,
        'forSelect' => true,
        'forSearch' => false,
    ],
    $allStatusKey['deletedKey'] => [
        'title' => "削除",
        'status' => $allStatusKey['deletedKey'],
        'sequence' => 20,
        'forSelect' => true,
        'forSearch' => false,
    ],
    $allStatusKey['draftKey'] => [
        'title' => "編集中",
        'status' => $allStatusKey['draftKey'],
        'sequence' => 99,
        'forSelect' => false,
        'forSearch' => false,
        'colorScheme' => 'yellow',
    ],
    // 日報用
    $allStatusKey['draftKey'] . "forReport" => [
        'title' => "未処理",
        'status' => $allStatusKey['draftKey'],
        'sequence' => 5,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'purple',
    ],
    $allStatusKey['publishedKey'] . "forReport" => [
        'title' => "対応中",
        'status' => $allStatusKey['publishedKey'],
        'sequence' => 1,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'green',
    ],
    $allStatusKey['unpublishedKey'] . "forReport" => [
        'title' => "対応完了",
        'status' => $allStatusKey['unpublishedKey'],
        'sequence' => 2,
        'forSelect' => true,
        'forSearch' => true,
        'colorScheme' => 'gray',
    ],
];

$allStatusOptionKey = [
    'defaultKey' => 'default',
    'defaultEnableKey' => 'defaultEnable',
    'adminKey' => 'admin',
    'requestAdminKey' => 'reqeustAdmin',
    'requestEditorKey' => 'reqeustEditor',
    'requestReportKey' => 'reqeustReport',
    'dayReportKey' => 'daytReport',
];

$allStatusOptionTitle = [
    $allStatusOptionKey['defaultKey'] => '公開/非公開',
    $allStatusOptionKey['defaultEnableKey'] => '有効/無効',
    $allStatusOptionKey['adminKey'] => '管理者用',
    $allStatusOptionKey['requestAdminKey'] => '管理者承認処理',
    $allStatusOptionKey['requestEditorKey'] => '編集者用承認処理',
    $allStatusOptionKey['requestReportKey'] => '未対応/対応中/完了',
    $allStatusOptionKey['dayReportKey'] => '工数用',
];

$allStatusOption = [
    $allStatusOptionKey['defaultKey'] => [
        $allApprovalStatusOption[$allStatusKey['publishedKey']],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey']],
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
        $allApprovalStatusOption[$allStatusKey['draftKey']],
    ],
    $allStatusOptionKey['defaultEnableKey'] => [
        $allApprovalStatusOption[$allStatusKey['publishedKey'] . "enabled"],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey'] . 'disabled'],
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
        $allApprovalStatusOption[$allStatusKey['draftKey']],
    ],
    $allStatusOptionKey['adminKey'] => [
        $allApprovalStatusOption[$allStatusKey['publishedKey'] . "enabled"],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey'] . 'disabled'],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
        $allApprovalStatusOption[$allStatusKey['draftKey']],
    ],
    $allStatusOptionKey['requestAdminKey'] => [
        $allApprovalStatusOption[$allStatusKey['publishedKey']],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey']],
        $allApprovalStatusOption[$allStatusKey['remandKey'] . "forUser"],
        $allApprovalStatusOption[$allStatusKey['publishedReqKey'] . "forUser"],
        $allApprovalStatusOption[$allStatusKey['unpublishedReqKey'] . "forUser"],
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
        $allApprovalStatusOption[$allStatusKey['draftKey']],
    ],
    $allStatusOptionKey['requestEditorKey'] => [
        $allApprovalStatusOption[$allStatusKey['publishedKey'] . "onlyDisplay"],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey'] . "onlyDisplay"],
        $allApprovalStatusOption[$allStatusKey['remandKey'] . "forAdmin"],
        $allApprovalStatusOption[$allStatusKey['publishedReqKey'] . "forAdmin"],
        $allApprovalStatusOption[$allStatusKey['unpublishedReqKey'] . "forAdmin"],
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
        $allApprovalStatusOption[$allStatusKey['draftKey']],
    ],
    $allStatusOptionKey['requestReportKey'] => [
        $allApprovalStatusOption[$allStatusKey['draftKey'] . "forReport"],
        $allApprovalStatusOption[$allStatusKey['publishedKey'] . "forReport"],
        $allApprovalStatusOption[$allStatusKey['unpublishedKey'] . "forReport"],
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
    ],
    $allStatusOptionKey['dayReportKey'] => [
        $allApprovalStatusOption[$allStatusKey['copiedKey']],
        $allApprovalStatusOption[$allStatusKey['deletedKey']],
    ],
];

$allRolesKey = [
    'adminKey' => 'Admin',
    'editorKey' => 'Editor',
];

$allRoles = [
    $allRolesKey['adminKey'] => '総合管理者',
    $allRolesKey['editorKey'] => '編集者',
];

$roles = [
    $allRolesKey['adminKey'] => [
        'statusOptions' => [
            'default' => $allStatusOptionKey['defaultKey'],
            'admins' => $allStatusOptionKey['adminKey'],
            'day-works' => $allStatusOptionKey['dayReportKey'],
            'to-dos' => $allStatusOptionKey['requestReportKey'],
            'master-groups' => $allStatusOptionKey['adminKey'],
        ],
        'requireRoutesKey' => [
            "day-works",
            "to-dos",
            "master-product-codes",
            "master-work-codes",
            "admins",
            "master-groups",
        ],
    ],
    $allRolesKey['editorKey'] => [
        'statusOptions' => [
            'default' => $allStatusOptionKey['requestEditorKey'],
            'admins' => $allStatusOptionKey['adminKey'],
            'day-works' => $allStatusOptionKey['dayReportKey'],
            'to-dos' => $allStatusOptionKey['requestReportKey'],
        ],
        'requireRoutesKey' => [
            "topics",
            "events",
            "freepages",
        ],
    ],
];

/**
 * @param $Approvals 承認周り設定
 */
return [
    'Approvals' => [
        'allActionKey' => $allActionKey,
        'allAction' => $allAction,
        'actions' => $allApprovalActions,
        'allStatusKey' => $allStatusKey,
        'allStatus' => $allStatus,
        'allApprovalStatusOption' => $allApprovalStatusOption,
        'allStatusOptionKey' => $allStatusOptionKey,
        'allStatusOptionTitle' => $allStatusOptionTitle,
        'allStatusOption' => $allStatusOption,
        'allRolesKey' => $allRolesKey,
        'allRoles' => $allRoles,
    ],
    'Roles' => $roles,
];

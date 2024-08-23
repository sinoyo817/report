---
name: 'component-mng'
root: 'assets/'
output: './'
ignore: []
questions:
  component: '単数形のケバブケースで作成するコンポーネント名を入力してください'
  title: 'ページタイトルを入力してください'
  formType:
    message: 'フォームのタイプを選択してください(デフォルトは「ブロック有」)'
    choices:
      - 'ブロック有'
      - 'ブロック無'
      - '一覧ページに設置する'
    initial: 'ブロック有'
  option:
    message: '必要な機能を選択してください(複数可)'
    choices:
      - 'サブディレクトリへの設置'
    multiple: true
    initial: []
  subdir:
    if: contains(inputs.option, 'サブディレクトリへの設置')
    message: 'サブディレクトリ名を入力してください(スラッシュ無し)'
---

# Variables

- dirname: `mng-{{ inputs.component | plur }}`
- pageDirname: `{{ inputs.component | plur }}`
- subdirname : `{{ if len(inputs.subdir) > 0 }}{{ inputs.subdir }}/{{ end }}`
- pageTitle : {{ inputs.title }}


{{ /* ページ */ }}

# `pages-mng/{{ subdirname }}adsys-mng/{{ pageDirname }}/index.tsx`

```tsx
import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/{{ dirname }}/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="{{ pageTitle }}">
                <Index />
            </ContentLayout>
    );
};

export default Top;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}pages-mng/{{ subdirname }}adsys-mng/{{ pageDirname }}/crud/index.tsx`

```tsx
import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/{{ dirname }}/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="{{ pageTitle }}">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}pages-mng/{{ subdirname }}adsys-mng/{{ pageDirname }}/crud/[id].tsx`

```tsx
import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const Update = lazy(() => import("@/features/{{ dirname }}/components/Update"));

function UpdateIndex() {
    const { id } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="{{ pageTitle }}">
                <Skeleton isLoaded={id !== undefined}>
                    {id && <Update id={id} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;

```

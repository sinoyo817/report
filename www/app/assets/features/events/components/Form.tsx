import React from "react";

import { useEventMeta } from "../api/getEventMeta";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    HStack,
    Heading,
} from "@chakra-ui/react";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { EventFormValuesType, EventType } from "../types";
import { getAddress } from "@/features/misc/api/getAddress";
import { useFormContext } from "react-hook-form";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";
import { BaseRemoteMultiCheckboxField } from "@/components/Form/BaseRemoteMultiCheckboxField";
import { BaseImageField } from "@/components/Form/BaseImageField";
import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import EventDatePicker from "./EventDatePicker";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: EventType;
};

const Form = (props: FormPropType) => {
    const { model, data, isConfirm = false, isEdit = false } = props;

    const { watch, setValue } = useFormContext<EventFormValuesType>();

    const postalCode = watch("postal_code");

    const { data: meta } = useEventMeta();

    const handleClick = async () => {
        if (postalCode) {
            const checkPostalCode = postalCode
                .replace("-", "")
                .normalize("NFKC");
            if (checkPostalCode.length !== 7) {
                //
                alert("郵便番号の形式を確認してください");
            }
            try {
                const data = await getAddress({
                    postalCode: checkPostalCode,
                });
                if (data.postalCodes.length > 0) {
                    const address = data.postalCodes[0];
                    const formatAddress = `${address.city || ""}${
                        address.prefecture || ""
                    }${address.sublocality1 || ""}${
                        address.sublocality2 || ""
                    }`;

                    setValue("address", formatAddress);
                }
            } catch (e) {
                //
            }
        }
    };

    return (
        <Box mb="2">
            <BaseInputField<EventFormValuesType>
                id="title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="イベント名"
                placeholder="イベント名を入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{ required: "イベント名を入力してください" }}
            />
            <BaseCheckboxField<EventFormValuesType>
                id="is_top"
                formType="checkbox"
                model={model}
                isConfirm={isConfirm}
                // label=""
                checkboxValueOption={{
                    value: "yes",
                    label: "トップに掲載する",
                }}
                defaultValue="no"
                checkboxOnDisplayText="掲載する"
                checkboxOffDisplayText="掲載しない"
                formControlOptions={{ my: 2 }}
            />
            <BaseTextField<EventFormValuesType>
                id="summary"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="説明文"
                placeholder="説明文を入力してください"
                defaultValue=""
            />
            <BaseDatePickerField<EventFormValuesType>
                id="published"
                formType="date"
                model={model}
                isConfirm={isConfirm}
                label="公開日"
                placeholder="公開日を入力してください"
                defaultValue={new Date()
                    .toLocaleDateString()
                    .replaceAll("/", "-")}
                formControlOptions={{ isRequired: true }}
                rule={{ required: "公開日を入力してください" }}
            />
            <BaseDatePeriodField<EventFormValuesType>
                id="start_date"
                formType="datePeriod"
                model={model}
                isConfirm={isConfirm}
                periodLabel="公開期間"
                periodConnector="~"
                defaultValue=""
                periodGroup={{
                    start: {
                        id: "start_date",
                        formType: "datetime",
                        defaultValue: "",
                    },
                    end: {
                        id: "end_date",
                        formType: "datetime",
                        defaultValue: "",
                    },
                }}
            />
            {meta && (
                <>
                    {meta.settings.area === "multi" && (
                        <BaseRemoteMultiCheckboxField<EventFormValuesType>
                            id="master_areas"
                            formType="remoteMultiCheckbox"
                            label="エリア"
                            remoteDataKey="master_areas"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "エリアを選択してください" }}
                            checkboxOptions={{ isRequired: false }}
                        />
                    )}
                    {meta.settings.area === "single" && (
                        <BaseRemoteSelectField<EventFormValuesType>
                            id="master_area_id"
                            formType="remoteRadio"
                            label="エリア"
                            remoteDataKey="master_areas"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            placeholder="---"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "エリアを選択してください" }}
                        />
                    )}
                    {meta.settings.category === "multi" && (
                        <BaseRemoteMultiCheckboxField<EventFormValuesType>
                            id="master_event_categories"
                            formType="remoteMultiCheckbox"
                            label="カテゴリ"
                            remoteDataKey="master_event_categories"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "カテゴリを選択してください" }}
                            checkboxOptions={{ isRequired: false }}
                        />
                    )}
                    {meta.settings.category === "single" && (
                        <BaseRemoteSelectField<EventFormValuesType>
                            id="master_event_category_id"
                            formType="remoteRadio"
                            label="カテゴリ"
                            remoteDataKey="master_event_categories"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            placeholder="---"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "カテゴリを選択してください" }}
                        />
                    )}
                </>
            )}
            <BaseGroupField<EventFormValuesType>
                id="metadata"
                formType="group"
                model={model}
                groupLabel="メタデータ"
                group={[
                    {
                        id: "metadata.description",
                        formType: "textarea",
                        label: "デスクリプション",
                        placeholder: "デスクリプションを入力してください",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.keywords",
                        formType: "textarea",
                        label: "キーワード",
                        placeholder: "キーワードを入力してください",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.file_id",
                        formType: "image",
                        label: "OGP画像(SNS投稿画像)",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.model",
                        formType: "input",
                        inputType: "hidden",
                        defaultValue: model,
                    },
                ]}
            />
            <Center
                bg="black"
                h="50px"
                p="3"
                justifyContent="left"
                alignItems="center"
                display="inline-flex"
                mt="3"
            >
                <Heading as="h6" size="md" color="white">
                    メイン画像
                </Heading>
            </Center>
            <BaseImageField<EventFormValuesType>
                id="file_id"
                formType="image"
                model={model}
                isConfirm={isConfirm}
                label=""
                defaultValue=""
            />
            <BaseInputField<EventFormValuesType>
                id="file_alt"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="代替テキスト"
                placeholder="代替テキストを入力してください"
                defaultValue=""
                inputOptions={{
                    "data-accessibility": "text,alt",
                    "data-accessibility-target": "file_id",
                }}
            />

            <BaseBlockField<EventFormValuesType>
                id="event_images"
                formType="block"
                model={model}
                blockModel={model}
                isConfirm={isConfirm}
                label="サブ画像"
                blockType="sub_image"
                defaultValue={[]}
                ignoreImageCaption={true}
                ignoreImageUrl={true}
            />
            <Box bg={"white"} borderWidth="1px" p="5" my="5" rounded="2xl">
                <Center
                    bg="gray.100"
                    h="30px"
                    w="full"
                    p=""
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    mt="3"
                >
                    <Heading as="h6" size="md">
                        位置情報
                    </Heading>
                </Center>

                <HStack>
                    <BaseInputField<EventFormValuesType>
                        id="postal_code"
                        formType="input"
                        model={model}
                        isConfirm={isConfirm}
                        label="郵便番号"
                        placeholder="郵便番号を入力してください"
                        defaultValue=""
                        // formControlOptions={{ isRequired: true }}
                        rule={{
                            pattern: {
                                value: /^[0-9\-]+$/,
                                message: "郵便番号の形式を確認してください",
                            },
                        }}
                    />

                    <ButtonGroup pt="8">
                        <Button
                            colorScheme="green"
                            type="button"
                            onClick={handleClick}
                        >
                            郵便番号から開催地を取得
                        </Button>
                    </ButtonGroup>
                </HStack>

                <BaseTextField<EventFormValuesType>
                    id="address"
                    formType="textarea"
                    model={model}
                    isConfirm={isConfirm}
                    label="住所"
                    placeholder="住所を入力してください"
                    defaultValue=""
                />

                <BaseInputField<EventFormValuesType>
                    id="lttd"
                    formType="input"
                    inputType="number"
                    inputOptions={{ step: 0.1 }}
                    model={model}
                    isConfirm={isConfirm}
                    label="緯度"
                    placeholder="緯度を入力してください"
                    defaultValue=""
                    // formControlOptions={{ isRequired: true }}
                    // rule={{
                    //     required: "緯度を入力してください",
                    // }}
                />
                <BaseInputField<EventFormValuesType>
                    id="lgtd"
                    formType="input"
                    inputType="number"
                    inputOptions={{ step: 0.1 }}
                    model={model}
                    isConfirm={isConfirm}
                    label="経度"
                    placeholder="経度を入力してください"
                    defaultValue=""
                    // formControlOptions={{ isRequired: true }}
                    // rule={{
                    //     required: "経度を入力してください",
                    // }}
                />
            </Box>
            <BaseDatePeriodField<EventFormValuesType>
                id="event_start_date"
                formType="datePeriod"
                model={model}
                isConfirm={isConfirm}
                periodLabel="設定中の開催日"
                periodConnector="~"
                defaultValue=""
                periodGroup={{
                    start: {
                        id: "event_start_date",
                        formType: "date",
                        defaultValue: "",
                        rule: {
                            required: "開催開始日を入力してください",
                        },
                    },
                    end: {
                        id: "event_end_date",
                        formType: "date",
                        defaultValue: "",
                        rule: {
                            required: "開催終了日を入力してください",
                        },
                    },
                }}
                formControlOptions={{ isRequired: true }}
            />

            <EventDatePicker defaultDate={data?.event_dates_values} />

            {meta && (
                <>
                    <BaseRemoteRadioField<EventFormValuesType>
                        id="event_date_type"
                        formType="remoteRadio"
                        label="開催期間の表示設定"
                        remoteDataKey="types"
                        meta={meta}
                        model={model}
                        isConfirm={isConfirm}
                        formControlOptions={{ isRequired: true, width: "60%" }}
                        rule={{
                            required: "開催期間の表示設定を選択してください",
                        }}
                    />
                </>
            )}
            <BaseTextField<EventFormValuesType>
                id="event_date_text"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label=""
                placeholder="表示用の開催日時を入力してください"
                defaultValue=""
            />
            <BaseTextField<EventFormValuesType>
                id="event_time"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="開催時間"
                placeholder="開催時間を入力してください"
                defaultValue=""
            />
            <BaseTextField<EventFormValuesType>
                id="price"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="料金"
                placeholder="料金を入力してください"
                defaultValue=""
            />
            <BaseTextField<EventFormValuesType>
                id="parking"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="駐車場"
                placeholder="駐車場を入力してください"
                defaultValue=""
            />
            <BaseTextField<EventFormValuesType>
                id="access"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="アクセス"
                placeholder="アクセスを入力してください"
                defaultValue=""
            />
            <BaseTextField<EventFormValuesType>
                id="remark"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="備考"
                placeholder="備考を入力してください"
                defaultValue=""
            />
            <Box bg={"white"} borderWidth="1px" p="5" my="5" rounded="2xl">
                <Center
                    bg="gray.100"
                    h="30px"
                    w="full"
                    p=""
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    mt="3"
                >
                    <Heading as="h6" size="md">
                        お問い合わせ先
                    </Heading>
                </Center>

                <BaseInputField<EventFormValuesType>
                    id="contact_title"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="名称"
                    placeholder="名称を入力してください"
                    defaultValue=""
                />
                <BaseInputField<EventFormValuesType>
                    id="contact_tel"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="電話番号"
                    placeholder="電話番号を入力してください"
                    defaultValue=""
                />
                <BaseInputField<EventFormValuesType>
                    id="contact_fax"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="FAX"
                    placeholder="FAXを入力してください"
                    defaultValue=""
                />
                <BaseInputField<EventFormValuesType>
                    id="contact_mail"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="メールアドレス"
                    placeholder="メールアドレスを入力してください"
                    defaultValue=""
                />
                <BaseInputField<EventFormValuesType>
                    id="contact_url"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="ホームページURL"
                    placeholder="ホームページURLを入力してください"
                    defaultValue=""
                />
                <BaseInputField<EventFormValuesType>
                    id="contact_url_title"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="ホームページ名"
                    placeholder="ホームページ名を入力してください"
                    defaultValue=""
                />
            </Box>
            <BaseBlockField<EventFormValuesType>
                id="event_links"
                formType="block"
                model={model}
                blockModel={model}
                isConfirm={isConfirm}
                label="関連リンク"
                blockType="related_link"
                defaultValue={[]}
            />
            <BaseBlockField<EventFormValuesType>
                id="event_files"
                formType="block"
                model={model}
                blockModel={model}
                isConfirm={isConfirm}
                label="関連ファイル"
                blockType="related_file"
                defaultValue={[]}
            />
        </Box>
    );
};

export default Form;

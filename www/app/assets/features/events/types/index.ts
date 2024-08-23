import { AdminType } from "@/features/admins";
import { FileType } from "@/features/files";
import { MasterEventCategoryType } from "@/features/master-event-categories";
import { MasterAreaType } from "@/features/master-areas";
import { SettingsEventType } from "@/features/mng-settings";
import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
    MetaUtilityType,
    BaseSelectOptions,
    CommonAnswerOptions,
    StringUtilityType,
    ApprovalRemandType,
} from "@/types";

export type EventDateTypeType = "range" | "step" | "text";

export type EventDateListType = {
    id: string;
    sequence: number;
    event_id: string;
    date: string;
};

/**
 * 追加していく
 */
export type EventType = {
    title: string;
    title_kana: string;
    file_id: string;
    file: FileType;
    file_alt: string;
    file_is_blank: string;
    file_caption: string;
    summary: string;
    published: string;
    start_date: string;
    end_date: string;
    application_start_date: string;
    application_end_date: string;
    event_date_text: string;
    event_start_date: string;
    event_end_date: string;
    event_dates: EventDateListType[];
    event_dates_values: string;
    postal_code: string;
    address: string;
    lttd: string;
    lgtd: string;
    master_areas: MasterAreaType[];
    master_area_id: string;
    master_area: MasterAreaType;
    master_event_categories: MasterEventCategoryType[];
    master_event_category_id: string;
    master_event_category: MasterEventCategoryType;
    event_date_type: EventDateTypeType;
    event_time: string;
    price: string;
    parking: string;
    access: string;
    remark: string;
    contact_title: string;
    contact_tel: string;
    contact_fax: string;
    contact_mail: string;
    contact_url: string;
    contact_url_title: string;
    event_links: BaseBlockEntityType[];
    event_files: BaseBlockEntityType[];
    event_images: BaseBlockEntityType[];
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
    // blocks: BaseBlockEntityType[];
    metadata?: MetadataType | null;
    is_top: keyof CommonAnswerOptions;
    approval_remands?: ApprovalRemandType[];
} & BaseEntityType;

export type EventListType = {
    data: EventType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type EventFormValuesType = Omit<EventType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type EventFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type EventMetaType = {
    master_areas?: BaseSelectOptions[];
    master_event_categories?: BaseSelectOptions[];
    types: Record<EventDateTypeType, string>;
    settings: SettingsEventType;
} & MetaUtilityType;

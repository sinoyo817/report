import { AdminType } from "@/features/admins";
import { FileType } from "@/features/files";
import { MasterTopicCategoryType } from "@/features/master-topic-categories";
import { SettingsTopicType } from "@/features/mng-settings";
import {
    ApprovalRemandType,
    BaseBlockEntityType,
    BaseEntityType,
    BaseSelectOptions,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    MetadataType,
    MetaUtilityType,
    ResoponseCollectionType,
} from "@/types";
export type TopicType = {
    title: string;
    published: string;
    start_date: string | null;
    end_date: string | null;
    url: string;
    url_is_blank: string;
    master_topic_category_id?: string;
    master_topic_category?: MasterTopicCategoryType;
    master_topic_categories?: MasterTopicCategoryType[];
    file_id?: string;
    file?: FileType;
    file_alt?: string;
    summary?: string;
    summary_files?: string;
    blocks: BaseBlockEntityType[];
    metadata?: MetadataType | null;
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
    approval_remands?: ApprovalRemandType[];
    slug?: string;
    _translations?: Record<string, Omit<TopicType, "_translations">>;
} & BaseEntityType;

export type TopicListType = {
    data: TopicType[];
    collection: ResoponseCollectionType;
};

export type TopicFormValuesType = Omit<TopicType, IgnoreFormFieldsType>;

export type TopicFilterParamType = CommonFilterParamType;

export type TopicMetaType = MetaUtilityType & {
    settings: SettingsTopicType;
    master_topic_categories?: BaseSelectOptions[];
};

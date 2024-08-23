import React from "react";
import { BaseBlockEntityType, CommonFieldOptionType } from "@/types";

import { Header01 } from "./Block/Header01";
import { Header02 } from "./Block/Header02";
import { Text } from "./Block/Text";
import { Wysiwyg } from "./Block/Wysiwyg";
import { Link } from "./Block/Link";
import { Iframe } from "./Block/Iframe";
import { Image } from "./Block/Image";
import { File } from "./Block/File";
import { ImageTwo } from "./Block/ImageTwo";
import { ImageText } from "./Block/ImageText";

type SelectBlockFieldProps<S extends BaseBlockEntityType> =
    CommonFieldOptionType & {
        id: string;
        index: number;
        field: Record<keyof S, string>;
    };

export const SelectBlockField = <S extends BaseBlockEntityType>(
    props: SelectBlockFieldProps<S>
) => {
    const { field } = props;

    const element = (() => {
        switch (field.type) {
            case "header01":
                return <Header01 {...props} />;
            case "header02":
                return <Header02 {...props} />;
            case "text":
                return <Text {...props} />;
            case "image":
                return <Image {...props} />;
            case "image_two":
                return <ImageTwo {...props} />;
            case "image_text":
                return <ImageText {...props} />;
            case "link":
                return <Link {...props} />;
            case "file":
                return <File {...props} />;
            case "wysiwyg":
                return <Wysiwyg {...props} />;
            case "iframe":
                return <Iframe {...props} />;
            default:
                return <></>;
        }
    })();

    return element;
};

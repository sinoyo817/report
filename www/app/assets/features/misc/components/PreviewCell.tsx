import React from "react";
import { adminPrefix } from "@/config";
import { ViewIcon } from "@chakra-ui/icons";
import { Link, LinkBox } from "@chakra-ui/react";
import { useContentsKey } from "../hooks/useContentsKey";

export type PreviewCellPropType = {
    id: string;
};

export const PreviewCell = (props: PreviewCellPropType) => {
    const { id } = props;
    const contentsKey = useContentsKey();

    return (
        <LinkBox>
            <Link
                target={"_blank"}
                href={`${adminPrefix}api/${contentsKey}/preview/${id}`}
            >
                <ViewIcon w={6} h={6} />
            </Link>
        </LinkBox>
    );
};

import React from "react";
import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export type CrudLinkPropType = {
    id: string;
    children: React.ReactNode;
    linkPrefix?: string;
} & LinkProps;

export const CrudLinkCell = (props: CrudLinkPropType) => {
    const { id, children, linkPrefix = "crud", ...linkProps } = props;

    return (
        <Link
            as={RouterLink}
            to={`${linkPrefix}/${id}`}
            // color="teal.400"
            textDecoration="underline"
            color="#0060DF"
            {...linkProps}
        >
            {children}
        </Link>
    );
};

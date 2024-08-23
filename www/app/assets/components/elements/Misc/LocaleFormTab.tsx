import React from "react";
import { Button, LinkBox, LinkOverlay, SimpleGrid } from "@chakra-ui/react";
import { useLocaleSetting } from "@/features/misc/api/getLocaleSettings";
import { adminPrefix, defaultLocale } from "@/config";
import { Link as RouterLink } from "react-router-dom";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";

export type LocaleFormTabType = {
    locale?: string;
    id: string;
};

export const LocaleFormTab = (props: LocaleFormTabType) => {
    const { locale, id } = props;
    const { data: localeSetting } = useLocaleSetting();

    const contentsKey = useContentsKey();

    const locales = localeSetting?.locales;

    if (!locales) {
        return <></>;
    }
    if (locales.length <= 1) {
        return <></>;
    }

    return (
        <SimpleGrid columns={5} spacing={2}>
            {locales.map((item) => (
                <LinkBox
                    key={item.locale}
                    as={Button}
                    colorScheme="teal"
                    isActive={
                        locale === item.locale ||
                        (locale === undefined && item.locale === defaultLocale)
                    }
                >
                    <LinkOverlay
                        as={RouterLink}
                        to={
                            item.locale !== defaultLocale
                                ? `${adminPrefix}${contentsKey}/crud/${item.locale}/${id}`
                                : `${adminPrefix}${contentsKey}/crud/${id}`
                        }
                        replace={true}
                    >
                        {item.title}
                    </LinkOverlay>
                </LinkBox>
            ))}
        </SimpleGrid>
    );
};

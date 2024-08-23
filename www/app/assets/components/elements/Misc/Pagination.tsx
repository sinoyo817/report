import React, { useMemo } from "react";
import { ResoponseCollectionType } from "@/types";
import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    IconButton,
    SimpleGrid,
    Text,
    Wrap,
} from "@chakra-ui/react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@chakra-ui/icons";
import { offsetRange } from "@/utils/offsetRange";

type PaginationProp = {
    collection: ResoponseCollectionType;
    setPagination: React.Dispatch<React.SetStateAction<number>>;
    pageNumber: number;
    pageNeighbours?: number;
};

export const Pagination = (props: PaginationProp) => {
    const { collection, setPagination, pageNumber, pageNeighbours = 2 } = props;
    const totalPages = collection.pages;
    const showPagination = totalPages > 1;

    const pages = useMemo(() => {
        const totalNumbers = pageNeighbours * 2 + 1;
        if (totalPages > totalNumbers) {
            const leftBound = pageNumber - pageNeighbours;
            const rightBound = pageNumber + pageNeighbours;

            const startPage = leftBound >= pageNeighbours ? leftBound : 1;
            const endPage = rightBound < totalPages ? rightBound : totalPages;

            const pages = offsetRange(startPage, endPage + 1);
            const pagesCount = pages.length;
            const singleSpillOffset = totalNumbers - pagesCount;

            const leftSpill = startPage > pageNeighbours;
            const rightSpill = endPage < totalPages;

            if (leftSpill && !rightSpill) {
                const extraPages = offsetRange(
                    startPage - singleSpillOffset,
                    startPage
                );
                return [...extraPages, ...pages];
            } else if (!leftSpill && rightSpill) {
                const extraPages = offsetRange(
                    endPage + 1,
                    endPage + singleSpillOffset + 1
                );
                return [...pages, ...extraPages];
            }

            return pages;
        }

        return offsetRange(1, totalPages + 1);
    }, [pageNumber, totalPages, pageNeighbours]);

    if (!showPagination) {
        return <></>;
    }

    const total = collection.total;
    const start =
        collection.next.length <= 0
            ? total - collection.count + 1
            : collection.count * (pageNumber - 1) + 1;
    const end =
        collection.next.length <= 0 ? total : collection.count * pageNumber;

    return (
        <SimpleGrid columns={1}>
            <Text textAlign="right">
                {total}件中、
                {start}～{end}
                件目 を表示しています
            </Text>
            <HStack my="3" justifyContent="right">
                <ButtonGroup spacing="1">
                    {totalPages > 2 && (
                        <IconButton
                            onClick={(e) => setPagination(1)}
                            disabled={pageNumber === 1}
                            aria-label="先頭へ"
                            icon={<ArrowLeftIcon />}
                        />
                    )}
                    <IconButton
                        onClick={(e) => setPagination(pageNumber - 1)}
                        disabled={collection.prev.length <= 0}
                        aria-label="前へ"
                        icon={<ChevronLeftIcon />}
                    />
                    {pages.map((page) => {
                        return pageNumber === page ? (
                            <Button
                                disabled
                                aria-label={`ページ:${page}`}
                                key={page}
                            >
                                {page}
                            </Button>
                        ) : (
                            <Button
                                aria-label={`ページ:${page}`}
                                onClick={(e) => setPagination(page)}
                                key={page}
                            >
                                {page}
                            </Button>
                        );
                    })}
                    <IconButton
                        onClick={(e) => setPagination(pageNumber + 1)}
                        disabled={collection.next.length <= 0}
                        aria-label="次へ"
                        icon={<ChevronRightIcon />}
                    />
                    {totalPages > 2 && (
                        <IconButton
                            onClick={(e) => setPagination(collection.pages)}
                            disabled={pageNumber === collection.pages}
                            aria-label="最後へ"
                            icon={<ArrowRightIcon />}
                        />
                    )}
                </ButtonGroup>
            </HStack>
        </SimpleGrid>
    );
};

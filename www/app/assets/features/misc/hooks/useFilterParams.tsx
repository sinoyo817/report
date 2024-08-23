import React, { useCallback, useEffect, useState } from "react";
import { useContentsKey } from "./useContentsKey";
import { useRecoilState } from "recoil";
import { filterStateAtom } from "@/stores/atom";

export const useFilterParams = () => {
    const [filter, setFilter] = useRecoilState(filterStateAtom);
    const contentsKey = useContentsKey();
    const initialPage =
        contentsKey && filter && contentsKey in filter
            ? filter[contentsKey].page || 1
            : 1;
    const initialPageLimit =
        contentsKey && filter && contentsKey in filter
            ? filter[contentsKey].limit || 20
            : 20;

    const [pageNumber, setPagination] = useState(initialPage);
    const [pageLimit, setPageLimit] = useState(initialPageLimit);

    const getContentsFilter = useCallback(() => {
        if (contentsKey) {
            if (filter && contentsKey in filter) {
                return filter[contentsKey];
            }

            return { page: 1 };
        }
        return undefined;
    }, [contentsKey, filter]);

    const setContentsFilter = (param: Record<string, unknown>) => {
        if (contentsKey) {
            if (filter && contentsKey in filter) {
                const update = {
                    [contentsKey]: { ...filter[contentsKey], ...param },
                };
                setFilter({ ...filter, ...update });
            } else {
                const update = { [contentsKey]: param };
                setFilter({ ...filter, ...update });
            }
        }
    };

    useEffect(() => {
        if (pageNumber) {
            setContentsFilter({ page: pageNumber });
        }
    }, [pageNumber]);

    useEffect(() => {
        if (pageLimit && pageLimit !== initialPageLimit) {
            setContentsFilter({ page: 1, limit: pageLimit });
            setPagination(1);
        }
    }, [pageLimit]);

    return {
        getContentsFilter,
        setContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    };
};

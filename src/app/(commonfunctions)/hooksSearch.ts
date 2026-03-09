import { RequestParamLimitPage } from "@/type/pageType";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getSearchUser } from "./apiSearch";
import { UserSearchResponse } from "./searchType";

export const useGetSearchUser = (params: RequestParamLimitPage) => {
    return useInfiniteQuery<UserSearchResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['search-user', params],
        queryFn: ({ pageParam }) => getSearchUser({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            return (responseData.data.pagination.page < responseData.data.pagination.totalPages) ? responseData.data.pagination.page + 1 : undefined;
        },
        enabled: !!params.q && params.q.length > 0
    });
}
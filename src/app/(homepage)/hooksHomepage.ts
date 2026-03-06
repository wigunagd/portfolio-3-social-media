import { AxiosError } from "axios";
import { FeedParam, FeedResponse } from "./pageType";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFeed, getSaved } from "./apiHomepage";

export const useGetFeed = (params: FeedParam) => {
    return useInfiniteQuery<FeedResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['feed', params],
        queryFn: ({ pageParam }) => getFeed({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            return (responseData.data.pagination.page < responseData.data.pagination.totalPages) ? responseData.data.pagination.page + 1 : undefined;
        }
    });
}

export const useGetSaved = (params: FeedParam) => {
    return useQuery<FeedResponse, AxiosError>({
        queryKey: ['liked', params],
        queryFn: () => getSaved(params),
    });
}
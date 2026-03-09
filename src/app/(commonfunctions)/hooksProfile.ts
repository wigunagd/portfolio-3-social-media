import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ProfileResponse } from "./profileType";
import { AxiosError } from "axios";
import { getPostLikedByUser, getSavedFromProfile, getUserPosts, getUserProfile } from "./apiProfile";
import { FeedResponse, RequestParamLimitPage } from "@/type/pageType";

export const useGetUserProfile = (username: string | undefined) => {
    return useQuery<ProfileResponse, AxiosError>({
        queryKey: ['profile'],
        queryFn: () => getUserProfile({ username: username }),
        enabled: !!username
    });
}

export const useGetUserPosts = (params: RequestParamLimitPage) => {
    return useInfiniteQuery<FeedResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['userPosts', params],
        queryFn: ({ pageParam }) => getUserPosts({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            return (responseData.data.pagination.page < responseData.data.pagination.totalPages) ? responseData.data.pagination.page + 1 : undefined;
        },
        enabled: !!params.username
    });
}

export const useGetPostLikedByUser = (params: RequestParamLimitPage) => {
    return useInfiniteQuery<FeedResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['saved-from-profile', params],
        queryFn: ({ pageParam }) => getPostLikedByUser({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            const { page, totalPages } = responseData.data.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: !!params.trigger
    });
}

export const useGetSavedByUser = (params: RequestParamLimitPage) => {
    return useInfiniteQuery<FeedResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['saved-from-profile', params],
        queryFn: ({ pageParam }) => getSavedFromProfile({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            const { page, totalPages } = responseData.data.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        enabled: !!params.trigger
    });
}
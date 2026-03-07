import { AxiosError } from "axios";
import { FeedParam, FeedResponse, LikeResponse, PostCommentResponse, PostLikesResponse, SavedResponse } from "../../type/pageType";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getFeed, getPostComments, getPostLikes, getSaved, removeLike, removeSave, setLike, setSave } from "./apiHomepage";

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

export const useSetSave = () => {
    return useMutation<SavedResponse, AxiosError, number>({
        mutationFn: (id: number) => setSave(id)
    });
}

export const useRemoveSave = () => {
    return useMutation<SavedResponse, AxiosError, number>({
        mutationFn: (id: number) => removeSave(id)
    });
}

export const useGetSaved = (params: FeedParam) => {
    return useQuery<FeedResponse, AxiosError>({
        queryKey: ['liked', params],
        queryFn: () => getSaved(params),
    });
}

export const useSetLike = () => {
    return useMutation<LikeResponse, AxiosError, number>({
        mutationFn: (id: number) => setLike(id)
    });
}

export const useRemoveLike = () => {
    return useMutation<LikeResponse, AxiosError, number>({
        mutationFn: (id: number) => removeLike(id)
    });
}

export const useGetPostLikes = (params: FeedParam) => {
    return useInfiniteQuery<PostLikesResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['postLikes', params.id],
        queryFn: ({ pageParam }) => getPostLikes({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            return (responseData.data.pagination.page < responseData.data.pagination.totalPages) ? responseData.data.pagination.page + 1 : undefined;
        },
        enabled: params.id !== 0
    });
}

export const useGetPostComments = (params: FeedParam) => {
    return useInfiniteQuery<PostCommentResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['postComments', params.id],
        queryFn: ({ pageParam }) => getPostComments({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            return (responseData.data.pagination.page < responseData.data.pagination.totalPages) ? responseData.data.pagination.page + 1 : undefined;
        },
        enabled: params.id !== 0
    });
}
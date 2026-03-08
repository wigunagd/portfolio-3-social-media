import { AxiosError } from "axios";
import { FeedParam, FeedResponse, PostCommentResponse, PostLikesResponse } from "../../type/pageType";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useGetSaved = (params: FeedParam) => {
    return useInfiniteQuery<FeedResponse, AxiosError>({
        initialPageParam: 1,
        queryKey: ['saved', params],
        queryFn: ({ pageParam }) => getSaved({ ...params, page: pageParam as number }),
        getNextPageParam: (responseData) => {
            const { page, totalPages } = responseData.data.pagination;
            return page < totalPages ? page + 1 : undefined;
        }
    });
}

export const useSaveAction = (params: FeedParam) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isSaved }: { id: number; isSaved: boolean }) =>
            isSaved ? removeSave(id) : setSave(id),

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ['feed', params] });
            const previousData = queryClient.getQueryData<InfiniteData<FeedResponse>>(['feed', params]);

            queryClient.setQueryData<InfiniteData<FeedResponse>>(['feed', params], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            posts: page.data.posts.map((post) =>
                                post.id === id
                                    ? { ...post, isSaved: !post.isSaved }
                                    : post
                            )
                        }
                    }))
                };
            });

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['feed', params], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['feed', params] });
            queryClient.invalidateQueries({ queryKey: ['saved'] });
        }
    });
};

export const useLikeAction = (params: FeedParam) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isLiked }: { id: number; isLiked: boolean }) =>
            isLiked ? removeLike(id) : setLike(id),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ['feed', params] });
            const previousData = queryClient.getQueryData<InfiniteData<FeedResponse>>(['feed', params]);

            queryClient.setQueryData<InfiniteData<FeedResponse>>(['feed', params], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            posts: page.data.posts.map((post) =>
                                post.id === id
                                    ? {
                                        ...post,
                                        likedByMe: !post.likedByMe,
                                        likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1
                                    }
                                    : post
                            )
                        }
                    }))
                };
            });
            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['feed', params], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['feed', params] });
        }
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
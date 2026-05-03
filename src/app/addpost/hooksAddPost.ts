import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AddPostResponse } from "./addPostType"
import { doAddPost } from "./apiAddPost"

export const useDoAddPost = () => {
    const queryClient = useQueryClient();
    return useMutation<AddPostResponse, AxiosError, FormData>({
        mutationFn: (body) => doAddPost(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed'] });
        }
    })
}
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { AddPostResponse } from "./addPostType"
import { doAddPost } from "./apiAddPost"

export const useDoAddPost = () => {
    return useMutation<AddPostResponse, AxiosError, FormData>({
        mutationFn: (body) => doAddPost(body)
    })
}
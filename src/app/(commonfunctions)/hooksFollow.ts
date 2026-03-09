import { useMutation } from "@tanstack/react-query"
import { doFollow, doUnFollow } from "./apiFollow"

export const useFollowAction = () => {
    return useMutation({
        mutationFn: ({ username, following }: { username: string; following: boolean }) =>
            following ? doUnFollow(username) : doFollow(username)
    })
}
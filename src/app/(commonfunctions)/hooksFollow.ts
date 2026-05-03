import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { doFollow, doUnFollow } from "./apiFollow";
import { FollowResponse } from "./followType";

interface UserProfile {
  id: string;
  username: string;
  following: boolean;
  followerCount: number;
}

interface MutationVariables {
  username: string;
  following: boolean;
}

interface FollowMutationContext {
  previousData: UserProfile | undefined;
}

export const useFollowAction = () => {
  const queryClient = useQueryClient();

  return useMutation<FollowResponse, Error, MutationVariables, FollowMutationContext>({
    mutationFn: ({ username, following }) =>
      following ? doUnFollow(username) : doFollow(username),

    onMutate: async ({ following }) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      const previousData = queryClient.getQueryData<UserProfile>(['profile']);
      queryClient.setQueryData<UserProfile>(['profile'], (old) => {
        if (!old) return undefined;
        return {
          ...old,
          following: !following,
          followerCount: !following ? old.followerCount + 1 : old.followerCount - 1,
        };
      });
      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<UserProfile>(['profile'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};


/* 
// kode lama
export const useFollowAction = () => {
    return useMutation({
        mutationFn: ({ username, following }: { username: string; following: boolean }) =>
            following ? doUnFollow(username) : doFollow(username)
    })
} 
*/
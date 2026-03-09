import { useQuery } from "@tanstack/react-query";
import { ProfileResponse } from "./profileType";
import { AxiosError } from "axios";
import { getUserProfile } from "./apiProfile";

export const useGetUserProfile = (username: string | undefined) => {
    return useQuery<ProfileResponse, AxiosError>({
        queryKey: ['profile'],
        queryFn: () => getUserProfile({ username: username }),
        enabled: !!username
    });
}
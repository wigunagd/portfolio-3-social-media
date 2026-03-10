import { useMutation } from "@tanstack/react-query"
import { UpdateProfileResponse } from "./updateProfileType"
import { AxiosError } from "axios"
import { doUpdateProfile } from "./apiUpdateProfile"

export const useDoUpdateProfile = () => {
    return useMutation<UpdateProfileResponse, AxiosError, FormData>({
        mutationFn: (body) => doUpdateProfile(body)
    })
}
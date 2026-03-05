import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { doRegister } from "./apiRegister";
import { RegisterBody, RegisterResponse } from "./typeRegister";

export const useDoRegister = () => {
    return useMutation<RegisterResponse, AxiosError, RegisterBody>({
        mutationFn: (body) => doRegister(body)
    })
}
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { doLogin } from "./apiLogin";
import { LoginBody, LoginResponse } from "./typeLogin";

export const useDoLogin = () => {
    return useMutation<LoginResponse, AxiosError, LoginBody>({
        mutationFn: (body) => doLogin(body)
    })
}
import { apiAxios } from '@/lib/apiAxios';
import { LoginBody } from './typeLogin';

export const doLogin = async ({ email, password }: LoginBody) => {
    const response = await apiAxios.post("/api/auth/login", {
        email: email,
        password: password
    });

    return response.data;
}
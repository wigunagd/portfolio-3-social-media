import { apiAxios } from '@/lib/apiAxios';
import { RegisterBody } from './typeRegister';

export const doRegister = async ({ name, username, email, phone, password }: RegisterBody) => {
    const response = await apiAxios.post("/api/auth/register", {
        name: name,
        username: username,
        email: email,
        phone: phone,
        password: password
    });

    return response.data;
}
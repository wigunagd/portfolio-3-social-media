import { apiAxios } from "@/lib/apiAxios";

export const getUserProfile = async ({ username }: { username: string | undefined }) => {
    const response = await apiAxios.get(`/api/users/${username}`);
    return response.data;
}
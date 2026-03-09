import { apiAxios } from "@/lib/apiAxios";

export const doFollow = async (username: string) => {
    const response = await apiAxios.post(`/api/follow/${username}`);
    return response.data;
}

export const doUnFollow = async (username: string) => {
    const response = await apiAxios.delete(`/api/follow/${username}`);
    return response.data;
}
import { apiAxios } from "@/lib/apiAxios";

export const doUpdateProfile = async (formdata: FormData) => {
    const response = await apiAxios.patch(`/api/me`, formdata);
    return response.data;
}
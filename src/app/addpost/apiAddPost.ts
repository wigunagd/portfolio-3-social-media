import { apiAxios } from "@/lib/apiAxios";

export const doAddPost = async (formdata: FormData) => {
    const response = await apiAxios.post(`/api/posts`, formdata);
    return response.data;
}
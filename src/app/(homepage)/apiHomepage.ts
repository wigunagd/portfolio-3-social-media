import { apiAxios } from "@/lib/apiAxios";
import { FeedParam } from "../../type/pageType";

export const getFeed = async ({ limit, page }: FeedParam) => {
    const response = await apiAxios.get("/api/posts", {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const setSave = async (id: number) => {
    const response = await apiAxios.post(`/api/posts/${id}/save`);
    return response.data;
}

export const removeSave = async (id: number) => {
    const response = await apiAxios.delete(`/api/posts/${id}/save`);
    return response.data;
}

export const getSaved = async ({ limit, page }: FeedParam) => {
    const response = await apiAxios.get("/api/me/saved", {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const setLike = async (id: number) => {
    const response = await apiAxios.post(`/api/posts/${id}/like`);
    return response.data;
}

export const removeLike = async (id: number) => {
    const response = await apiAxios.delete(`/api/posts/${id}/like`);
    return response.data;
}
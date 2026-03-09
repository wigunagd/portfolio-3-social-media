import { apiAxios } from "@/lib/apiAxios";
import { RequestParamLimitPage, PostCommentBody } from "../../type/pageType";

export const getFeed = async ({ limit, page }: RequestParamLimitPage) => {
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

export const getSaved = async ({ limit, page }: RequestParamLimitPage) => {
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

export const getPostLikes = async ({ limit, page, id }: RequestParamLimitPage) => {
    const response = await apiAxios.get(`/api/posts/${id}/likes`, {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const getPostComments = async ({ limit, page, id }: RequestParamLimitPage) => {
    const response = await apiAxios.get(`/api/posts/${id}/comments`, {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const sendComment = async ({ id, text }: PostCommentBody) => {
    const response = await apiAxios.post(`/api/posts/${id}/comments`, {
        text: text
    });
    return response.data;
}
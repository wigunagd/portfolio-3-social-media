import { apiAxios } from "@/lib/apiAxios";
import { RequestParamLimitPage } from "@/type/pageType";

export const getUserProfile = async ({ username }: { username: string | undefined }) => {
    const response = await apiAxios.get(`/api/users/${username}`);
    return response.data;
}

export const getUserPosts = async ({ limit, page, username }: RequestParamLimitPage) => {
    const response = await apiAxios.get(`/api/users/${username}/posts`, {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const getPostLikedByUser = async ({ limit, page, username }: RequestParamLimitPage) => {
    const response = await apiAxios.get(`/api/users/${username}/likes`, {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}

export const getSavedFromProfile = async ({ limit, page }: RequestParamLimitPage) => {
    const response = await apiAxios.get("/api/me/saved", {
        params: {
            limit: limit,
            page: page
        }
    });

    return response.data;
}
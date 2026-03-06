import { apiAxios } from "@/lib/apiAxios";
import { FeedParam } from "./pageType";

export const getFeed = async ({ limit, page }: FeedParam) => {
    const response = await apiAxios.get("/api/posts", {
        params: {
            limit: limit,
            page: page
        }
    });

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
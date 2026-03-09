import { apiAxios } from "@/lib/apiAxios";
import { RequestParamLimitPage } from "@/type/pageType";

export const getSearchUser = async ({ limit, page, q }: RequestParamLimitPage) => {
    const response = await apiAxios.get("/api/users/search", {
        params: {
            limit: limit,
            page: page,
            q: q
        }
    });

    return response.data;
}
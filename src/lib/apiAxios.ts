import axios from "axios";
import { store } from "@/redux/3_redux";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiAxios = axios.create({
    baseURL: API_BASE_URL
});

apiAxios.interceptors.request.use((config) => {
    const state = store.getState();
    if (state.auth.isLoggedin) {
        config.headers.Authorization = `Bearer ${state.auth.accessToken}`
        return config
    }

    return config;
});
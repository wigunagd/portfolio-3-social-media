import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./1_authSlice";

export const allReducers = combineReducers({
    auth: authReducer
});
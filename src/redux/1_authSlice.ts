import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from './0_authType';
import { LoginData } from '@/app/login/typeLogin';
import { UpdateProfileResponse } from '@/app/updateprofile/updateProfileType';

const initialState: AuthState = {
    isLoggedin: false,
    accessToken: "",
    loginId: 0,
    loginUserName: "",
    loginName: "",
    avatarUrl: ""
}

export const authSlice = createSlice({
    name: 'auth/slice',
    initialState: initialState,
    reducers: {
        setLoginData: (state, action: PayloadAction<LoginData>) => {
            state.isLoggedin = true;
            state.accessToken = action.payload.token;
            state.loginId = action.payload.user.id;
            state.loginUserName = action.payload.user.username;
            state.loginName = action.payload.user.name;
            state.avatarUrl = action.payload.user.avatarUrl;
        },
        updateLoginData: (state, action: PayloadAction<UpdateProfileResponse>) => {
            state.loginId = action.payload.data.id;
            state.loginUserName = action.payload.data.username;
            state.loginName = action.payload.data.name;
            state.avatarUrl = action.payload.data.avatarUrl;
        },
        logout: (state) => {
            state.accessToken = "";
            state.isLoggedin = false;
            state.loginId = 0;
            state.loginUserName = "";
            state.loginName = "";
            state.avatarUrl = "";
        }
    }
});

export const { setLoginData, updateLoginData, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
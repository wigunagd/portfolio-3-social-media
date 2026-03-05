import { useAppDispatch } from "@/redux/3_redux";
import { LoginData } from "./typeLogin";
import { setLoginData } from "@/redux/1_authSlice";

export function ForceLogin (){
    const dispatch = useAppDispatch();
    const forceLogin: LoginData = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiIiwiaWF0IjoxNzcyNzE2ODM1LCJleHAiOjE3NzMzMjE2MzV9.ZgnstY_yTiFBV6jjZCOiuj8VSODg2vfwApkk7D3MtA0',
        user: {
            id: 17,
            name: 'Lysander Balini',
            username: '',
            email: '',
            phone: '',
            avatarUrl: 'https://res.cloudinary.com/dvz5kmwqx/image/upload/v1772716441/sociality/avatars/snh8ohvszuoiwbwreses.jpg'
        }
    }
    dispatch(setLoginData(forceLogin));
}
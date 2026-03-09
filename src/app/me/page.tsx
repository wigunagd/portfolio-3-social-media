'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";

const Me = () => {
    const authState = useAppSelector((state) => state.auth);
    const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">
            <NavigationBar
                isLoggedIn={isLoggedIn}
                loginName={authState.loginName}
                avatarUrl={authState.avatarUrl} />
            <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 mb-30 md:mb-35">
                <div>My Profile</div>
            </main>
        </div>
    )
}

export default Me;
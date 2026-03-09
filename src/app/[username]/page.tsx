'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { useParams } from "next/navigation";

const Profile = () => {
    const params = useParams();
    const username = params.username;

    const authState = useAppSelector((state) => state.auth);
    // const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">
            <NavigationBar authState={authState} />
            <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 mb-30 md:mb-35">
                <div>Profile ID: {username}</div>
            </main>
        </div>
    );
};

export default Profile;
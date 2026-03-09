'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { icCheckCircle, icGrid0, icGrid1, iconLike0, iconLike3, iconSave0, iconSave1, iconShare, imgProfileTemp } from "../../../public/images/asset";
import { useGetUserProfile } from "../(commonfunctions)/hooksProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

const Profile = () => {
    const params = useParams();
    const username = typeof params?.username === 'string' ? params.username : undefined;

    const router = useRouter();
    const authState = useAppSelector((state) => state.auth);
    const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    const [activeTab, setActiveTab] = useState<1 | 2>(1);

    const handleActiveTab = () => {
        const a = activeTab === 1 ? 2 : 1;
        setActiveTab(a);
    }

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const {
        data: dataProfile,
        isLoading: isLoadingProfile
    } = useGetUserProfile(username);

    if (isLoadingProfile) {
        return (
            <div className="flex h-64 w-full items-center justify-center gap-2">
                <Spinner className="h-8 w-8" /> Loading profile
            </div>
        )
    }

    const isMe = authState.loginUserName === dataProfile?.data.username;

    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">
            
            <NavigationBar authState={authState} isMe={isMe} />
            
            <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 py-10 mb-30 md:mb-35">
                <section id="profie-section" className="flex flex-col w-full md:max-w-203 gap-4 mx-auto">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">

                        <div className="flex gap-3 md:gap-5 w-full md:w-fit">
                            <div className="relative shrink-0 rounded-full overflow-hidden w-11 h-11 md:w-16 md:h-16">
                                <Image src={dataProfile?.data.avatarUrl ??
                                    imgProfileTemp} alt={`profile picture ${username}`}
                                    width={64} height={64}
                                    className="rounded-full w-11 h-11 md:w-16 md:h-16 object-cover" />
                            </div>
                            <div className="flex flex-col justify-center text-sm md:text-md">
                                <span className="font-bold">{dataProfile?.data.name}</span>
                                <span>{dataProfile?.data.username}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center w-full md:w-fit">
                            {
                                isMe && (
                                    <Button
                                        id="button-edit-profile"
                                        variant={'ghost'}
                                        className="flex-1 text-sm md:text-md font-bold border border-neutral-900 rounded-full h-12">Edit Profile</Button>
                                )
                            }

                            {
                                !isMe && (
                                    dataProfile?.data.isFollowing
                                        ? (
                                            <Button variant={'ghost2'}
                                                className="flex px-4 flex-1 h-10 rounded-full border border-neutral-600"><Image src={icCheckCircle} alt="check followed" width={20} height={20} />Following</Button>
                                        )
                                        : (
                                            <Button className="flex px-6 flex-1 h-10 rounded-full">Follow</Button>
                                        )
                                )
                            }

                            <Button
                                id="button-share-profile"
                                variant={'ghost'}
                                className="text-sm md:text-md font-bold items-center justify-center border border-neutral-900 rounded-full w-12 h-12 p-0">
                                <Image src={iconShare} alt="icon share" width={24} height={24} />
                            </Button>
                        </div>


                    </div>

                    <div className="flex w-full">{dataProfile?.data.bio}</div>

                    <div className="flex justify-between w-full gap-6">

                        <div className="flex flex-col flex-1 items-center gap-0.5">
                            <span className="text-lg font-bold">{dataProfile?.data.counts.post}</span>
                            <span className="text-xs">Post</span>
                        </div>

                        <div className="border-l border-neutral-900" />

                        <div className="flex flex-col flex-1 items-center gap-0.5">
                            <span className="text-lg font-bold">{dataProfile?.data.counts.followers}</span>
                            <span className="text-xs">Followers</span>
                        </div>

                        <div className="border-l border-neutral-900" />

                        <div className="flex flex-col flex-1 items-center gap-0.5">
                            <span className="text-lg font-bold">{dataProfile?.data.counts.following}</span>
                            <span className="text-xs">Following</span>
                        </div>

                        <div className="border-l border-neutral-900" />

                        <div className="flex flex-col flex-1 items-center gap-0.5">
                            <span className="text-lg font-bold">{dataProfile?.data.counts.likes}</span>
                            <span className="text-xs">Likes</span>
                        </div>

                    </div>

                    <div className="flex w-full gap-6">

                        <Tabs defaultValue="tab1" className="w-full">
                            <TabsList variant="line" className="w-full">
                                <TabsTrigger onClick={handleActiveTab} value="tab1" className="w-full h-12 gap-3">
                                    <Image src={activeTab === 1 ? icGrid1 : icGrid0} alt="grid" width={24} height={24} />
                                    Gallery
                                </TabsTrigger>
                                {
                                    !isMe && (
                                        <TabsTrigger onClick={handleActiveTab} value="tab2" className="w-full h-12 gap-3">
                                            <Image src={activeTab === 2 ? iconLike3 : iconLike0} alt="grid" width={24} height={24} />
                                            Liked
                                        </TabsTrigger>
                                    )
                                }
                                {
                                    isMe && (
                                        <TabsTrigger onClick={handleActiveTab} value="tab2" className="w-full h-12 gap-3">
                                            <Image src={activeTab === 2 ? iconSave1 : iconSave0} alt="grid" width={24} height={24} />
                                            Saved
                                        </TabsTrigger>
                                    )
                                }

                            </TabsList>
                            <TabsContent value="tab1">
                                Tab 1
                            </TabsContent>
                            <TabsContent value="tab2">
                                Tab 2
                            </TabsContent>
                        </Tabs>

                    </div>

                </section>
            </main>
        </div>
    );
};

export default Profile;
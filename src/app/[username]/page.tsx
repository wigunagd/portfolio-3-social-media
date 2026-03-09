'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { icCheckCircle, icGrid0, icGrid1, iconLike0, iconLike3, iconSave0, iconSave1, iconShare, imgProfileTemp } from "../../../public/images/asset";
import { useGetPostLikedByUser, useGetSavedByUser, useGetUserPosts, useGetUserProfile } from "../(commonfunctions)/hooksProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { ProfileFeedLayout } from "@/components/ProfileFeedLayout";
import { useFollowAction } from "../(commonfunctions)/hooksFollow";
import { useQueryClient } from "@tanstack/react-query";
import { FollowResponse } from "../(commonfunctions)/followType";
import Link from "next/link";

const Profile = () => {
    const params = useParams();
    const username = typeof params?.username === 'string' ? params.username : undefined;

    const router = useRouter();
    const authState = useAppSelector((state) => state.auth);
    const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    const [activeTab, setActiveTab] = useState<1 | 2>(1);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const {
        data: dataProfile,
        isLoading: isLoadingProfile
    } = useGetUserProfile(username);

    const limitPost = 12;

    const {
        data: dataPost,
        isLoading: isLoadingPost,
        isFetchingNextPage: isFetchingNextPagePost,
        fetchNextPage: fetchNextPagePost,
        hasNextPage: hasNextPagePost
    } = useGetUserPosts({ page: 1, limit: limitPost, username: username });

    const isMe = authState.loginUserName === dataProfile?.data.username;

    const {
        data: dataPostLiked,
        isLoading: isLoadingPostLiked,
        isFetchingNextPage: isFetchingNextPagePostLiked,
        fetchNextPage: fetchNextPagePostLiked,
        hasNextPage: hasNextPagePostLiked
    } = useGetPostLikedByUser({ page: 1, limit: limitPost, username: username, trigger: !isMe });
    console.log(dataPostLiked, 'dataPostLiked');

    const {
        data: dataPostSaved,
        isLoading: isLoadingPostSaved,
        isFetchingNextPage: isFetchingNextPagePostSaved,
        fetchNextPage: fetchNextPagePostSaved,
        hasNextPage: hasNextPagePostSaved
    } = useGetSavedByUser({ page: 1, limit: limitPost, trigger: isMe });
    console.log(dataPostSaved, 'dataPostSaved');

    const autoFetchRefTab1 = useRef<HTMLDivElement>(null);
    const autoFetchRefTab2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPagePost && !isFetchingNextPagePost) {
                    fetchNextPagePost();
                }
            },
            {
                threshold: 0.1
            }
        );

        if (autoFetchRefTab1.current) {
            observer.observe(autoFetchRefTab1.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPagePost, hasNextPagePost, isFetchingNextPagePost]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPagePostSaved && !isFetchingNextPagePostSaved && isMe) {
                    fetchNextPagePostSaved();
                }

                if (entries[0].isIntersecting && hasNextPagePostLiked && !isFetchingNextPagePostLiked && !isMe) {
                    fetchNextPagePostLiked();
                }
            },
            {
                threshold: 0.1
            }
        );

        if (autoFetchRefTab2.current) {
            observer.observe(autoFetchRefTab2.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPagePostLiked, fetchNextPagePostSaved, hasNextPagePostLiked, hasNextPagePostSaved, isFetchingNextPagePostLiked, isFetchingNextPagePostSaved, isMe]);

    const queryClient = useQueryClient();
    const { mutate: mutateFollowAction, isPending: isPendingFollowAction } = useFollowAction();

    const doMutateFollowAction = () => {
        if (username && dataProfile) {
            mutateFollowAction({
                username: username,
                following: dataProfile?.data.isFollowing
            }, {
                onSuccess: (response: FollowResponse) => {
                    dataProfile.data.isFollowing = response.data.following;
                    queryClient.invalidateQueries({ queryKey: ['profile'] })
                }
            });
        }
    }

    if (isLoadingProfile) {
        return (
            <div className="flex h-64 w-full items-center justify-center gap-2">
                <Spinner className="h-8 w-8" /> Loading profile
            </div>
        )
    }

    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">

            <NavigationBar authState={authState} profileName={dataProfile?.data.name} />

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
                                        asChild
                                        id="button-edit-profile"
                                        variant={'ghost'}
                                        className="flex-1 text-sm md:text-md font-bold border border-neutral-900 rounded-full h-12"><Link href="/updateprofile">Edit Profile</Link></Button>
                                )
                            }

                            {
                                !isMe && (
                                    dataProfile?.data.isFollowing
                                        ? (
                                            <Button
                                                onClick={doMutateFollowAction}
                                                disabled={isPendingFollowAction}
                                                variant={'ghost2'}
                                                className="flex px-4 flex-1 h-10 rounded-full border border-neutral-600">{isPendingFollowAction ? (<Spinner />) : (<Image src={icCheckCircle} alt="check followed" width={20} height={20} />)}Following</Button>
                                        )
                                        : (
                                            <Button
                                                onClick={doMutateFollowAction}
                                                disabled={isPendingFollowAction}
                                                className="flex px-6 flex-1 h-10 rounded-full">{isPendingFollowAction && (<Spinner />)} Follow</Button>
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
                                <TabsTrigger onClick={() => setActiveTab(1)} value="tab1" className="w-full h-12 gap-3">
                                    <Image src={activeTab === 1 ? icGrid1 : icGrid0} alt="grid" width={24} height={24} />
                                    Gallery
                                </TabsTrigger>
                                {
                                    !isMe && (
                                        <TabsTrigger onClick={() => setActiveTab(2)} value="tab2" className="w-full h-12 gap-3">
                                            <Image src={activeTab === 2 ? iconLike3 : iconLike0} alt="grid" width={24} height={24} />
                                            Liked
                                        </TabsTrigger>
                                    )
                                }
                                {
                                    isMe && (
                                        <TabsTrigger onClick={() => setActiveTab(2)} value="tab2" className="w-full h-12 gap-3">
                                            <Image src={activeTab === 2 ? iconSave1 : iconSave0} alt="grid" width={24} height={24} />
                                            Saved
                                        </TabsTrigger>
                                    )
                                }

                            </TabsList>
                            <TabsContent value="tab1">
                                <div className="grid grid-cols-3 py-6 w-full gap-1" hidden={dataPost?.pages[0].data.posts.length === 0}>
                                    {
                                        dataPost?.pages.map(page => {
                                            return (
                                                page.data.posts.map(post => (
                                                    <ProfileFeedLayout key={post.id} imageUrl={post.imageUrl} />
                                                ))
                                            )
                                        })
                                    }



                                </div>

                                {
                                    (isLoadingPost || isFetchingNextPagePost && (
                                        <div className="flex w-full items-center justify-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
                                    ))
                                }

                                {
                                    isMe && dataPost?.pages[0].data.posts.length === 0 && (
                                        <div className="flex w-full min-h-100 items-center justify-center gap-4">
                                            <div className="flex flex-col gap-6 text-center w-full max-w-113.25">
                                                <span className="text-lg font-bold">Your story starts here</span>
                                                <span className="text-md">Share your first post and let the world see your moments, passions, and memories. Make this space truly yours.</span>
                                                <Button asChild className="rounded-full mx-auto h-12 w-full max-w-64.75">
                                                    <a href="/addpost" className="text-md font-bold">Upload My First Post</a>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }
                            </TabsContent>
                            <TabsContent value="tab2">
                                <div className="grid grid-cols-3 py-6 w-full gap-1">
                                    {
                                        isMe && dataPostSaved?.pages.map(page => {
                                            return (
                                                page.data.posts.map(post => (
                                                    <ProfileFeedLayout key={post.id} imageUrl={post.imageUrl} />
                                                ))
                                            )
                                        })
                                    }

                                    {
                                        !isMe && dataPostLiked?.pages.map(page => {
                                            return (
                                                page.data.posts.map(post => (
                                                    <ProfileFeedLayout key={post.id} imageUrl={post.imageUrl} />
                                                ))
                                            )
                                        })
                                    }


                                </div>

                                {
                                    (isLoadingPostSaved || isFetchingNextPagePostSaved || isLoadingPostLiked || isFetchingNextPagePostLiked && (
                                        <div className="flex w-full items-center justify-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
                                    ))
                                }
                            </TabsContent>
                        </Tabs>

                    </div>

                    <div ref={autoFetchRefTab1} className={`${hasNextPagePost ? 'h-10' : 'h-0'}`} />
                    <div ref={autoFetchRefTab2} className={`${hasNextPagePostLiked ? 'h-10' : 'h-0'}`} />

                </section>
            </main>

            <BottomNavigationBar page={isMe ? 'profile' : 'friend'} me={authState.loginUserName} />

        </div>
    );
};

export default Profile;
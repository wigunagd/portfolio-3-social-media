'use client';

import { dummyPost } from "@/app/(homepage)/dummyPost";
import FeedLayout from "@/components/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost } from "./(homepage)/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import React from "react";
import { useGetFeed, useGetSaved } from "./(homepage)/hooksHomepage";
import { imgProfileTemp } from "../../public/images/asset";

const post: FeedPost[] = dummyPost;

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetFeed({ page: 1, limit: 20 });

  const { data: dataSaved } = useGetSaved({ page: 1, limit: 20 });
  const dataSavedArr = dataSaved?.data.posts.map(p => p.id) ?? [];

  return (
    <div className="flex min-h-screen justify-center font-sans bg-black">

      <NavigationBar
        isLoggedIn={isLoggedIn}
        loginName={authState.loginName}
        avatarUrl={authState.avatarUrl} />

      <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 mb-30 md:mb-35">

        <section id="feed-section" className="flex flex-col gap-6 w-full max-w-150 mx-auto mt-10.75">

          {
            data?.pages.map(page => {
              return page.data.posts.map((posts, i) => {

                const feedPost: FeedPost = {
                  postId: posts.id,
                  userId: posts.author.id,
                  userName: posts.author.username,
                  displayName: posts.author.name,
                  userAvatar: posts.author.avatarUrl ?? imgProfileTemp,
                  imageUrl: posts.imageUrl,
                  caption: posts.caption,
                  postDate: posts.createdAt,
                  likeCount: posts.likeCount,
                  commentCount: posts.commentCount,
                  shareCount: 0,
                  isLiked: posts.likedByMe,
                  isSaved: dataSavedArr.includes(posts.id)
                }
                return (
                  <React.Fragment key={posts.id}>
                    {i > 0 && (
                      <div className="border-b border-neutral-800" />
                    )}
                    <FeedLayout post={feedPost} />
                  </React.Fragment>
                )
              })
            })
          }



        </section>

      </main>

      <BottomNavigationBar page="home" />

    </div>
  );
}

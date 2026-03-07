'use client';

import { dummyPost } from "@/app/(homepage)/dummyPost";
import FeedLayout from "@/app/(homepage)/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost, LikeListData } from "../type/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { useEffect, useRef, useState } from "react";
import { useGetFeed } from "./(homepage)/hooksHomepage";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { icClose } from "../../public/images/asset";
import { dummyLike } from "./(homepage)/dummyLike";
import LikeList from "@/components/LikeList";

const post: FeedPost[] = dummyPost;
const likes: LikeListData[] = dummyLike;

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

  const [viewLike, setViewLike] = useState(true);
  const [viewComment, setViewComment] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const handleViewLike = () => {
    setViewLike(!viewLike);
  }

  const handleViewComment = () => {
    setViewComment(!viewComment);
  }

  const handleOpenShare = () => {
    setOpenShare(!openShare);
  }

  // const { data: dataSaved } = useGetSaved({ page: 1, limit: 20 });
  // const dataSavedArr = dataSaved?.data.posts.map(p => p.id) ?? [];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetFeed({ page: 1, limit: 20 });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (viewLike || viewComment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [viewComment, viewLike]);

  return (
    <div className=" flex min-h-screen justify-center font-sans bg-black">

      <NavigationBar
        isLoggedIn={isLoggedIn}
        loginName={authState.loginName}
        avatarUrl={authState.avatarUrl} />

      <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:px-0 mt-20 mb-30 md:mb-35">

        <section id="feed-section" className="flex flex-col gap-6 w-full max-w-150 mx-auto mt-10.75">

          {/* {
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
          } */}

          {
            post.map(p => (
              <FeedLayout
                viewLike={handleViewLike}
                viewComment={handleViewComment}
                openShare={handleOpenShare}
                key={p.postId}
                post={p} />
            ))
          }

          <div ref={sentinelRef} className={`${hasNextPage ? 'h-10' : 'h-0'}`} />

          {(isLoading || isFetchingNextPage) && (
            <div className="flex items-center text-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
          )}

        </section>

      </main>

      <div
        onClick={handleViewLike}
        id="dialog-like-bg"
        className={`${viewLike ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-like"
          className="relative flex flex-col h-[60%] w-full md:max-w-137 md:min-h-132.5 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleViewLike}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <span className="text-md md:text-xl font-bold">Likes</span>
          <div className="flex flex-col -mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 gap-5 pb-10 md:pb-0">
            {
              likes.map((like, i) => (
                <LikeList key={i} profile={like.profile} followed={like.followed} />
              ))
            }
          </div>
        </div>
      </div>


      <div
        onClick={handleViewComment}
        id="dialog-comment-bg"
        className={`${viewComment ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-comment"
          className="relative flex flex-col h-[60%] w-full md:max-w-137 md:min-h-132.5 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleViewComment}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <span className="text-md md:text-xl font-bold">Comment</span>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          </div>
        </div>
      </div>


      <div
        onClick={handleOpenShare}
        id="dialog-comment-bg"
        className={`${openShare ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-comment"
          className="relative flex flex-col h-[20%] w-full md:max-w-137 md:min-h-50 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleOpenShare}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <span className="text-md md:text-xl font-bold">Share</span>
        </div>
      </div>


      <BottomNavigationBar page="home" />

    </div>
  );
}

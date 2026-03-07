'use client';

import FeedLayout from "@/app/(homepage)/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost, LikeCommentListProfile, LikeListData } from "../type/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import React, { useEffect, useRef, useState } from "react";
import { useGetFeed, useGetPostComments, useGetPostLikes, useGetSaved } from "./(homepage)/hooksHomepage";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { icClose, imgProfileTemp } from "../../public/images/asset";
import { dummyPost } from "@/app/(homepage)/dummyPost";
import { dummyLike } from "./(homepage)/dummyLike";
import { dummyComment } from "./(homepage)/dummyComennt";
import LikeList from "@/components/LikeList";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useWindowSize } from "@/components/UseWindowSize";
import { PostTime } from "@/components/PostTime";
import CommentList from "@/components/CommentList";
import { socialShare } from "@/components/SocialShare";

// const post: FeedPost[] = dummyPost;
// const likes: LikeListData[] = dummyLike;
const comments: LikeCommentListProfile[] = dummyComment;
const social = socialShare;

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [selectedPostLikes, setSelectedPostLikes] = useState(0);
  const [selectedPostComments, setSelectedPostComments] = useState(0);
  const [viewLike, setViewLike] = useState(false);
  const [viewComment, setViewComment] = useState(false);
  const [postComment, setPostComment] = useState<FeedPost>();
  const [openShare, setOpenShare] = useState(false);

  const { data: dataSaved } = useGetSaved({ page: 1, limit: 20 });
  const dataSavedArr = dataSaved?.data.posts.map(p => p.id) ?? [];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetFeed({ page: 1, limit: 20 });

  const {
    data: dataLikes,
    isLoading: isloadingLikes,
    isFetchingNextPage: isFetchingNextPageLikes,
    fetchNextPage: fetchNextPageLikes,
    hasNextPage: hasNextPageLikes
  } = useGetPostLikes({ page: 1, limit: 10, id: selectedPostLikes });

  const {
    data: dataComments,
    isLoading: isloadingComments,
    isFetchingNextPage: isFetchingNextPageComments,
    fetchNextPage: fetchNextPageComments,
    hasNextPage: hasNextPageComments
  } = useGetPostComments({ page: 1, limit: 10, id: selectedPostComments });

  const handleViewLike = (postId: number) => {
    setViewLike(!viewLike);
    setSelectedPostLikes(postId);
  }

  const handleViewCommentWithPost = (post: FeedPost) => {
    setViewComment(!viewComment);
    setPostComment(post);
    setSelectedPostComments(post.postId)
  }

  const handleViewCommentOnly = () => {
    setViewComment(!viewComment);
  }

  const handleOpenShare = () => {
    setOpenShare(!openShare);
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  const sentinelRefLikes = useRef<HTMLDivElement>(null);
  const sentinelRefComments = useRef<HTMLDivElement>(null);

  /* sentinelRef Feed */
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
  /* sentinelRef Feed */

  /* sentinelRef Likes */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPageLikes && !isFetchingNextPageLikes) {
          fetchNextPageLikes();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sentinelRefLikes.current) {
      observer.observe(sentinelRefLikes.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPageLikes, hasNextPageLikes, isFetchingNextPageLikes]);
  /* sentinelRef Likes */

  /* sentinelRef Comments */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPageComments && !isFetchingNextPageComments) {
          fetchNextPageComments();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sentinelRefComments.current) {
      observer.observe(sentinelRefComments.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPageComments, hasNextPageComments, isFetchingNextPageComments]);
  /* sentinelRef Comments */

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
                    <FeedLayout
                      viewLike={() => handleViewLike(feedPost.postId)}
                      viewComment={() => handleViewCommentWithPost(feedPost)}
                      openShare={handleOpenShare}
                      post={feedPost} />
                  </React.Fragment>
                )
              })
            })
          }

          {/* {
            post.map(p => (
              <React.Fragment key={posts.id}>
                {i > 0 && (
                  <div className="border-b border-neutral-800" />
                )}
                <FeedLayout
                  viewLike={handleViewLike}
                  viewComment={() => handleViewCommentWithPost(p)}
                  openShare={handleOpenShare}
                  post={p} />
              </React.Fragment>
            ))
          } */}

          <div ref={sentinelRef} className={`${hasNextPage ? 'h-10' : 'h-0'}`} />

          {(isLoading || isFetchingNextPage) && (
            <div className="flex items-center text-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
          )}

        </section>

      </main>

      <div
        onClick={() => handleViewLike(0)}
        id="dialog-like-bg"
        className={`${viewLike ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-like"
          className="relative flex flex-col h-[60%] w-full md:max-w-137 md:min-h-132.5 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={() => handleViewLike(0)}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <span className="text-md md:text-xl font-bold">Likes</span>
          <div className="flex flex-col -mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 gap-5 pb-10 md:pb-0">
            {
              dataLikes?.pages.map(page => {
                return (
                  page.data.users.map(likes => {
                    const likeData: LikeCommentListProfile = {
                      profileId: likes.id,
                      displayName: likes.name,
                      userAvatar: likes.avatarUrl,
                      userName: likes.username,
                      followed: likes.isFollowedByMe
                    }
                    return (
                      <LikeList key={likes.id} profile={likeData} />
                    )
                  })
                )
              })
            }

            {(isloadingLikes || isFetchingNextPageLikes) && (
              <div className="flex items-center text-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
            )}

            <div ref={sentinelRefLikes} className={`${hasNextPageLikes ? 'h-10' : 'h-0'}`} />

            {/* {
              likes.map((like, i) => (
                <LikeList key={i} profile={like.profile} followed={like.followed} />
              ))
            } */}
          </div>
        </div>
      </div>


      <div
        onClick={handleViewCommentOnly}
        id="dialog-comment-bg"
        className={`${viewComment ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center md:px-30 md:py-41`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-comment"
          className="relative flex flex-col h-[60%] w-full md:max-w-300 md:h-192 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleViewCommentOnly}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <div className="flex w-full h-full gap-5">

            {
              !isMobile && viewComment && postComment && (
                <div className="hidden md:flex md:w-[60%]">
                  <AspectRatio ratio={1 / 1} className="w-full h-full overflow-hidden rounded-md">
                    <Image
                      id="image-post"
                      src={postComment?.imageUrl}
                      priority
                      alt={`image feed`}
                      fill
                      className="object-cover transition-transform rounded-md" />
                  </AspectRatio>
                </div>
              )
            }

            {
              postComment && (
                <div className="-mx-4 no-scrollbar flex flex-col w-full md:w-[40%] overflow-y-auto px-4 gap-4">

                  {
                    !isMobile && (
                      <React.Fragment>
                        <div className="flex flex-col gap-2">
                          <a href="/profile" id={`profile `} className="flex gap-3">
                            <Image src={postComment.userAvatar ?? imgProfileTemp} alt={`avatar `} width={64} height={64} className="rounded-full w-11 h-11 md:w-16 md:h-16" />
                            <div className="flex flex-col justify-center">
                              <span className="text-sm md:text-md font-bold">{postComment.displayName}</span>
                              <span className="text-sm">{PostTime(postComment.postDate)}</span>
                            </div>
                          </a>


                          <span>{postComment.caption}</span>

                        </div>
                        <div className="border-b border-neutral-800" />
                      </React.Fragment>
                    )
                  }

                  <span className="text-md md:text-xl font-bold">Comment</span>

                  {
                    dataComments?.pages.map(page => {
                      return (
                        page.data.comments.map((comment, i) => {
                          const commentVal: LikeCommentListProfile = {
                            profileId: comment.author.id,
                            displayName: comment.author.name,
                            userAvatar: comment.author.avatarUrl,
                            userName: comment.author.username,
                            commentId: comment.id,
                            comment: comment.text
                          }

                          return (
                            <React.Fragment key={i}>
                              <CommentList commentItem={commentVal} />
                              <div className="border-b border-neutral-800" />
                            </React.Fragment>
                          )

                        })
                      )
                    })
                  }

                  {(isloadingComments || isFetchingNextPageComments) && (
                    <div className="flex items-center text-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
                  )}

                  <div ref={sentinelRefComments} className={`${hasNextPageComments ? 'h-10' : 'h-0'}`} />

                  {/* {
                    comments.map((c, i) => (
                      <React.Fragment key={i}>
                        <CommentList commentItem={c} />
                        <div className="border-b border-neutral-800" />
                      </React.Fragment>
                    ))
                  } */}

                </div>
              )
            }

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
          className="relative flex flex-col w-full md:max-w-137 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleOpenShare}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <span className="text-md md:text-xl font-bold">Share</span>
          <div className="flex flex-row gap-8">
            {
              social.map((s, i) => (
                <a key={i} className="bg-white rounded-full">
                  <Image src={s.imgIcon} alt={s.id} />
                </a>
              ))
            }
          </div>
        </div>
      </div>


      <BottomNavigationBar page="home" />

    </div>
  );
}

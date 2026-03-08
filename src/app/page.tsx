'use client';

import FeedLayout from "@/app/(commonfunctions)/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost, LikeCommentListProfile, LikeCommentResponse } from "../type/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import React, { useEffect, useRef, useState } from "react";
import { useGetFeed, useGetPostComments, useGetPostLikes, useGetSaved, useLikeAction, useSaveAction, useSendComment } from "./(commonfunctions)/hooksHomepage";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { icClose, icEmoji, iconComment, iconLike0, iconLike1, iconSave0, iconSave1, iconShare, imgProfileTemp } from "../../public/images/asset";
import LikeList from "@/components/LikeList";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useWindowSize } from "@/components/UseWindowSize";
import { PostTime } from "@/components/PostTime";
import CommentList from "@/components/CommentList";
import { socialShare } from "@/components/SocialShare";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

const social = socialShare;

export default function Home() {
  const authState = useAppSelector((state) => state.auth);
  const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [showPicker, setShowPicker] = useState(false);
  const [writtenComment, setWrittenComment] = useState('');
  const [writtenCommentValid, setWrittenCommentValid] = useState(false);

  const [selectedPostLikesId, setSelectedPostLikesId] = useState(0);
  const [selectedPostCommentsId, setSelectedPostCommentsId] = useState(0);
  const [viewLike, setViewLike] = useState(false);
  const [viewComment, setViewComment] = useState(false);
  const [selectedPostComment, setSelectedPostComment] = useState<FeedPost>();
  const [openShare, setOpenShare] = useState(false);

  const feed_params = { page: 1, limit: 3 };
  const {
    data: dataFeeds,
    isLoading: isLoadingFeeds,
    isFetchingNextPage: isFetchingNextPageFeeds,
    fetchNextPage: fetchNextPageFeeds,
    hasNextPage: hasNextPageFeeds
  } = useGetFeed(feed_params);

  const { mutate: mutateLikeAction } = useLikeAction(feed_params);
  const { mutate: mutateSaveAction } = useSaveAction(feed_params);
  const {
    data: dataSaved,
    isFetchingNextPage: isFetchingNextPageSaved,
    fetchNextPage: fetchNextPageSaved,
    hasNextPage: hasNextPageSaved
  } = useGetSaved(feed_params);
  const dataSavedArr = dataSaved?.pages.flatMap(page =>
    page.data.posts.map(p => p.id)
  ) ?? [];

  const {
    data: dataLikes,
    isLoading: isloadingLikes,
    isFetchingNextPage: isFetchingNextPageLikes,
    fetchNextPage: fetchNextPageLikes,
    hasNextPage: hasNextPageLikes
  } = useGetPostLikes({ page: 1, limit: 10, id: selectedPostLikesId });

  const {
    data: dataComments,
    isLoading: isloadingComments,
    isFetchingNextPage: isFetchingNextPageComments,
    fetchNextPage: fetchNextPageComments,
    hasNextPage: hasNextPageComments
  } = useGetPostComments({ page: 1, limit: 10, id: selectedPostCommentsId });

  const queryClient = useQueryClient();
  const { mutate: mutateSendComment, isPending: isPendingSendComment } = useSendComment();

  const handleSendComment = () => {
    if (writtenCommentValid) {
      mutateSendComment({ id: selectedPostCommentsId, text: writtenComment }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["postComments", selectedPostCommentsId] });
          setWrittenComment('');
        }
      })
    }
  }

  const handleViewLike = (postId: number) => {
    if (isLoggedIn) {
      setViewLike(!viewLike);
      setSelectedPostLikesId(postId);
    }
  }

  const handleViewCommentOpen = (post: FeedPost) => {
    if (isLoggedIn) {
      setViewComment(true);
      setSelectedPostComment(post);
      setSelectedPostCommentsId(post.postId)
    }
  }

  const handleViewCommentClose = () => {
    if (isLoggedIn) {
      setViewComment(false);
      setWrittenComment('');
      setWrittenCommentValid(false);
    }
  }

  const handleOpenShare = () => {
    if (isLoggedIn) {
      setOpenShare(!openShare);
    }
  }

  const handleWrittenComment = (text: string) => {
    setWrittenComment(text);
    setWrittenCommentValid(text.length > 0);
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  const sentinelRefLikes = useRef<HTMLDivElement>(null);
  const sentinelRefComments = useRef<HTMLDivElement>(null);

  /* sentinelRef Feed */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPageFeeds && !isFetchingNextPageFeeds) {
          fetchNextPageFeeds();

          if (hasNextPageSaved && !isFetchingNextPageSaved) {
            fetchNextPageSaved();
          }
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
  }, [fetchNextPageFeeds, fetchNextPageSaved, hasNextPageFeeds, hasNextPageSaved, isFetchingNextPageFeeds, isFetchingNextPageSaved]);
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
            dataFeeds?.pages.map(page => {
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
                  isSaved: posts.isSaved ?? dataSavedArr.includes(posts.id)
                }
                return (
                  <React.Fragment key={posts.id}>
                    {i > 0 && (
                      <div className="border-b border-neutral-800" />
                    )}
                    <FeedLayout
                      isLoggedIn={isLoggedIn}
                      viewLike={() => handleViewLike(feedPost.postId)}
                      viewComment={() => handleViewCommentOpen(feedPost)}
                      openShare={handleOpenShare}
                      onLike={() => mutateLikeAction({ id: feedPost.postId, isLiked: feedPost.isLiked })}
                      onSave={() => mutateSaveAction({ id: feedPost.postId, isSaved: feedPost.isSaved })}
                      post={feedPost} />
                  </React.Fragment>
                )
              })
            })
          }

          <div ref={sentinelRef} className={`${hasNextPageFeeds ? 'h-10' : 'h-0'}`} />

          {(isLoadingFeeds || isFetchingNextPageFeeds) && (
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

          </div>
        </div>
      </div>


      <div
        onClick={handleViewCommentClose}
        id="dialog-comment-bg"
        className={`${viewComment ? 'fixed' : 'hidden'} flex w-full h-screen z-11 bg-black/25 justify-center items-end md:items-center md:px-30 md:py-41`}>
        <div
          onClick={(e) => e.stopPropagation()}
          id="dialog-comment"
          className="relative flex flex-col h-[60%] w-full md:max-w-300 md:h-192 rounded-xl p-5 gap-5 bg-black border border-neutral-800">
          <Button
            onClick={handleViewCommentClose}
            variant={'ghost2'}
            className="absolute right-0 -top-10" >
            <Image src={icClose} alt="close dialog like" />
          </Button>
          <div className="flex w-full h-full gap-5">

            {
              !isMobile && viewComment && selectedPostComment && (
                <div className="hidden md:flex md:w-[60%]">
                  <AspectRatio ratio={1 / 1} className="w-full h-full overflow-hidden rounded-md">
                    <Image
                      id="image-post"
                      src={selectedPostComment?.imageUrl}
                      priority
                      alt={`image feed`}
                      fill
                      className="object-cover transition-transform rounded-md" />
                  </AspectRatio>
                </div>
              )
            }

            {
              selectedPostComment && (

                <div className="flex flex-col w-full md:w-[40%] h-full relative overflow-hidden gap-4">

                  {
                    !isMobile && (
                      <React.Fragment>
                        <div className="flex flex-col gap-2">
                          <a href="/profile" id={`profile `} className="flex gap-3">
                            <Image src={selectedPostComment.userAvatar ?? imgProfileTemp} alt={`avatar `} width={64} height={64} className="rounded-full w-11 h-11 md:w-16 md:h-16" />
                            <div className="flex flex-col justify-center">
                              <span className="text-sm md:text-md font-bold">{selectedPostComment.displayName}</span>
                              <span className="text-sm">{PostTime(selectedPostComment.postDate)}</span>
                            </div>
                          </a>


                          <span>{selectedPostComment.caption}</span>

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

                  <div className="absolute bottom-0 w-full h-23.5 flex flex-col gap-4 mb-10 md:mb-0">

                    <div className="flex h-7.5 gap-4 w-full justify-between">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 p-0">
                          <Button
                            onClick={() => {
                              mutateLikeAction({ id: selectedPostComment.postId, isLiked: selectedPostComment.isLiked }, {
                                onSuccess: (response: LikeCommentResponse) => {
                                  selectedPostComment.likeCount = response.data.likeCount;
                                  selectedPostComment.isLiked = response.data.liked;
                                }
                              })
                              selectedPostComment.isLiked = !selectedPostComment.isLiked;
                            }}
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <motion.div
                              key={selectedPostComment.isLiked ? 'liked' : 'unliked'}
                              initial={selectedPostComment.isLiked ? { scale: 1 } : { scale: 1 }}
                              animate={{ scale: 1 }}
                              whileTap={selectedPostComment.isLiked ? { scale: 1 } : { scale: 1.7 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <Image
                                src={selectedPostComment.isLiked ? iconLike1 : iconLike0}
                                alt="like"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                              />
                            </motion.div>
                          </Button>
                          <Button
                            variant={'ghost2'}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{selectedPostComment.likeCount}</Button>
                        </div>


                        <div className="flex items-center gap-1 p-0">
                          <Button
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <Image src={iconComment} alt="like" width={24} height={24} className="w-6 h-6" />
                          </Button>
                          <Button
                            variant={'ghost2'}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{selectedPostComment.commentCount}</Button>
                        </div>

                        <div className="flex items-center gap-1 p-0">
                          <Button
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <Image src={iconShare} alt="like" width={24} height={24} className="w-6 h-6" />
                          </Button>
                          <Button
                            variant={'ghost2'}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{selectedPostComment.shareCount}</Button>
                        </div>
                      </div>

                      <Button
                        variant={'ghost2'}
                        className="flex gap-1.5 items-center cursor-pointer">
                        <motion.div
                          key={selectedPostComment.isSaved ? 'liked' : 'unliked'}
                          initial={selectedPostComment.isSaved ? { scale: 1 } : { scale: 1 }}
                          animate={{ scale: 1 }}
                          whileTap={selectedPostComment.isSaved ? { scale: 1 } : { scale: 1.7 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <Image src={selectedPostComment.isSaved ? iconSave1 : iconSave0} alt="save" width={24} height={24} className="w-6 h-6" />
                        </motion.div>
                      </Button>

                    </div>

                    <div className="flex gap-2 w-full h-12 relative items-center ">
                      <a id="open-emoji"
                        onClick={() => setShowPicker(!showPicker)}
                        className="flex items-center justify-center rounded-xl border border-neutral-900 w-12 h-12">
                        <Image src={icEmoji} alt="like" width={24} height={24} className="w-6 h-6" />
                      </a>

                      <div id="comment-box" className=" relative flex flex-1 h-12 border border-neutral-900 py-1 rounded-xl items-center">
                        <Input
                          id="comment"
                          type="text"
                          autoComplete="off"
                          placeholder="Add Comment"
                          className="pr-15 h-12 rounded-xl bg-black text-white 
                                    placeholder:text-neutral-500 
                                    focus:bg-black focus:border-neutral-800 
                                    focus-visible:ring-0 focus-visible:ring-offset-0 
                                    selection:bg-neutral-700 outline-none shadow-none 
                                    transition-none"
                          style={{
                            boxShadow: 'none',
                            WebkitBoxShadow: '0 0 0px 1000px black inset',
                          }}
                          required
                          onChange={(e) => handleWrittenComment(e.target.value)}
                          onFocus={() => setShowPicker(!showPicker)}
                          value={writtenComment}
                        />
                        <Button
                          disabled={!writtenCommentValid || isPendingSendComment}
                          onClick={() => {
                            setShowPicker(false);
                            if (writtenCommentValid) {
                              mutateSendComment({ id: selectedPostCommentsId, text: writtenComment }, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({ queryKey: ["postComments", selectedPostCommentsId] });
                                  setWrittenComment('');
                                  setWrittenCommentValid(false);
                                  selectedPostComment.commentCount += 1;
                                }
                              })
                            }
                          }}
                          variant={'ghost2'}
                          className={`absolute  right-0 ${writtenCommentValid ? 'text-primary-200' : 'text-neutral-600'}`}>{isPendingSendComment && (<Spinner />)} Post</Button>
                      </div>

                      {showPicker && (
                        <div className="absolute bottom-14 left-0 z-50">
                          <EmojiPicker onEmojiClick={(emojiData) => {
                            handleWrittenComment(writtenComment + emojiData.emoji);
                          }} />
                        </div>
                      )}
                    </div>


                  </div>
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

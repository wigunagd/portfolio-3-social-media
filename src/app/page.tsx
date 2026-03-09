'use client';

import FeedLayout from "@/components/FeedLayout";
import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import { FeedPost, LikeCommentListProfile, LikeCommentResponse, SavedResponse } from "../type/pageType";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import React, { useEffect, useRef, useState } from "react";
import { useGetFeed, useGetPostComments, useGetPostLikes, useGetSaved, useLikeAction, useSaveAction, useSendComment } from "./(commonfunctions)/hooksHomepage";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { icClose, icEmoji, iconComment, iconLike0, iconLike1, iconSave0, iconSave1, iconShare, imgProfileTemp } from "../../public/images/asset";
import LikeList from "@/components/LikeList";
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

  const autoFetchFeedsRef = useRef<HTMLDivElement>(null);
  const autoFetchRefLikes = useRef<HTMLDivElement>(null);
  const autoFetchRefComments = useRef<HTMLDivElement>(null);

  /* auto fetch Feed */
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

    if (autoFetchFeedsRef.current) {
      observer.observe(autoFetchFeedsRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPageFeeds, fetchNextPageSaved, hasNextPageFeeds, hasNextPageSaved, isFetchingNextPageFeeds, isFetchingNextPageSaved]);

  /* auto fetch Likes */
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

    if (autoFetchRefLikes.current) {
      observer.observe(autoFetchRefLikes.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPageLikes, hasNextPageLikes, isFetchingNextPageLikes]);

  /* auto fetch Comments */
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

    if (autoFetchRefComments.current) {
      observer.observe(autoFetchRefComments.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPageComments, hasNextPageComments, isFetchingNextPageComments]);

  useEffect(() => {
    if (viewLike || viewComment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [viewComment, viewLike]);

  return (
    <div className=" flex min-h-screen justify-center font-sans bg-black">

      <NavigationBar authState={authState} />

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

          <div ref={autoFetchFeedsRef} className={`${hasNextPageFeeds ? 'h-10' : 'h-0'}`} />

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

            <div ref={autoFetchRefLikes} className={`${hasNextPageLikes ? 'h-10' : 'h-0'}`} />

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
          className="relative flex flex-col 
          h-[60%] 
          w-full 
          md:max-w-300 
          md:min-h-192 
          rounded-xl gap-5 bg-neutral-950">
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
                  <Image
                    id="image-post"
                    src={selectedPostComment?.imageUrl || ""}
                    priority
                    alt="image feed"
                    width={1200}
                    height={1200}
                    className="w-full h-auto max-h-full object-contain transition-transform rounded-md md:min-h-192"
                  />
                </div>
              )
            }

            {
              selectedPostComment && (

                <div id="comment-group" className="flex flex-col w-full md:w-[40%] min-h-full  text-white overflow-hidden">

                  <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
                    {!isMobile && (
                      <>
                        <div className="flex flex-col gap-2">
                          <a href="/profile" className="flex gap-3">
                            <Image
                              src={selectedPostComment.userAvatar ?? imgProfileTemp}
                              alt="avatar"
                              width={64}
                              height={64}
                              className="rounded-full w-11 h-11 md:w-16 md:h-16 object-cover"
                            />
                            <div className="flex flex-col justify-center">
                              <span className="text-sm md:text-md font-bold">{selectedPostComment.displayName}</span>
                              <span className="text-sm text-neutral-500">{PostTime(selectedPostComment.postDate)}</span>
                            </div>
                          </a>
                          <span className="text-sm md:text-md leading-relaxed">{selectedPostComment.caption}</span>
                        </div>
                        <div className="border-b border-neutral-800 my-2" />
                      </>
                    )}

                    <span className="text-md md:text-xl font-bold">Comments</span>

                    <div className="flex flex-col gap-4">
                      {dataComments?.pages.map((page, pageIdx) => (
                        page.data.comments.map((comment, i) => {
                          const commentVal = {
                            profileId: comment.author.id,
                            displayName: comment.author.name,
                            userAvatar: comment.author.avatarUrl,
                            userName: comment.author.username,
                            commentId: comment.id,
                            comment: comment.text,
                            createdAt: comment.createdAt
                          };

                          return (
                            <React.Fragment key={`${pageIdx}-${i}`}>
                              <CommentList commentItem={commentVal} />
                              <div className="border-b border-neutral-800" />
                            </React.Fragment>
                          );
                        })
                      ))}

                      {
                        dataComments?.pages[0].data.comments.length === 0 && (
                          <div id="no-comment" className="flex flex-col w-full h-full max-h-110 justify-center items-center">
                            <span className="text-md font-bold">No Comments yet</span>
                            <span className="text-sm">Start the conversation</span>
                          </div>
                        )
                      }
                    </div>

                    {(isloadingComments || isFetchingNextPageComments) && (
                      <div className="flex items-center justify-center py-6 gap-3 text-neutral-400">
                        <Spinner /> <span>Loading comments...</span>
                      </div>
                    )}

                    <div ref={autoFetchRefComments} className={`${hasNextPageComments ? 'h-10' : 'h-0'}`} />
                  </div>

                  <div id="action-group" className="shrink-0 p-5 border-t border-neutral-800  flex flex-col gap-4 pb-10 md:pb-5">

                    <div className="hidden md:flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
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
                            variant="ghost2"
                            className="p-0 h-auto"
                          >
                            <motion.div whileTap={{ scale: 1.5 }}>
                              <Image
                                src={selectedPostComment.isLiked ? iconLike1 : iconLike0}
                                alt="like" width={24} height={24} className="w-6 h-6"
                              />
                            </motion.div>
                          </Button>
                          <span className="text-sm font-semibold">{selectedPostComment.likeCount}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Image src={iconComment} alt="comment" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-semibold">{selectedPostComment.commentCount}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Image src={iconShare} alt="share" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-semibold">{selectedPostComment.shareCount}</span>
                        </div>
                      </div>


                      <Button
                        variant="ghost2"
                        onClick={() => {
                          mutateSaveAction({ id: selectedPostComment.postId, isSaved: selectedPostComment.isSaved }, {
                            onSuccess: (response: SavedResponse) => {
                              selectedPostComment.isSaved = response.data.saved;
                            }
                          })
                        }}
                        className="p-0 h-auto">
                        <motion.div whileTap={{ scale: 1.5 }}>
                          <Image
                            src={selectedPostComment.isSaved ? iconSave1 : iconSave0}
                            alt="save" width={24} height={24} className="w-6 h-6"
                          />
                        </motion.div>
                      </Button>
                    </div>

                    <div className="flex gap-2 w-full relative items-center">
                      <button
                        id="open-emoji"
                        onClick={() => setShowPicker(!showPicker)}
                        className="flex items-center justify-center rounded-xl border border-neutral-900 w-12 h-12 hover:bg-neutral-900 transition-colors"
                      >
                        <Image src={icEmoji} alt="emoji" width={24} height={24} className="w-6 h-6" />
                      </button>

                      <div className="relative flex flex-1 items-center">
                        <Input
                          id="comment"
                          autoComplete="off"
                          placeholder="Add Comment"
                          className="w-full pr-16 h-12 rounded-xl bg-black border-neutral-900 text-white placeholder:text-neutral-500 focus:ring-0  outline-none transition-all"
                          style={{ WebkitBoxShadow: '0 0 0px 1000px black inset' }}
                          value={writtenComment}
                          onChange={(e) => handleWrittenComment(e.target.value)}
                          onFocus={() => setShowPicker(false)}
                        />
                        <Button
                          disabled={!writtenCommentValid || isPendingSendComment}
                          onClick={() => {
                            setShowPicker(false);
                            mutateSendComment({ id: selectedPostCommentsId, text: writtenComment }, {
                              onSuccess: () => {
                                queryClient.invalidateQueries({ queryKey: ["postComments", selectedPostCommentsId] });
                                setWrittenComment('');
                                setWrittenCommentValid(false);
                                selectedPostComment.commentCount += 1;
                              }
                            });
                          }}
                          variant="ghost2"
                          className={`absolute right-2 h-8 px-3 font-bold transition-colors ${writtenCommentValid ? 'text-primary-200' : 'text-neutral-600'
                            }`} >
                          {isPendingSendComment && (<Spinner />)}Post
                        </Button>
                      </div>

                      {showPicker && (
                        <div className="absolute bottom-16 left-0 z-50 shadow-2xl">
                          <div className="fixed inset-0" onClick={() => setShowPicker(false)} />
                          <div className="relative">
                            <EmojiPicker
                              onEmojiClick={(emojiData) => handleWrittenComment(writtenComment + emojiData.emoji)}
                            />
                          </div>
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


      <BottomNavigationBar page="home" me={authState.loginUserName}  />

    </div>
  );
}

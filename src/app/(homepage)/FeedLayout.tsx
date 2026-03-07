import Image from "next/image";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import {
    iconComment,
    iconLike0,
    iconLike1,
    iconSave0,
    iconSave1,
    iconShare,
    imgProfileTemp
} from "../../../public/images/asset";
import { Button } from "../../components/ui/button";
import { FeedPost, LikeResponse, SavedResponse } from "@/type/pageType";
import { PostTime } from "../../components/PostTime";
import { useState } from "react";
import { useRemoveLike, useRemoveSave, useSetLike, useSetSave } from "./hooksHomepage";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface FeedLayoutProps {
    post: FeedPost,
    viewLike: () => void,
    viewComment: () => void,
    openShare: () => void
}

const FeedLayout = ({ post, viewLike, viewComment, openShare }: FeedLayoutProps) => {
    const [showMore, setShowMore] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [liked, setLiked] = useState(post.isLiked);
    const [saved, setSaved] = useState(post.isSaved);
    const clampTextLength = 200;

    const { mutate: mutateSetLike } = useSetLike();
    const { mutate: mutateRemoveLike } = useRemoveLike();
    const { mutate: mutateSetSave } = useSetSave();
    const { mutate: mutateRemoveSave } = useRemoveSave();

    const handleShowMore = () => {
        setShowMore(!showMore);
    }

    const likeAction = () => {
        const likeValue = !liked;
        setLiked(likeValue);

        if (likeValue) {
            mutateSetLike(post.postId, {
                onSuccess: (response: LikeResponse) => {
                    setLikeCount(response.data.likeCount);
                    setLiked(response.data.liked);
                },
                onError: (e) => {
                    const err = e as AxiosError<LikeResponse>;
                    toast(err.response?.data.message);
                }
            });
        }

        if (!likeValue) {
            mutateRemoveLike(post.postId, {
                onSuccess: (response: LikeResponse) => {
                    setLikeCount(response.data.likeCount);
                    setLiked(response.data.liked);
                },
                onError: (e) => {
                    const err = e as AxiosError<LikeResponse>;
                    toast(err.response?.data.message);
                }
            });
        }
    }

    const handleDoubleClick = () => {
        likeAction();
    }

    const handleLike = () => {
        likeAction();
    }

    const handleSave = () => {
        const saveValue = !saved;
        setSaved(saveValue);

        if (saveValue) {
            mutateSetSave(post.postId, {
                onSuccess: (response: SavedResponse) => {
                    setSaved(response.data.saved);
                },
                onError: (e) => {
                    const err = e as AxiosError<LikeResponse>;
                    toast(err.response?.data.message);
                }
            });
        }

        if (!saveValue) {
            mutateRemoveSave(post.postId, {
                onSuccess: (response: SavedResponse) => {
                    setSaved(response.data.saved);
                },
                onError: (e) => {
                    const err = e as AxiosError<LikeResponse>;
                    toast(err.response?.data.message);
                }
            });
        }
    }

    return (

        <div className="flex flex-col gap-3">

            <a href="/profile" id={`profile `} className="flex gap-3">
                <Image src={post.userAvatar ?? imgProfileTemp} alt={`avatar `} width={64} height={64} className="rounded-full w-11 h-11 md:w-16 md:h-16" />
                <div className="flex flex-col justify-center">
                    <span className="text-sm md:text-md font-bold">{post.displayName}</span>
                    <span className="text-sm">{PostTime(post.postDate)}</span>
                </div>
            </a>

            <AspectRatio onDoubleClick={handleDoubleClick} ratio={1 / 1} className="w-full overflow-hidden rounded-md">
                <Image
                    src={post.imageUrl}
                    alt={`image feed`}
                    fill
                    className="object-cover transition-transform rounded-md" />
            </AspectRatio>

            <div className="flex h-7.5 gap-4 justify-between">
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 p-0">
                        <Button
                            onClick={handleLike}
                            variant={'ghost2'}
                            className="flex items-center p-0">
                            <Image src={liked ? iconLike1 : iconLike0} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <a onClick={viewLike} className="text-sm md:text-text-md font-semibold w-fit">{likeCount}</a>
                    </div>


                    <div className="flex items-center gap-1 p-0">
                        <Button
                            onClick={viewComment}
                            variant={'ghost2'}
                            className="flex items-center p-0">
                            <Image src={iconComment} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <a onClick={viewComment} className="text-sm md:text-text-md font-semibold w-fit">{post.commentCount}</a>
                    </div>

                    <div className="flex items-center gap-1 p-0">
                        <Button
                        onClick={openShare}
                            variant={'ghost2'}
                            className="flex items-center p-0">
                            <Image src={iconShare} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <a onClick={openShare} className="text-sm md:text-text-md font-semibold w-fit">{post.shareCount}</a>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    variant={'ghost2'}
                    className="flex gap-1.5 items-center">
                    <Image src={saved ? iconSave1 : iconSave0} alt="like" width={24} height={24} className="w-6 h-6" />
                </Button>

            </div>

            <div className="flex flex-col gap-1">
                <a href="/profile" className="text-sm md:text-md font-bold hover:text-neutral-300">{post.displayName}</a>
                <p id="post-caption" className={`text-sm md:text-md 
                    ${post.caption.length > clampTextLength ? (!showMore ? `line-clamp-3` : '') : ''} 
                    `}>
                    {post.caption}
                </p>
                {post.caption.length > clampTextLength && (
                    <Button
                        onClick={handleShowMore}
                        id="btn-show-more"
                        variant={'ghost2'}
                        className="text-sm md:text-md text-primary-300 font-bold w-fit p-0">{showMore ? 'Show Less' : 'Show More'}</Button>
                )}
            </div>

        </div>

    )
}

export default FeedLayout;
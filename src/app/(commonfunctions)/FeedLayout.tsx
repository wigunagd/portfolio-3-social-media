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
import { FeedPost } from "@/type/pageType";
import { PostTime } from "../../components/PostTime";
import { useState } from "react";
interface FeedLayoutProps {
    post: FeedPost,
    viewLike: () => void,
    viewComment: () => void,
    openShare: () => void,
    onLike: () => void,
    onSave: () => void
}

const FeedLayout = ({ post, viewLike, viewComment, openShare, onLike, onSave }: FeedLayoutProps) => {
    const [showMore, setShowMore] = useState(false);
    const clampTextLength = 200;

    const handleShowMore = () => {
        setShowMore(!showMore);
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

            <AspectRatio onDoubleClick={onLike} ratio={1 / 1} className="w-full overflow-hidden rounded-md">
                <Image
                    id="image-post"
                    src={post.imageUrl}
                    alt={`image feed`}
                    fill
                    className="object-cover transition-transform rounded-md" />
            </AspectRatio>

            <div className="flex h-7.5 gap-4 justify-between">
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 p-0">
                        <Button
                            onClick={onLike}
                            variant={'ghost2'}
                            className="flex items-center p-0">
                            <Image src={post.isLiked ? iconLike1 : iconLike0} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <a onClick={viewLike} className="text-sm md:text-text-md font-semibold w-fit">{post.likeCount}</a>
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
                    onClick={onSave}
                    variant={'ghost2'}
                    className="flex gap-1.5 items-center">
                    <Image src={post.isSaved ? iconSave1 : iconSave0} alt="like" width={24} height={24} className="w-6 h-6" />
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
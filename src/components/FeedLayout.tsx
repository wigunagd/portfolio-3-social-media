import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { iconComment, iconLike0, iconLike1, iconSave0, iconSave1, iconShare, imgProfileTemp } from "../../public/images/asset";
import { Button } from "./ui/button";
import { FeedPost } from "@/app/(homepage)/pageType";
import { PostTime } from "./PostTime";
import { useState } from "react";

const FeedLayout = ({ post }: { post: FeedPost }) => {
    const [showMore, setShowMore] = useState(false);
    const clampTextLength = 200;
    const clamLine = 3;

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

            <AspectRatio ratio={1 / 1} className="w-full rounded-md">
                <Image src={post.imageUrl} alt={`image feed`} width={600} height={600} className="w-full object-cover rounded-md" />
            </AspectRatio>

            <div className="flex h-7.5 gap-4 justify-between">
                <div className="flex gap-4">

                    <div className="flex gap-1.5 items-center">
                        <Image src={post.isLiked ? iconLike1 : iconLike0} alt="like" width={24} height={24} className="w-6 h-6" />
                        <span className="text-sm md:text-text-md font-semibold">{post.likeCount}</span>
                    </div>

                    <div className="flex gap-1.5 items-center">
                        <Image src={iconComment} alt="like" width={24} height={24} className="w-6 h-6" />
                        <span className="text-sm md:text-text-md font-semibold">{post.commentCount}</span>
                    </div>

                    <div className="flex gap-1.5 items-center">
                        <Image src={iconShare} alt="like" width={24} height={24} className="w-6 h-6" />
                        <span className="text-sm md:text-text-md font-semibold">{post.shareCount}</span>
                    </div>
                </div>

                <div className="flex gap-1.5 items-center">
                    <Image src={post.isSaved ? iconSave1 : iconSave0} alt="like" width={24} height={24} className="w-6 h-6" />
                </div>

            </div>

            <div className="flex flex-col gap-1">
                <a href="/profile" className="text-sm md:text-md font-bold hover:text-neutral-300">{post.displayName}</a>
                <p id="post-caption" className={`text-sm md:text-md 
                    ${post.caption.length > clampTextLength ? (!showMore ? `line-clamp-${clamLine}` : '') : ''} 
                    `}>
                    {post.caption}
                </p>
                {post.caption.length > clampTextLength  && (
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
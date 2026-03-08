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
import { motion, AnimatePresence } from "framer-motion";

interface FeedLayoutProps {
    isLoggedIn: boolean,
    post: FeedPost,
    viewLike: () => void,
    viewComment: () => void,
    openShare: () => void,
    onLike: () => void,
    onSave: () => void
}

const FeedLayout = ({ isLoggedIn, post, viewLike, viewComment, openShare, onLike, onSave }: FeedLayoutProps) => {
    const [showMore, setShowMore] = useState(false);
    const [showBigHeart, setShowBigHeart] = useState(false);
    const clampTextLength = 200;

    const handleShowMore = () => {
        setShowMore(!showMore);
    }

    const handleDoubleClick = () => {
        if (!isLoggedIn) return;

        setShowBigHeart(true);
        setTimeout(() => setShowBigHeart(false), 1000);

        if (!post.isLiked) {
            onLike();
        }
    };

    const handleOnLike = () => {
        if (!isLoggedIn) return;

        onLike();
    };

    const handleOnSave = () => {
        if (!isLoggedIn) return;

        onSave();
    };

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
                    id="image-post"
                    src={post.imageUrl}
                    alt={`image feed`}
                    fill
                    className="object-cover transition-transform rounded-md" />

                <AnimatePresence>
                    {isLoggedIn && showBigHeart && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        >
                            <Image src={iconLike1} alt="heart" width={100} height={100} className="drop-shadow-2xl" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </AspectRatio>

            <div className="flex h-7.5 gap-4 justify-between">
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 p-0">
                        <Button
                            disabled={!isLoggedIn}
                            onClick={handleOnLike}
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <motion.div
                                key={post.isLiked ? 'liked' : 'unliked'}
                                initial={post.isLiked ? { scale: 1 } : { scale: 1 }}
                                animate={{ scale: 1 }}
                                whileTap={isLoggedIn ? { scale: 1.7 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                                <Image
                                    src={post.isLiked ? iconLike1 : iconLike0}
                                    alt="like"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                            </motion.div>
                        </Button>
                        <Button
                            disabled={!isLoggedIn}
                            variant={'ghost2'}
                            onClick={viewLike}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{post.likeCount}</Button>
                    </div>


                    <div className="flex items-center gap-1 p-0">
                        <Button
                            disabled={!isLoggedIn}
                            onClick={viewComment}
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <Image src={iconComment} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <Button
                            disabled={!isLoggedIn}
                            variant={'ghost2'}
                            onClick={viewComment}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{post.commentCount}</Button>
                    </div>

                    <div className="flex items-center gap-1 p-0">
                        <Button
                            disabled={!isLoggedIn}
                            onClick={openShare}
                            variant={'ghost2'}
                            className="flex items-center p-0 cursor-pointer">
                            <Image src={iconShare} alt="like" width={24} height={24} className="w-6 h-6" />
                        </Button>
                        <Button
                            disabled={!isLoggedIn}
                            variant={'ghost2'}
                            onClick={openShare}
                            className="text-sm md:text-text-md p-0 font-semibold w-fit cursor-pointer">{post.shareCount}</Button>
                    </div>
                </div>

                <Button
                    disabled={!isLoggedIn}
                    onClick={handleOnSave}
                    variant={'ghost2'}
                    className="flex gap-1.5 items-center cursor-pointer">
                    <motion.div
                        key={post.isSaved ? 'liked' : 'unliked'}
                        initial={post.isSaved ? { scale: 1 } : { scale: 1 }}
                        animate={{ scale: 1 }}
                        whileTap={post.isSaved ? { scale: 1 } : { scale: 1.7 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Image src={post.isSaved ? iconSave1 : iconSave0} alt="save" width={24} height={24} className="w-6 h-6" />
                    </motion.div>
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
                        className="text-sm md:text-md text-primary-300 font-bold w-fit p-0 cursor-pointer">{showMore ? 'Show Less' : 'Show More'}</Button>
                )}
            </div>

        </div>

    )
}

export default FeedLayout;
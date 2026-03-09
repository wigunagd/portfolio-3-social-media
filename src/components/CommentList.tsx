import Image from "next/image";
import { LikeCommentListProfile } from "@/type/pageType";
import { imgProfileTemp } from "../../public/images/asset";
import { PostTime } from "./PostTime";
import Link from "next/link";

const CommentList = ({ commentItem }: { commentItem: LikeCommentListProfile }) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
                <Link
                    href={`/${commentItem.userName}`}
                    className="relative shrink-0 rounded-full overflow-hidden w-11 h-11 md:w-16 md:h-16">
                    <Image
                        src={commentItem.userAvatar ?? imgProfileTemp}
                        alt={`avatar `}
                        width={64}
                        height={64}
                        className="rounded-full w-11 h-11 md:w-16 md:h-16 object-cover" />

                </Link>

                <Link
                    href={`/${commentItem.userName}`} 
                    className="flex flex-col justify-center">
                    <span className="text-sm md:text-md font-bold">{commentItem.displayName}</span>
                    <span className="text-sm">{commentItem.createdAt && (PostTime(commentItem.createdAt))}</span>
                </Link>
            </div>

            <span className="text-xs md:text-sm">{commentItem.comment}</span>

        </div>
    )
}

export default CommentList;
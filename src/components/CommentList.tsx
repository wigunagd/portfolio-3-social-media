import Image from "next/image";
import { LikeCommentListProfile } from "@/type/pageType";
import { imgProfileTemp } from "../../public/images/asset";
import { PostTime } from "./PostTime";

const CommentList = ({ commentItem }: { commentItem: LikeCommentListProfile }) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
                <Image src={commentItem.userAvatar ?? imgProfileTemp} alt={`avatar `} width={64} height={64} className="rounded-full w-11 h-11 md:w-16 md:h-16" />
                <div className="flex flex-col justify-center">
                    <span className="text-sm md:text-md font-bold">{commentItem.displayName}</span>
                    <span className="text-sm">{commentItem.createdAt && (PostTime(commentItem.createdAt))}</span>
                </div>
            </div>

            <span className="text-xs md:text-sm">{commentItem.comment}</span>

        </div>
    )
}

export default CommentList;
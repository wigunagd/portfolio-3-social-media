import Image from "next/image";
import { icCheckCircle, imgProfileTemp } from "../../public/images/asset";
import { Button } from "./ui/button";
import { LikeListData } from "@/type/pageType";
import { useFollowAction } from "@/app/(commonfunctions)/hooksFollow";
import { FollowResponse } from "@/app/(commonfunctions)/followType";
import { Spinner } from "./ui/spinner";
import Link from "next/link";

const LikeList = ({ profile }: LikeListData) => {

    const { mutate: mutateFollowAction, isPending: isPendingFollowAction } = useFollowAction();

    const doMutateFollowAction = () => {
        mutateFollowAction({
            username: profile.userName,
            following: profile.followed ?? false
        }, {
            onSuccess: (response: FollowResponse) => {
                profile.followed = response.data.following;
            }
        });
    }

    return (
        <div className="flex justify-between items-center gap-3">
            <div className="flex gap-3 items-center">
                <Link 
                href={`/${profile.userName}`} 
                className="relative shrink-0 rounded-full overflow-hidden w-11 h-11 md:w-16 md:h-16">
                    <Image
                        src={profile.userAvatar ?? imgProfileTemp}
                        alt={`avatar `}
                        width={64}
                        height={64}
                        className="rounded-full w-11 h-11 md:w-16 md:h-16 object-cover" />
                        
                </Link>
                <Link 
                href={`/${profile.userName}`} className="flex flex-col justify-center">
                    <span className="text-sm md:text-md font-bold">{profile.displayName}</span>
                    <span className="text-sm">{profile.userName}</span>
                </Link>
            </div>

            {
                !profile.isMe && (
                    profile.followed
                        ? (
                            <Button
                            onClick={doMutateFollowAction}
                                                    disabled={isPendingFollowAction}
                                variant={'ghost2'}
                                className="flex px-4 w-full max-w-31.75 h-10 rounded-full border border-neutral-600">{isPendingFollowAction ? (<Spinner />) : (<Image src={icCheckCircle} alt="check followed" width={20} height={20} />)} Following</Button>
                        )
                        : (
                            <Button 
                            onClick={doMutateFollowAction}
                                                    disabled={isPendingFollowAction}
                            className="flex px-6 w-full max-w-23.25 h-10 rounded-full">{isPendingFollowAction && (<Spinner />)} Follow</Button>
                        )
                )
            }

        </div>
    )
}

export default LikeList;
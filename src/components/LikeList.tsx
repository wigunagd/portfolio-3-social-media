import Image from "next/image";
import { icCheckCircle, imgProfileTemp } from "../../public/images/asset";
import { Button } from "./ui/button";
import { LikeListData } from "@/type/pageType";

const LikeList = ({ profile, followed }: LikeListData) => {
    return (
        <div className="flex justify-between items-center gap-3">
            <div className="flex gap-3 items-center">
                <Image src={profile.userAvatar ?? imgProfileTemp} alt={`avatar `} width={64} height={64} className="rounded-full w-11 h-11 md:w-16 md:h-16" />
                <div className="flex flex-col justify-center">
                    <span className="text-sm md:text-md font-bold">{profile.displayName}</span>
                    <span className="text-sm">{profile.userName}</span>
                </div>
            </div>

            {
                followed
                    ? (
                        <Button variant={'ghost2'}
                            className="flex px-4 w-full max-w-31.75 h-10 rounded-full border border-neutral-600"><Image src={icCheckCircle} alt="check followed" width={20} height={20} />Following</Button>
                    )
                    : (
                        <Button className="flex px-6 w-full max-w-23.25 h-10 rounded-full">Follow</Button>
                    )
            }

        </div>
    )
}

export default LikeList;
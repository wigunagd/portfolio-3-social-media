import Image from "next/image";
import { imgProfileTemp } from "../../public/images/asset";
import { UserSearchResult } from "@/app/(commonfunctions)/searchType";
import Link from "next/link";

const SearchList = ({ profile }: { profile: UserSearchResult }) => {
    return (
        <Link href={`/${profile.username}`} className="flex gap-2 w-full">

            <div className="relative shrink-0 rounded-full overflow-hidden w-11 h-11 md:w-16 md:h-16">
                <Image src={profile.avatarUrl ?? imgProfileTemp}
                    alt={`avatar `}
                    width={64}
                    height={64}
                    className="rounded-full w-11 h-11 md:w-16 md:h-16 object-cover" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-sm md:text-md font-bold">{profile.name}</span>
                <span className="text-sm">{profile.username}</span>
            </div>
        </Link>
    )
}

export default SearchList;
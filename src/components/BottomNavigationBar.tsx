import Image from "next/image";
import { Button } from "./ui/button";
import { iconAdd, iconHome0, iconHome1, iconProfile0, iconProfile1 } from "../../public/images/asset";
import Link from "next/link";

const BottomNavigationBar = ({ page, me }: { page: 'home' | 'profile' | 'friend', me: string }) => {
    return (
        <div className="fixed bottom-0 justify-center flex w-full">
            <div className="flex z-10 w-full md:max-w-90 h-16 md:h-20 items-center justify-between rounded-full border border-neutral-900 bg-neutral-950 px-[11.5px] py-2.75 md:px-4.25 mx-6 mb-4 md:mb-8 md:mx-0">
                <Link href="/" className={`flex flex-col gap-1 w-full max-w-23.5 h-9.5 md:h-14.5 items-center justify-center ${page === 'home' && 'text-primary-300'}`}>
                    <Image src={page === 'home' ? iconHome1 : iconHome0} alt="Home" width={20} height={20} />
                    <span className="text-xs md:text-md font-bold">Home</span>
                </Link>

                <Button className={`flex flex-col w-11 h-11 md:w-12 md:h-12 max-w-23.5 items-center justify-center rounded-full`}>
                    <Image src={iconAdd} alt="Home" width={22} height={22} />
                </Button>

                <Link href={`/${me}`} className={`flex flex-col gap-1 w-full max-w-23.5 h-9.5 md:h-14.5 items-center justify-center ${page === 'profile' && 'text-primary-300'}`}>
                    <Image src={page === 'profile' ? iconProfile1 : iconProfile0} alt="Home" width={20} height={20} />
                    <span className="text-xs md:text-md font-bold">Profile</span>
                </Link>
            </div>
        </div>
    )
}

export default BottomNavigationBar;
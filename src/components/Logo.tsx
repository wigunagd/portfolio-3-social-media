import Image from "next/image";
import { icArrowBack, logoCompany } from "../../public/images/asset";
import Link from "next/link";

const Logo = ({ href, className, profileName, userName, isMobile, pagetitle }:
    { href: string, className: string, profileName?: string, userName?: string, isMobile?: boolean, pagetitle?: string }) => {
    return (
        <div id="logo-group" className={`flex gap-2.75 items-center ${className}`}>
            <Link href={!isMobile ? href : (userName ? `/${userName}` : href)} className="shrink-0">
                <Image id="img-logo" src={isMobile && profileName ? icArrowBack : logoCompany} alt="logo company" className="flex-1 w-7.5 h-7.5" />
            </Link>
            <Link href={!isMobile ? href : '#'}>
                <span id="text-Logo" className="text-md md:text-display-xs font-bold truncate block min-w-0">{isMobile && profileName ? (pagetitle ? pagetitle : profileName) : 'Sociality'}</span>
            </Link>
        </div>
    )
}

export default Logo;
import Image from "next/image";
import { icArrowBack, logoCompany } from "../../public/images/asset";
import Link from "next/link";

const Logo = ({ href, className, profileName, userName, isMobile, pagetitle }:
    { href: string, className: string, profileName?: string, userName?: string, isMobile?: boolean, pagetitle?: string }) => {
    return (
        <div id="logo-group" className={`gap-2.75 items-center ${className}`}>
            <Link href={!isMobile ? href : (userName ? `/${userName}` : href)}>
                <Image src={isMobile && profileName ? icArrowBack : logoCompany} alt="logo company" className="w-7.5 h-7.5" />
            </Link>
            <Link href={!isMobile ? href : '#'}>
                <span className="text-display-xs font-bold">{isMobile && profileName ? (pagetitle ? pagetitle : profileName) : 'Sociality'}</span>
            </Link>
        </div>
    )
}

export default Logo;
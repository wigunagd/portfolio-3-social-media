import Image from "next/image";
import { logoCompany } from "../../public/images/asset";

const Logo = ({href, className} : {href: string,className: string}) => {
    return (
        <a href="" id="logo-group" className={`gap-2.75 items-center ${className}`}>
            <Image src={logoCompany} alt="logo company" className="w-7.5 h-7.5" /> <span className="text-display-xs font-bold">Sociality</span>
        </a>
    )
}

export default Logo;
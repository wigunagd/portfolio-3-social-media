import Image from "next/image";
import { logoCompany } from "../../public/images/asset";

const Logo = () => {
    return (
        <div id="logo-group" className="flex gap-2.75 items-center">
            <Image src={logoCompany} alt="logo company" className="w-7.5 h-7.5" /> <span className="text-display-xs font-bold">Sociality</span>
        </div>
    )
}

export default Logo;
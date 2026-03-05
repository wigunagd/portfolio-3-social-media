import Image from "next/image";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { icClose, icMenu, icSearch, imgProfileTemp } from "../../public/images/asset";
import { useState } from "react";

const NavigationBar = ({ isLoggedIn, loginName, avatarUrl }: { isLoggedIn: boolean, loginName?: string, avatarUrl?: string }) => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    const handleOpenMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }

    return (
        <header className="fixed flex w-full h-20 justify-center items-center border-b border-neutral-900 bg-black">
            <nav className="flex w-full h-full max-w-330 items-center justify-between px-4 md:px-0">
                <Logo />

                <div className="flex gap-1">
                    <div className="flex md:hidden gap-1">
                        <Button
                            variant={'ghost'}>
                            <Image src={icSearch} alt="icon search" className="w-6 h-6" />
                        </Button>

                        {
                            !isLoggedIn && (
                                <Button
                                    onClick={handleOpenMenu}
                                    variant={'ghost'}>
                                    <Image src={!isOpenMenu ? icMenu : icClose} width={24} height={24} alt="icon search" className="w-6 h-6" />
                                </Button>
                            )
                        }
                    </div>

                    {isLoggedIn && (
                        <div className="flex items-center w-fit gap-3.25">
                            <Image
                                src={avatarUrl ?? imgProfileTemp}
                                width={48}
                                height={48}
                                alt={`Profile ${loginName}`}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
                            <span className="hidden md:flex text-md font-bold">{loginName}</span>
                        </div>
                    )}
                </div>

                {!isLoggedIn && (
                    <div className={`md:flex w-full md:max-w-68 gap-3
                    ${isOpenMenu
                            ? 'absolute left-0 px-4 top-19 flex justify-between bg-black'
                            : 'hidden'
                        }
                    `}>
                        <Button variant={'ghost'} asChild
                            className="border border-neutral-900 w-full flex-1 md:max-w-32.5 h-11 rounded-full hover:bg-neutral-950">
                            <a href="/login">Login</a>
                        </Button>
                        <Button asChild
                            className="w-full flex-1 md:max-w-32.5 h-11 rounded-full hover:bg-primary-200">
                            <a href="/register">Register</a>
                        </Button>
                    </div>
                )}

            </nav>
        </header>
    )
}

export default NavigationBar;
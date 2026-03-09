import Image from "next/image";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { icClearSearch, icClose, icLogout, icMenu, iconProfile0, icSearch, imgProfileTemp } from "../../public/images/asset";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAppDispatch } from "@/redux/3_redux";
import { logout } from "@/redux/1_authSlice";
import { useGetSearchUser } from "@/app/(commonfunctions)/hooksSearch";
import SearchList from "./SearchList";
import { Spinner } from "./ui/spinner";
import { AuthState } from "@/redux/0_authType";

const NavigationBar = ({ authState, profileName, userName }: { authState: AuthState, profileName?: string, userName?:string }) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [showClearSearch, setShowClearSearch] = useState(false);

    const dispatch = useAppDispatch();

    const handleOpenMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }

    const handleOpenSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    }

    const handleSetsearch = (text: string) => {
        setSearch(text);
        setShowClearSearch(text.length > 0);
    }

    const handleLogout = () => {
        dispatch(logout());
        window.location.reload();
    }

    const {
        data: dataSearch,
        isLoading: isLoadingSearch,
        isFetchingNextPage: isFetchingNextPageSearch,
        fetchNextPage: fetchNextPageSearch,
        hasNextPage: hasNextPageSearch
    } = useGetSearchUser({ page: 1, limit: 2, q: search });

    const autoFetchRefSearch = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPageSearch && !isFetchingNextPageSearch) {
                    fetchNextPageSearch();
                }
            },
            {
                threshold: 0.1
            }
        );

        if (autoFetchRefSearch.current) {
            observer.observe(autoFetchRefSearch.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPageSearch, hasNextPageSearch, isFetchingNextPageSearch]);

    return (
        <header className="fixed flex w-full h-20 justify-center items-center border-b border-neutral-900 bg-black z-10">
            <nav className="relative flex w-full h-full max-w-330 items-center justify-between px-4 md:px-0">

                <Logo
                    profileName={profileName}
                    userName={userName}
                    isMobile={isMobile}
                    href="/"
                    className={`md:flex
                ${!isOpenSearch
                            ? 'flex'
                            : 'hidden'
                        }
                    `} />

                <div id="search-bar"
                    className={`
                ${isOpenSearch
                            ? 'flex'
                            : 'hidden'
                        }
                    relative
                    md:flex flex-1 w-full items-center px-3 h-12 md:max-w-122.75 border border-neutral-900 rounded-full`}>
                    <Image src={icSearch} width={24} height={24}
                        alt="icon close search" className="w-6 h-6" />

                    <Input
                        onChange={(e) => handleSetsearch(e.target.value)}
                        value={search}
                        id="search-input"
                        className="w-full h-12 bg-transparent border-0 focus-visible:bg-transparent" />

                    <Button
                        onClick={() => handleSetsearch('')}
                        id="btn-clear-search"
                        variant={'ghost'}
                        className={`p-0 ${!showClearSearch && ('hidden')}`}>
                        <Image src={icClearSearch} width={24} height={24}
                            alt="icon close search" className="w-6 h-6" />
                    </Button>

                    {
                        search.length > 0 && (

                            <div
                                id="search-result"
                                className="fixed flex inset-x-0 top-20 w-screen h-screen md:absolute md:inset-x-auto md:left-0 md:top-14 md:w-full md:max-w-122.75 md:h-auto md:max-h-96 md:min-h-48.75 bg-black border border-neutral-900 md:rounded-[20px] ">
                                {
                                    dataSearch?.pages[0].data.pagination.total !== 0 && (
                                        <div id="no-result" className="flex flex-col w-full  items-center gap-4 p-5 overflow-x-scroll scrollbar-hide">
                                            {
                                                dataSearch?.pages.map(page => {
                                                    return (
                                                        page.data.users.map(usr => (
                                                            <SearchList key={usr.id} profile={usr} />
                                                        ))
                                                    )
                                                })
                                            }

                                            <div ref={autoFetchRefSearch} className={`${hasNextPageSearch ? 'h-10' : 'h-0'}`} />

                                            {(isLoadingSearch || isFetchingNextPageSearch) && (
                                                <div className="flex items-center text-center py-4 mx-auto gap-5"><Spinner />Loading...</div>
                                            )}
                                        </div>
                                    )
                                }

                                {
                                    dataSearch?.pages[0].data.pagination.total === 0 && (
                                        <div id="no-result" className="flex flex-col w-full justify-center items-center">
                                            <span className="text-md font-bold">No results found</span>
                                            <span className="text-sm">Change your keyword</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>



                {
                    isOpenSearch && (
                        <Button
                            onClick={handleOpenSearch}
                            variant={'ghost'}
                            className="flex md:hidden">
                            <Image src={icClose} width={24} height={24}
                                alt="icon close search" className="w-6 h-6" />
                        </Button>
                    )
                }

                <div className="flex gap-1 items-center">

                    <div className={`${isOpenSearch ? 'hidden' : 'flex'} md:hidden gap-1`}>
                        <Button
                            onClick={handleOpenSearch}
                            variant={'ghost'}
                            className={`${!isOpenSearch
                                ? 'flex'
                                : 'hidden'
                                }`}>
                            <Image src={icSearch} alt="icon search" className="w-6 h-6" />
                        </Button>

                        {
                            !authState.isLoggedin && (
                                <Button
                                    onClick={handleOpenMenu}
                                    variant={'ghost'}>
                                    <Image src={!isOpenMenu ? icMenu : icClose} width={24} height={24} alt="icon search" className="w-6 h-6" />
                                </Button>
                            )
                        }
                    </div>

                    {authState.isLoggedin && (
                        <div className={`${isOpenSearch ? 'hidden' : 'flex'} md:flex items-center w-fit gap-3.25`}>


                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        id="drop-down-menu-button"
                                        variant={'ghost2'}
                                        className="flex items-center gap-2 h-16 border-0">
                                        <div className="relative shrink-0 rounded-full overflow-hidden w-11 h-11 md:w-16 md:h-16">
                                            <Image
                                                src={authState.avatarUrl ?? imgProfileTemp}
                                                width={48}
                                                height={48}
                                                alt={`Profile ${authState.loginName}`}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                                        </div>
                                        <span className="hidden md:flex text-md font-bold">{authState.loginName}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    asChild>
                                    <div className="min-w-(--radix-dropdown-menu-trigger-width) bg-black border-neutral-900 w-full p-4 flex flex-col mt-1 gap-4 text-md font-semibold" >
                                        <a href={`/${authState.loginUserName}`} className="flex gap-2 px-2"><Image src={iconProfile0} alt="icon profile" width={24} height={24} />My Profile</a>
                                        <a href="#" onClick={handleLogout} className="flex gap-2 px-2"><Image src={icLogout} alt="icon logout" width={24} height={24} />Logout</a>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>


                    )}
                </div>

                {!authState.isLoggedin && (
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
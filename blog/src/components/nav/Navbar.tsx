import Image from "next/image";
import Link from "next/link";
import { BiHome, BiLogIn, BiNews, BiSearch } from "react-icons/bi";
import ProfileButton from "../ProfileButton";

export default async function Navbar() {
    return (
        <div className="sticky top-0 left-0 flex items-center justify-center shadow p-5 bg-themeYellow text-white z-20">
            <div className="flex w-full sm:w-2/3 items-center">
                <Image src={'/logo.png'} height={40} width={40} alt="Logo" />
                <div className="ms-auto flex items-center">
                    <Link href="/" className="flex items-center bg-themeYellowDark rounded-lg mx-1 md:mx-2 px-2.5 py-2">
                        <BiHome />
                        <div className="hidden md:block">
                            <span className="ms-1"></span> Home
                        </div>
                    </Link>
                    <Link href="/posts" className="flex items-center bg-themeYellowDark rounded-lg mx-1 md:mx-2 px-2.5 py-2">
                        <BiNews />
                        <div className="hidden md:block">
                            <span className="ms-1"></span> Blog
                        </div>
                    </Link>
                    <Link href="/" className="flex items-center bg-themeYellowDark rounded-lg mx-1 md:mx-2 px-2.5 py-2">
                        <BiSearch />
                        <div className="hidden md:block">
                            <span className="ms-1"></span> Serch
                        </div>
                    </Link>
                    <ProfileButton/>
                </div>
            </div>
        </div>
    )
}
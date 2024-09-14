'use client'

import { Avatar } from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { BiLogIn } from "react-icons/bi"

export default function ProfileButton() {
    const session = useSession()

    return (
        <>
            {
                (session.status === 'unauthenticated') &&
                <div onClick={()=>signIn('google')} className="flex items-center bg-themeYellowDark rounded-lg mx-1 md:mx-2 px-2.5 py-2">
                    <>
                        <BiLogIn />
                        <div className="hidden md:block">
                            <span className="ms-1"></span> Login
                        </div>
                    </>
                </div>
            }

            {
                (session.status === 'authenticated') &&
                <div className="flex items-center p-1 mx-1 md:p-2 md:mx-2 rounded-lg bg-themeYellowDark">
                    <Avatar size='xs' src={(session.data as any).user.profile.cover} />
                    <div className="hidden md:block">
                        <span className="ms-1"></span> Profile
                    </div>
                </div>
            }
        </>
    )

}
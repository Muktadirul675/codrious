import { Divider } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export default ({children}:{children:React.ReactNode})=>{
    return(
        <div className="flex flex-row flex-wrap">
            <div className="w-full lg:w-1/4">
                <div className="flex flex-col">
                    <Link href="/author" className="my-3 text-blue-400">
                        DASHBOARD
                    </Link>
                    <Divider/>
                    <Link href="/author/post" className="my-3 text-blue-400">
                        POSTS
                    </Link>
                    <Divider/>
                    <Link href="/author" className="my-3 text-blue-400">
                        TAGS
                    </Link>
                    <Divider/>
                </div>
            </div>
            <div className="w-full lg:w-3/4 p-3">
                {children}
            </div>
        </div>
    )
}
import { Button } from "@chakra-ui/react"
import Link from "next/link"
import AuthorPostList from '@/components/author/post/AuthorPostList';

export default async () =>{
    return(
        <div>
            <div className="info flex p-3 rounded border bg-blue-400 items-center text-white border-blue-500 ">
                TOTAL POSTS: 80 
                <div className="ms-auto">
                    <Link href={'/author/post/add'}>
                        <Button size='sm'>Add</Button>
                    </Link>
                </div>
            </div>
            <br />
            <AuthorPostList/>
        </div>
    )
}
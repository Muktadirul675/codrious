
import React from "react"
import Link from 'next/link';

export default function PostTitle({title, post_id, status}:{title:string, post_id:string, status:string}){
    return(
        <Link href={`/posts/${post_id}`} className="block text-[24px] my-2 cursor-pointer text-blue-500 hover:text-blue-600">
            {title}
        </Link>
    )
}
'use client'

import axios from "axios"

export default async function getPostComments(post_id:string): Promise<Blog.Comment[]>{
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/comments/?post='+post_id)
    return data;
}
'use client'

import axios from "axios"

export default async function getPublicPosts(){
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/posts/')
    return data;
}


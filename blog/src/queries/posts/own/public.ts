'use client'

import axios from 'axios'

export default async function getOwnPublicPosts(access:string){
    // console.log('fetching')
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/posts/own_posts/',{
        headers:{
            Authorization:`Bearer ${access}`
        }
    })
    // console.log('fetched')

    return data
}

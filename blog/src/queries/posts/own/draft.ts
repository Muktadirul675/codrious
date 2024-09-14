'use client'

import axios from 'axios'

export default async function getOwnDrafPosts(access:string){
    // console.log('fetching')
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/drafts/own_drafts/',{
        headers:{
            Authorization:`Bearer ${access}`
        }
    })
    // console.log('fetched')

    return data
}

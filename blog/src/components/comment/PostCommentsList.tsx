'use client'

import { Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import Comment from "./Comment"
import getPostComments from "@/queries/comments/list"

export default ({post_id}:{post_id: string}) =>{
    const comments = useQuery({
        queryKey: ['posts',{id:`${post_id}`},'comments'],
        queryFn: async () :  Promise<Blog.Comment[]> =>{
            const data = await getPostComments(post_id)
            return data
        },
        staleTime: Infinity,
        keepPreviousData: true,
    })
    if(comments.isPending){
        return(
            <>
                <Spinner/>
            </>
        )
    }
    return(
        <>
            {comments.data?.map((com)=>{
                return(
                    <div key={com.id}>
                        <Comment depth={0} comment={com}/>
                    </div>
                )
            })}
        </>
    )
}
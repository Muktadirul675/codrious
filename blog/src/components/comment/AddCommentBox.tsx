'use client'

import { Button, Spinner, Textarea } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react"
import { headers } from "next/headers"
import { useState } from "react"
import { BiUpload } from "react-icons/bi"

export default ({ post_id }: { post_id: string }) => {
    const session = useSession()
    const [comment, setComment] = useState<string>('')
    const [adding, setAdding] = useState<boolean>(false)
    
    const client = useQueryClient()

    async function handleClick() {
        setAdding(true)
        if (session.status === 'authenticated') {
            if (comment === '') {
                alert('Comment can\'t be empty')
            } else {
                const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'blog/comments/?post=' + post_id + '/', {
                    post: post_id,
                    comment: comment
                }, {
                    headers: {
                        Authorization: `Bearer ${(session.data as any).access_token}`
                    }
                })
                setComment('')
                client.invalidateQueries({queryKey:['posts',{id:`${post_id}`},'comments']})
            }
        } else {
            alert('Please login to comment')
        }
        setAdding(false)
    }

    return (
        <div className="flex p-1">
            {adding && <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} disabled/>}
            {!adding && <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}/>}
            <div className="mx-1"></div>
            {adding ? <Spinner /> :
                <Button onClick={() => handleClick()} colorScheme="yellow">
                    <BiUpload className="text-white" />
                </Button>
            }
        </div>
    )
}
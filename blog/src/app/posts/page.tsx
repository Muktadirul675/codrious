'use client'

import PostAuthor from "@/components/post/PostAuthor"
import PostCover from "@/components/post/PostCover"
import PostTitle from "@/components/post/PostTitle"
import getPublicPosts from "@/queries/posts/public"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default () => {
    const posts = useQuery({
        queryKey: ['posts'],
        queryFn: async (): Promise<Blog.Post[]> => {
            const data = await getPublicPosts()
            return data;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        keepPreviousData: true
    })
    const [postArr, setPostArr] = useState<Array<Array<Blog.Post>>>([[], [], [], []])

    useEffect(() => {
        let arr: Array<Array<Blog.Post>> = [[], [], [], []];
        posts.data?.forEach((post, index) => {
            arr[index % 4].push(post)
        })
        setPostArr(arr)
    }, [posts.data])

    return (
        <>
            <div className="hidden lg:flex flex-wrap">
                <div className="w-1/4 p-1">
                    {postArr[0].map((post) => {
                        return (
                            <>
                                <div key={post.id} className="my-1">
                                    <PostCover cover={post.cover} />
                                    <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                    <PostAuthor author={post.author} created_at={post.created_at} />
                                </div>
                                
                            </>
                        )
                    })}
                </div>
                <div className="w-1/4 p-1">
                    {postArr[1].map((post) => {
                        return (
                            <>
                                <div key={post.id} className="my-1">
                                    <PostCover cover={post.cover} />
                                    <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                    <PostAuthor author={post.author} created_at={post.created_at} />
                                </div>
                                
                            </>
                        )
                    })}
                </div>
                <div className="w-1/4 p-1">
                    {postArr[2].map((post) => {
                        return (
                            <>
                                <div key={post.id} className="my-1">
                                    <PostCover cover={post.cover} />
                                    <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                    <PostAuthor author={post.author} created_at={post.created_at} />
                                </div>
                                
                            </>
                        )
                    })}
                </div>
                <div className="w-1/4 p-1">
                    {postArr[3].map((post) => {
                        return (
                            <>
                                <div key={post.id} className="my-1">
                                    <PostCover cover={post.cover} />
                                    <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                    <PostAuthor author={post.author} created_at={post.created_at} />
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            <div className="flex lg:hidden flex-wrap">
                {posts.data?.map((post) => {
                    return (
                        <>
                            <div key={post.id} className="w-full p-1 my-1" >
                                <PostCover cover={post.cover} />
                                <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                <PostAuthor author={post.author} created_at={post.created_at} />
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}
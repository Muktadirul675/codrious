'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import getOwnPublicPosts from '@/queries/posts/own/public'
import getOwnDraftPosts from '@/queries/posts/own/draft'
import PostTitle from '@/components/post/PostTitle';
import PostCover from '@/components/post/PostCover';
import PostAuthor from '@/components/post/PostAuthor';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { headers } from 'next/headers';
import Link from 'next/link';

export default function AuthorPostList() {
    const session = useSession({ required: true })
    const [tab, setTab] = useState<string>('p')
    const client = useQueryClient()

    const make_it_draft = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'blog/posts/' + id + '/', {
                status: "Draft"
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['posts', 'own'] })
            client.invalidateQueries({ queryKey: ['drafts', 'own'] })
        }
    })

    const make_it_public = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'blog/drafts/' + id + '/', {
                status: "Public"
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['drafts', 'own'] })
            client.invalidateQueries({ queryKey: ['posts', 'own'] })
        }
    })

    const posts = useQuery({
        queryKey: ['posts', 'own'],
        queryFn: async (): Promise<Blog.Post[]> => {
            // console.log('kou')
            const data = await getOwnPublicPosts((session.data as any).access_token)
            return data;
        }
    })

    const drafts = useQuery({
        queryKey: ['drafts', 'own'],
        queryFn: async (): Promise<Blog.Post[]> => {
            // console.log('kou')
            const data = await getOwnDraftPosts((session.data as any).access_token)
            return data;
        }
    })

    return (
        <div>
            <div className="flex rounded-tl-lg rounded-tr-lg bg-slate-300 text-gray">
                <div onClick={() => setTab('p')} className="flex-grow rounded-tl-lg flex justify-center items-center cursor-pointer hover:bg-slate-400 transition-all p-3">
                    Posts
                </div>
                <div onClick={() => setTab('d')} className="flex-grow rounded-tr-lg flex justify-center cursor-pointer hover:bg-slate-400 transition-all p-3 items-center">
                    Drafts
                </div>
            </div>
            <div className="m-0 p-3 border min-h-[100px]">
                {tab === 'p' && <div className='flex flex-wrap'>
                    {posts.data?.map((post) => {
                        return (
                            <div className='w-full md:w-1/2 p-1 mb-3' key={post.id}>
                                <PostCover cover={post.cover} />
                                <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                <div></div>
                                <PostAuthor created_at={post.created_at} author={post.author} />
                                <div className="my-1"></div>
                                <div className="flex items-center">
                                    <Link href={`/posts/${post.id}`} passHref>
                                        <Button size='sm' colorScheme='blue'>
                                            Read
                                        </Button>
                                    </Link>
                                    <div className="mx-1"></div>
                                    <Link href={`/author/post/${post.id}/edit`} passHref>
                                        <Button size='sm' colorScheme='blue'>
                                            Edit
                                        </Button>
                                    </Link>
                                    <div className="mx-1"></div>
                                    <Button onClick={() => make_it_draft.mutate(post.id)} size='sm' colorScheme='blue'>
                                        Make It Draft
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>}
                {tab === 'd' && <div className="flex flex-wrap">
                    {drafts.data?.map((post) => {
                        return (
                            <div className='w-full md:w-1/2 p-1 mb-3' key={post.id}>
                                <PostCover cover={post.cover} />
                                <PostTitle status={post.status} post_id={post.id} title={post.title} />
                                <div></div>
                                <PostAuthor created_at={post.created_at} author={post.author} />
                                <div className="my-1"></div>
                                <div className="flex items-center">
                                    <Link href='/' passHref>
                                        <Button size='sm' colorScheme='blue'>
                                            Read
                                        </Button>
                                    </Link>
                                    <div className="mx-1"></div>
                                    <Link href={`/author/post/${post.id}/edit/draft`} passHref>
                                        <Button size='sm' colorScheme='blue'>
                                            Edit
                                        </Button>
                                    </Link>
                                    <div className="mx-1"></div>
                                    <Button onClick={() => make_it_public.mutate(post.id)} size='sm' colorScheme='blue'>
                                        Make It Public
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    )
}


import { Avatar, Button, ButtonGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Spinner, Textarea, useDisclosure } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { BiPen, BiReply, BiTrash, BiUpload } from "react-icons/bi";

function Reply({ comment_id, post_id }: { comment_id: string, post_id: string }) {
    const { isOpen, onToggle, onClose } = useDisclosure()
    const session = useSession()
    const [reply, setReply] = useState<string>('')
    const [adding, setAdding] = useState<boolean>(false)
    const client = useQueryClient()
    const replyBox = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        replyBox.current?.focus()
    }, [])

    async function addReply() {
        setAdding(true)
        if (session.status === 'unauthenticated') {
            alert('Please login to reply')
        } else {
            if(reply === ''){
                alert('Reply can\'t be empty')
            }else{
                const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'blog/comments/', {
                    post: post_id,
                    comment: reply,
                    parent: comment_id
                }, {
                    headers: {
                        Authorization: `Bearer ${(session.data as any).access_token}`
                    }
                })
                client.invalidateQueries({ queryKey: ['posts', { id: post_id }, 'comments'] })
                onClose()
            }
        }
        setAdding(false)
    }

    return (
        <>
            <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={onClose}
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <span onClick={onToggle} className="mx-2 my-1 p-1 text-blue-500">
                        <BiReply />
                    </span>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader fontWeight='semibold'>Reply</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Textarea ref={replyBox} value={reply} onChange={(e) => setReply(e.target.value)} />
                        <div className="my-1"></div>
                        {!adding ? <Button onClick={addReply} colorScheme="yellow">
                            <BiUpload className="text-white" />
                        </Button> :
                            <Spinner />
                        }
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                            <Button onClick={onClose} variant='outline'>Cancel</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </>
    )
}

function Edit({ comment, post_id }: { comment: Blog.Comment, post_id: string }) {
    const [updating, setUpdating] = useState<boolean>(false)
    const [com, setCom] = useState<string>(comment.comment)
    const updateBox = useRef<HTMLTextAreaElement|null>(null)
    const { isOpen, onToggle, onClose } = useDisclosure()
    const session = useSession()
    const client = useQueryClient()

    async function updateComment(){
        setUpdating(true)
        if(session.status==='unauthenticated'){
            alert('Please login to edit')
        }else{
            if(com === ''){
                alert('Comment can\'t be empty')
            }else if(com === comment.comment){
                onClose()
            }else{
                const {data} = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+`blog/comments/${comment.id}/?post=${post_id}`,{
                    comment: com
                }, {
                    headers: {
                        Authorization: `Bearer ${(session.data as any).access_token}`
                    }
                })
                client.invalidateQueries({ queryKey: ['posts', { id: post_id }, 'comments'] })
                onClose()
            }
        }
        setUpdating(false)
    }

    return (
        <>
            <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={onClose}
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <span onClick={onToggle} className="mx-2 my-1 p-1 text-blue-500">
                        <BiPen />
                    </span>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader fontWeight='semibold'>Edit</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Textarea ref={updateBox} value={com} onChange={(e) => setCom(e.target.value)} />
                        <div className="my-1"></div>
                        {!updating ? <Button onClick={updateComment} colorScheme="yellow">
                            <BiUpload className="text-white" />
                        </Button> :
                            <Spinner />
                        }
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                            <Button onClick={onClose} variant='outline'>Cancel</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </>
    )
}

function Remove({comment_id, post_id}:{comment_id:string, post_id:string}){
    const session = useSession()
    const client = useQueryClient()
    const [deleting, setDeleting] = useState<boolean>(false)

    async function handleClick(){
        setDeleting(true)
        const {data} = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+`blog/comments/${comment_id}/?post=${post_id}`,{
            headers:{
                Authorization: `Bearer ${(session.data as any).access_token}`
            }
        })
        client.invalidateQueries({queryKey:['posts',{id:post_id},'comments']})
        setDeleting(false)
    }

    if(deleting){
        return <>
            <Spinner colorScheme="red"/>
        </>
    }

    return(
        <>
            <span className="mx-2 my-1 p-1" onClick={handleClick}>
                <BiTrash className="text-red-500"/>
            </span>
        </>
    )
}

export default function Comment({ comment, depth }: { comment: Blog.Comment, depth: number }) {
    const session = useSession()
    let gap = depth > 4 ? 4 : depth;
    return (
        <div className={`ms-${gap}`}>
            <div className="hidden ms-0 ms-1 ms-2 ms-3 ms-4"></div>
            {/* {depth}Ahaaaa */}
            <div className="flex flex-wrap items-center">
                <Avatar size='sm' src={comment.user.profile.cover} name={comment.user.first_name} />
                <div className="mx-1"></div>
                <div>
                    <b>{`${comment.user.first_name} ${comment.user.last_name}`}</b>
                </div>
            </div>
            <div className="my-1 ps-3">
                {comment.comment}
            </div>
            <div className="actions flex flex-wrap items-center">
                <Reply post_id={`${comment.post}`} comment_id={comment.id} />
                {session.status === 'authenticated' &&
                    <>
                        {comment.user.username === (session.data.user as any).username && <>
                            <Edit comment={comment} post_id={`${comment.post}`}/>
                            <Remove comment_id={comment.id} post_id={`${comment.post}`}/>
                        </>}
                    </>
                }
                
            </div>
            {comment.replies && comment.replies.map((reply) => {
                return (
                    <Comment depth={depth + 1} key={reply.id} comment={reply} />
                )
            })}
        </div>
    )
}
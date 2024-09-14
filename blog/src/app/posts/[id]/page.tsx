import { auth } from "@/auth"
import AddCommentBox from "@/components/comment/AddCommentBox"
import PostCommentsList from "@/components/comment/PostCommentsList"
import PostAuthor from "@/components/post/PostAuthor"
import PostTitle from "@/components/post/PostTitle"
import PostTitleHeading from "@/components/post/PostTitleHeading"
import { Tag } from "@chakra-ui/react"
import axios from "axios"

export default async ({params}:{params:{id:string}}) =>{
    const {data:post} = await axios.get<Blog.Post>(process.env.NEXTAUTH_BACKEND_URL+`blog/posts/${params.id}/`)
    return(
        <div className="w-full md:w-[500px] mx-auto p-0">
            <img src={post.cover} alt="" className="w-full rounded" />
            <div className="my-1"></div>
            <div className="p-2">
                <PostTitleHeading title={post.title}/>
            </div>
            <div className="my-1"></div>
            <div className="p-2">
                <PostAuthor author={post.author} created_at={post.created_at}/>
            </div>
            <div className="p-2">
                <div dangerouslySetInnerHTML={{__html: post.content}}></div>
            </div>
            <div className="p-2">
                {post.tags.map((tag)=>{
                    return(
                        <Tag className="me-1">{tag.name}</Tag>
                    )
                })}
            </div>
            <div className="p-2">
                <AddCommentBox post_id={post.id}/>
            </div>
            <div className="p-2">
                <PostCommentsList post_id={post.id}/>
            </div>
        </div>
    )
}
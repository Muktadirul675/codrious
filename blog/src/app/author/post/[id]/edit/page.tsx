import PostUpdateEditor from '@/components/editor/PostUpdateEditor'
import axios from 'axios'

export default async ({params}:{params:{id:string}}) =>{
    const {data:post} = await axios.get<Blog.Post>(process.env.NEXTAUTH_BACKEND_URL+`blog/posts/${params.id}/`)
    return(
        <>
            <PostUpdateEditor post={post}/>
        </>
    )
}
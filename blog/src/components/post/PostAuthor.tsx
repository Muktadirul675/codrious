import React from 'react'
import {Avatar} from '@chakra-ui/react'

export default function PostAuthor({author, created_at}:{author:Blog.Author, created_at:string}){
    const date = new Date(created_at).toLocaleDateString()
    return(
        <div className="flex items-center">
            <Avatar size='sm' src={author.profile.cover} name={author.first_name}/>
            <div className="text-sm ms-1"> 
                {author.first_name + ' ' + author.last_name} <br/>
                {date} - {'1 min read'}
            </div>
        </div>
    )
}
import React from "react"

export default function PostCover({cover}:{cover:string}){
    return(
        <>
           {(cover !== null && cover !== '') && <img className="rounded-lg w-full aspect-[4/3]" src={cover} alt="" />}
        </>
    )
}
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { BiBold, BiCode, BiHeading, BiItalic } from 'react-icons/bi'
import Command from './Command'
import Link from '@tiptap/extension-link'
import Heading from '@tiptap/extension-heading'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import html from '@/components/highlight/es/languages/vbscript-html';
import js from '@/components/highlight/es/languages/javascript';
import python from '@/components/highlight/es/languages/python'
import '@/components/highlight/styles/stackoverflow-light.css'
import { Button, Input, Textarea } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import getTags from '@/queries/tags/list'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const lowlight = createLowlight(all)

export default ({ post }: { post: Blog.Post }) => {
  const client = useQueryClient()
  const [title, setTitle] = useState<string>('')
  const [cover, setCover] = useState<File | null>(null)

  useEffect(()=>{
    setTitle(post.title)
  },[])

  const session = useSession({ required: true })
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [Document, Paragraph, Text, Bold, Link,
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl'
        }
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: post.content,
  })

  const tags = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    keepPreviousData: true,
    staleTime: Infinity,
  })

  interface ViewTags extends Blog.Tag {
    selected: boolean
  }

  const [allTags, setAllTags] = useState<Array<ViewTags>>([])
  const [showTags, setShowTags] = useState<ViewTags[]>([])
  const [selectedTags, setSelectesTags] = useState<ViewTags[]>([])
  const [seeAllTags, setSeeAllTags] = useState<boolean>(false)
  const [selectPrevTags, setSelectPrevTags] = useState<boolean>(true)

  function toggleTagSelection(id: string) {
    setAllTags(allTags.map((tag) => {
      let t = tag;
      if (t.id == id) {
        t.selected = !t.selected;
      }
      return t;
    }))
  }

  useEffect(() => {
    if (!tags.isPending && allTags.length === 0) {
      setAllTags(tags.data.map((el: ViewTags) => {
        el.selected = false
        return el
      }))
    }
  }, [tags.data])

  useEffect(() => {
    if(allTags.length > 0 && selectPrevTags){
      post.tags.forEach((tag)=>{
        toggleTagSelection(tag.id)
      })
      setSelectPrevTags(false)
    }
    setSelectesTags(allTags.filter((tag) => tag.selected))
  }, [allTags])

  useEffect(() => {
    if (seeAllTags) {
      setShowTags(allTags)
    } else[
      setShowTags(allTags.slice(0, 10))
    ]
  }, [allTags, seeAllTags])

  const [errors, setErrors] = useState<string[]>([])
  const [isPublishing, setIsPublishing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  function checkErors() {
    if (selectedTags.length === 0) {
      setErrors((prev) => [...prev, 'You must select at least one tag'])
    }
    if (editor?.getText() === '') {
      setErrors((prev) => [...prev, 'Post can\'t be empty'])
    }
    if (title === '') {
      setErrors((prev) => [...prev, 'Title can\'t be empty'])
    }
  }
  
  async function save(type:string){
    setIsSaving(true)
    let valid = true
    let faults = []
    if (selectedTags.length === 0) {
      valid = false
      faults.push('You must select at least one tag')
    }
    if (editor?.getText() === '') {
      valid = false
      faults.push('Post can\'t be empty')
    }
    if (title === '') {
      valid = false
      faults.push('Title can\'t be empty')
    }
    if (!valid) {
      setErrors(faults)
      setIsPublishing(false)
      return
    }
    if(type === 'post'){
      const {data} = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/posts/'+post.id+'/',{
        title: title,
        content: editor?.getHTML(),
        tags: selectedTags
      },{
        headers:{
          Authorization: `Bearer ${(session.data as any).access_token}`
        }
      })
      if(cover){
        const formData = new FormData()
        formData.append('cover',cover)
        await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/posts/'+post.id+'/',formData,{
          headers:{
            Authorization: `Bearer ${(session.data as any).access_token}`
          }
        })
      }
      client.invalidateQueries({queryKey:['posts','own']})
    }else{
      const {data} = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/drafts/'+post.id+'/',{
        title: title,
        content: editor?.getHTML(),
        tags: selectedTags
      },{
        headers:{
          Authorization: `Bearer ${(session.data as any).access_token}`
        }
      })
      if(cover){
        const formData = new FormData()
        formData.append('cover',cover)
        await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+'blog/drafts/'+post.id+'/',formData,{
          headers:{
            Authorization: `Bearer ${(session.data as any).access_token}`
          }
        })
      }
      client.invalidateQueries({queryKey:['drafts','own']})
    }
    setIsSaving(false)
  }

  if(!editor){
    return null;
  }

  if(isSaving){
    return(
      <>
        Saving...
      </>
    )
  }

  return (
    <>
      {/* {JSON.stringify(session.data)} */}
      <div className="bg-blue-400 hidden"></div>

      <div>
        <Input onChange={(e) => {
          if (e.target.files) {
            setCover(e.target.files[0])
          }
        }} type='file' accept='image/*' placeholder='Cover Image' />
      </div>

      <div className="my-2">
        <Textarea value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="flex w-full justify-between items-center z-5 rounded-lg border border-blue-400 bg-blue-50">
        <Command editor={editor} type="bold">
          <BiBold />
        </Command>
        <Command editor={editor} type="heading">
          <BiHeading />
        </Command>
        {/* <div onClick={()=>editor.chain().focus().toggleCodeBlock().run()}>
            <BiCode/> 
            </div> */}
        <Command editor={editor} type="codeBlock">
          <BiCode />
        </Command>
      </div>
      <EditorContent className='' editor={editor} />
      <div className="my-2 p-3 flex flex-wrap">
        <div className="w-full md:w-1/3">
          <form onSubmit={(e) => e.preventDefault()}>
            <Input onChange={(e) => {
              if (e.target.value === '') {
                setShowTags(allTags.slice(0, 10))
              } else {
                setShowTags(allTags.filter((tag) => tag.name.toLowerCase().includes(e.target.value.toLowerCase())))
              }
            }} />
          </form>
          {selectedTags.map((tag) => {
            return (
              <span key={tag.id} onClick={() => toggleTagSelection(tag.id)} className='text-white cursor-pointer rounded-lg text-sm px-2.5 py-2 m-2 border border-blue-700 bg-blue-500 inline-block'>
                {tag.name}
              </span>
            )
          })}
        </div>
        <div className="w-full md:w-2/3">
          {tags.isPending ? <>Loading...</> :
            <>
              {showTags.map((tag: ViewTags) => {
                if (tag.selected) {
                  return (
                    <span key={tag.id} onClick={() => toggleTagSelection(tag.id)} className='text-white cursor-pointer rounded-lg text-sm px-2.5 py-2 m-2 border border-blue-700 bg-blue-500 inline-block'>
                      {tag.name}
                    </span>
                  )
                } else {
                  return (
                    <span key={tag.id} onClick={() => toggleTagSelection(tag.id)} className='cursor-pointer rounded-lg text-sm px-2.5 py-2 m-2 border border-blue-700 inline-block'>
                      {tag.name}
                    </span>
                  )
                }
              })}
              <div className='text-blue-500 cursor-pointer' onClick={() => setSeeAllTags(!seeAllTags)}>
                {seeAllTags ? <>See Less</> : <>See all</>}
              </div>
            </>
          }
        </div>
      </div>
      <div className="p-3">
        {errors.length > 0 && <div className="text-white my-2 errors border border-red-500 bg-red-300 p-3 rounded-lg">
          {errors.map((error, index) => {
            return (
              <div key={index} className='my-1'>
                {error}
              </div>
            )
          })}
          <div className="mt-1">
            <Button size='xs' onClick={() => setErrors([])} colorScheme='red'>Close</Button>
          </div>
        </div>}
        <Button onClick={() => save((post.status === "Public" ? 'post' : 'draft'))} size='sm'>
          Save
        </Button>
      </div>
    </>
  )
}
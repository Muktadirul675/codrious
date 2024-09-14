'use client'

import { Editor } from "@tiptap/react"
import { useEffect, useState } from "react"

export default function Command({ editor, type, children }: { editor: Editor, type: string, children: React.ReactNode }) {
    const [active, setActive] = useState<boolean>(false)

    useEffect(() => {
        if (editor) {
            switch(type){
                case 'heading':
                    setActive(editor.isActive('heading',{level:3}))
                    break
                default:
                    setActive(editor.isActive(type))

            }
        }
        // console.log(editor.isActive(type))
    }, [editor.isActive(type)])

    if (!editor) {
        return null;
    }

    function handleClick() {
        switch (type) {
            case 'bold':
                editor.chain().focus().toggleBold().run()
                break
            case 'heading':
                editor.chain().focus().toggleHeading({level:3}).run()
                break
            case 'codeBlock':
                editor.chain().focus().toggleCodeBlock().run()
                break
        }
    }

    if (active) {
        return (
            <div onClick={handleClick} className="bg-blue-400 p-3 cursor-pointer last:rounded-tr-lg last:rounded-br-lg first:rounded-tl-lg first:rounded-bl-lg">
                {children}
            </div>
        )
    } else {
        return (
            <div onClick={handleClick} className="p-3 cursor-pointer last:rounded-tr-lg last:rounded-br-lg first:rounded-tl-lg first:rounded-bl-lg">
                {children}
            </div>
        )
    }
}
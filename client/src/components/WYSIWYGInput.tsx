import {Button, Flex, IconButton, Separator, Text, Tooltip} from "@radix-ui/themes";
import {type ReactElement, useEffect, useState} from "react";
import type {Editor} from '@tiptap/react'
import {EditorContent, useEditor, useEditorState} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyleKit} from '@tiptap/extension-text-style'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    FontBoldIcon,
    FontItalicIcon,
    ListBulletIcon,
    QuoteIcon,
    UnderlineIcon
} from "@radix-ui/react-icons";

const extensions = [TextStyleKit, StarterKit]

function MenuBar({editor}: { editor: Editor }) {
    // Read the current editor's state, and re-render the component when it changes
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                isBold: ctx.editor.isActive('bold') ?? false,
                canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
                isItalic: ctx.editor.isActive('italic') ?? false,
                canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
                isUnderline: ctx.editor.isActive('underline') ?? false,
                canUnderline: ctx.editor.can().chain().toggleUnderline() ?? false,
                isParagraph: ctx.editor.isActive('paragraph') ?? false,
                isHeading1: ctx.editor.isActive('heading', {level: 1}) ?? false,
                isHeading2: ctx.editor.isActive('heading', {level: 2}) ?? false,
                isHeading3: ctx.editor.isActive('heading', {level: 3}) ?? false,
                isHeading4: ctx.editor.isActive('heading', {level: 4}) ?? false,
                isHeading5: ctx.editor.isActive('heading', {level: 5}) ?? false,
                isHeading6: ctx.editor.isActive('heading', {level: 6}) ?? false,
                isBulletList: ctx.editor.isActive('bulletList') ?? false,
                isOrderedList: ctx.editor.isActive('orderedList') ?? false,
                isBlockquote: ctx.editor.isActive('blockquote') ?? false,
                canUndo: ctx.editor.can().chain().undo().run() ?? false,
                canRedo: ctx.editor.can().chain().redo().run() ?? false,
            }
        },
    })

    return (
        <div className="control-group">
            <Flex gap='1' wrap='wrap' align='center'>
                <Tooltip content='Bold'>
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editorState.canBold}
                        variant={editorState.isBold ? 'solid' : 'outline'}
                    >
                        <FontBoldIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip content='Italic'>
                    <IconButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editorState.canItalic}
                        variant={editorState.isItalic ? 'solid' : 'outline'}
                    >
                        <FontItalicIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip content='Underline'>
                    <IconButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        disabled={!editorState.canUnderline}
                        variant={editorState.isUnderline ? 'solid' : 'outline'}
                    >
                        <UnderlineIcon/>
                    </IconButton>
                </Tooltip>
                <Separator orientation='vertical' mx='1' size='2'/>
                <Tooltip content='Paragraph'>
                    <Button
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        variant={editorState.isParagraph ? 'solid' : 'outline'}
                    >
                        P
                    </Button>
                </Tooltip>
                <Tooltip content='Heading 1'>
                    <Button
                        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                        variant={editorState.isHeading1 ? 'solid' : 'outline'}
                    >
                        H1
                    </Button>
                </Tooltip>
                <Tooltip content='Heading 2'>
                    <Button
                        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                        variant={editorState.isHeading2 ? 'solid' : 'outline'}
                    >
                        H2
                    </Button>
                </Tooltip>
                <Separator orientation='vertical' mx='1' size='2'/>
                <Tooltip content='Bullet List'>
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        variant={editorState.isBulletList ? 'solid' : 'outline'}
                    >
                        <ListBulletIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip content='Quote'>
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        variant={editorState.isBlockquote ? 'solid' : 'outline'}
                    >
                        <QuoteIcon/>
                    </IconButton>
                </Tooltip>
                <Separator orientation='vertical' mx='1' size='2'/>
                <Tooltip content='Undo'>
                    <IconButton
                        onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}
                        variant='outline'
                    >
                        <ArrowLeftIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip content='Redo'>
                    <IconButton
                        onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}
                        variant='outline'
                    >
                        <ArrowRightIcon/>
                    </IconButton>
                </Tooltip>
            </Flex>
        </div>
    )
}

interface Props {
    label: string,
    name: string,
    value: string,
    onChange: (name: string, editor: Editor) => void,
}

export default function ({label, onChange, name, value}: Props): ReactElement {
    const editor = useEditor({
        extensions: extensions,
        content: value,
        onUpdate: ({editor}) => onChange(name, editor)
    })

    const [isFocused, setIsFocused] = useState(false)
    useEffect(() => {
        if (!editor) return;

        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        editor.on('focus', handleFocus);
        editor.on('blur', handleBlur);

        return () => {
            editor.off('focus', handleFocus);
            editor.off('blur', handleBlur);
        };
    }, [editor])

    return (
        <Flex direction='column' gap='1' as='div'>
            <Text>{label}:</Text>
            <div className={`WYSIWYGWrapper ${isFocused ? 'focused' : ''}`}>
                <Flex direction='column' gap='3'>
                    <MenuBar editor={editor}/>
                    <EditorContent editor={editor}/>
                </Flex>
            </div>
        </Flex>
    )
}
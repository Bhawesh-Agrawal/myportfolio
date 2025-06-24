'use client';

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';
import Toolbar from './Toolbar';

// Custom Embed Extension
const Embed = Extension.create({
    name: 'embed',
    addOptions() {
        return {
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'embed-iframe',
            },
        };
    },
    addAttributes() {
        return {
            src: {
                default: null as string | null,
            },
            frameborder: {
                default: '0',
            },
            allowfullscreen: {
                default: this.options.allowFullscreen as boolean,
            },
            width: {
                default: '100%',
            },
            height: {
                default: '400px',
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'iframe.embed-iframe',
            },
        ];
    },
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
        return ['iframe', HTMLAttributes];
    },
    // @ts-ignore
    addCommands() {
        return {
            setEmbed:
                (options: Record<string, any>) =>
                    ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                blockquote: {},
                codeBlock: {},
            }),
            Image.configure({ inline: true }),
            Link.configure({ openOnClick: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Highlight.configure({
                multicolor: true,
            }),
            Embed,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="border rounded-md p-4 bg-white">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
        </div>
    );
};

export default Editor;

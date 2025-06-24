'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface ToolbarProps {
    editor: Editor | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    const [imageUrl, setImageUrl] = useState('');

    const setLink = () => {
        const url = prompt('Enter the URL');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const setEmbed = () => {
        const url = prompt('Enter embed URL (e.g., YouTube, Twitter)');
        if (url) {
            editor
                ?.chain()
                .focus()
                // @ts-ignore
                .setEmbed({ src: url, frameborder: '0', allowfullscreen: true, width: '100%', height: '400px' } as any)
                .run();
        }
    };

    const setHighlight = (color: string) => {
        editor?.chain().focus().toggleHighlight({ color }).run();
    };

    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-100 rounded-t-md">
            <select
                onChange={(e) => {
                    const level = parseInt(e.target.value);
                    if (level) {
                        // @ts-ignore
                        editor.chain().focus().toggleHeading({ level }).run();
                    } else {
                        editor.chain().focus().setParagraph().run();
                    }
                }}
                className="p-2 bg-white rounded"
                defaultValue="0"
            >
                <option value="0">Paragraph</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
            </select>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 ${editor.isActive('bold') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 ${editor.isActive('italic') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 ${editor.isActive('bulletList') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Bullet List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 ${editor.isActive('orderedList') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Ordered List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 ${editor.isActive('blockquote') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Quote
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 ${editor.isActive('codeBlock') ? 'bg-blue-200' : 'bg-white'} rounded`}
            >
                Code Block
            </button>
            <button onClick={setLink} className="p-2 bg-white rounded">
                Link
            </button>
            <CldUploadWidget
                uploadPreset="portfolio-blog"
                onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                        const url = result.info.secure_url;
                        setImageUrl(url);
                        editor?.chain().focus().setImage({ src: url }).run();
                    }
                }}
                onError={(error: any) => console.error('Upload failed:', error)}
            >
                {({ open }) => (
                    <button
                        onClick={() => open()}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Add Image
                    </button>
                )}
            </CldUploadWidget>
            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="p-2 bg-white rounded"
            >
                Table
            </button>
            <button
                onClick={() => setHighlight('yellow')}
                className={`p-2 ${editor.isActive('highlight', { color: 'yellow' }) ? 'bg-yellow-200' : 'bg-white'} rounded`}
            >
                Highlight Yellow
            </button>
            <button
                onClick={() => setHighlight('red')}
                className={`p-2 ${editor.isActive('highlight', { color: 'red' }) ? 'bg-red-200' : 'bg-white'} rounded`}
            >
                Highlight Red
            </button>
            <button onClick={setEmbed} className="p-2 bg-white rounded">
                Embed
            </button>
        </div>
    );
};

export default Toolbar;
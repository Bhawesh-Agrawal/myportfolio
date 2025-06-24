'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Editor from '@/app/Editor/Editor';
import { useMutation } from 'convex/react';
import { api } from "../../../convex/_generated/api";

interface PostData {
    id: string;
    type: 'blog' | 'project';
    title: string;
    slug: string;
    bannerImage: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    tags: string[];
    projectLinks: {
        website: string | null;
        github: string | null;
        references: { label: string; url: string }[];
    } | null;
    _id?: string; // Optional internal fields from Convex
    _creationTime?: number;
}

const PostEditor: React.FC<{ initialData?: PostData }> = ({ initialData }) => {
    const [postData, setPostData] = useState<PostData>(
        initialData ?? {
            id: crypto.randomUUID(),
            type: 'blog',
            title: '',
            slug: '',
            bannerImage: null,
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            published: false,
            tags: [],
            projectLinks: null,
        }
    );

    const [reference, setReference] = useState<{ label: string; url: string }>({ label: '', url: '' });
    const createPost = useMutation(api.createPost.createPost);
    const updatePost = useMutation(api.createPost.updatePost);

    const addReference = () => {
        if (reference.label && reference.url) {
            setPostData((prev) => {
                const projectLinks = prev.projectLinks ?? { website: null, github: null, references: [] };
                return {
                    ...prev,
                    projectLinks: {
                        ...projectLinks,
                        references: [...projectLinks.references, reference],
                    },
                };
            });
            setReference({ label: '', url: '' });
        }
    };

    const resetForm = () => {
        setPostData({
            id: crypto.randomUUID(),
            type: 'blog',
            title: '',
            slug: '',
            bannerImage: null,
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            published: false,
            tags: [],
            projectLinks: null,
        });
        setReference({ label: '', url: '' });
    };

    const handleSubmit = async (isDraft: boolean) => {
        // Remove internal Convex fields and the id field (Convex uses _id instead)
        const { _creationTime, _id, id, ...rest } = postData;

        const projectLinks = rest.projectLinks === null ? undefined : rest.projectLinks;

        const data = {
            ...rest,
            projectLinks,
            published: isDraft ? false : true,
            updatedAt: new Date().toISOString(),
        };

        try {
            if (initialData) {
                await updatePost(data);
                alert('Post updated successfully');
            } else {
                await createPost(data);
                alert(isDraft ? 'Draft saved successfully' : 'Post published successfully');
                if (!isDraft) resetForm();
            }
        } catch (err: any) {
            console.error('Failed to save post:', err);
            alert(`Error: ${err.message}`);
        }
    };




    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        value={postData.type}
                        onChange={(e) =>
                            setPostData({
                                ...postData,
                                type: e.target.value as 'blog' | 'project',
                                projectLinks:
                                    e.target.value === 'project' ? { website: null, github: null, references: [] } : null,
                            })
                        }
                        className="border rounded p-2 w-full"
                    >
                        <option value="blog">Blog</option>
                        <option value="project">Project</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={postData.title}
                        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Slug</label>
                    <input
                        type="text"
                        value={postData.slug}
                        onChange={(e) => setPostData({ ...postData, slug: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={postData.tags.join(',')}
                        onChange={(e) =>
                            setPostData({ ...postData, tags: e.target.value.split(',').map((t) => t.trim()) })
                        }
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Banner Image</label>
                    <CldUploadWidget
                        uploadPreset="portfolio-blog"
                        onSuccess={(result: any) => {
                            if (result?.info?.secure_url) {
                                setPostData({ ...postData, bannerImage: result.info.secure_url });
                            }
                        }}
                        onError={(error: any) => console.error('Upload failed:', error)}
                    >
                        {({ open }) => (
                            <button onClick={() => open()} className="p-2 bg-blue-500 text-white rounded">
                                Upload Banner
                            </button>
                        )}
                    </CldUploadWidget>
                    {postData.bannerImage && <img src={postData.bannerImage} alt="Banner" className="mt-2 max-w-xs" />}
                </div>
                {postData.type === 'project' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Website Link</label>
                            <input
                                type="text"
                                value={postData.projectLinks?.website || ''}
                                onChange={(e) =>
                                    setPostData({
                                        ...postData,
                                        projectLinks: { ...postData.projectLinks!, website: e.target.value || null },
                                    })
                                }
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">GitHub Link</label>
                            <input
                                type="text"
                                value={postData.projectLinks?.github || ''}
                                onChange={(e) =>
                                    setPostData({
                                        ...postData,
                                        projectLinks: { ...postData.projectLinks!, github: e.target.value || null },
                                    })
                                }
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Reference Links</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={reference.label}
                                    onChange={(e) => setReference({ ...reference, label: e.target.value })}
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={reference.url}
                                    onChange={(e) => setReference({ ...reference, url: e.target.value })}
                                    className="border rounded p-2 w-full"
                                />
                                <button onClick={addReference} className="p-2 bg-blue-500 text-white rounded">
                                    Add
                                </button>
                            </div>
                            <ul className="mt-2">
                                {postData.projectLinks?.references.map((ref, index) => (
                                    <li key={index} className="flex gap-2">
                                        <span>
                                            {ref.label}: {ref.url}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setPostData({
                                                    ...postData,
                                                    projectLinks: {
                                                        ...postData.projectLinks!,
                                                        references: postData.projectLinks!.references.filter((_, i) => i !== index),
                                                    },
                                                })
                                            }
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium">Content</label>
                    <Editor content={postData.content} onChange={(content) => setPostData({ ...postData, content })} />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSubmit(true)}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;

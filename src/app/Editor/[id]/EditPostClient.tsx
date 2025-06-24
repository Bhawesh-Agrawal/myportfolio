'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";
import PostEditor from "@/app/Editor/PostEditor";

interface Props {
    id: Id<"blog">;
}

const EditPostClient = ({ id }: Props) => {
    const post = useQuery(api.getPost.getPostById, { id });

    if (!post) return <div>Loading post...</div>;

    return (
        <PostEditor
            initialData={{
    ...post,
            id: post._id,
            bannerImage: post.bannerImage ?? null,
            projectLinks: post.projectLinks
            ? {
                website: post.projectLinks.website ?? null,
                github: post.projectLinks.github ?? null,
                references: post.projectLinks.references ?? [],
            }
            : null,
            createdAt: new Date(post._creationTime).toISOString(),
            updatedAt: new Date().toISOString(),
    }}
    />
);
};

export default EditPostClient;

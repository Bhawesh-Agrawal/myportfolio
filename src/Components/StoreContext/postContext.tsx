"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Post {
    _id: Id<"blog">;
    _creationTime: number;
    type: "blog" | "project";
    title: string;
    slug: string;
    bannerImage: string | null ;
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
}

interface PostContextType {
    posts: Post[];
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    resetPosts: () => void;
    loadMore: () => void;
    getPostById: (id: Id<"blog">) => Post | undefined;
}

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryResult = useQuery(api.getPost.getPost, {
        publishedOnly: true,
        limit: 15,
        cursor,
    });

    useEffect(() => {
        if (queryResult && queryResult.posts) {
            const validatedPosts: Post[] = queryResult.posts.map((post) => ({
                _id: post._id,
                _creationTime: post._creationTime,
                type: post.type,
                title: post.title,
                slug: post.slug,
                bannerImage: post.bannerImage ?? null,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                published: post.published,
                tags: post.tags,
                projectLinks: post.projectLinks
                    ? {
                        website: post.projectLinks.website ?? null,
                        github: post.projectLinks.github ?? null,
                        references: post.projectLinks.references ?? [],
                    }
                    : null,
            }));

            // Deduplicate by ID
            setPosts((prev) => {
                const existingIds = new Set(prev.map((p) => p._id));
                const newUnique = validatedPosts.filter((p) => !existingIds.has(p._id));
                return [...prev, ...newUnique];
            });


            setCursor(queryResult.nextCursor ?? undefined);
            setHasMore(!!queryResult.nextCursor);
            setIsLoading(false);
            setError(null);
        } else if (queryResult === null) {
            setError("Failed to load posts");
            setIsLoading(false);
        }
    }, [queryResult]);




    const loadMore = () => {
        if (hasMore && !isLoading) {
            setIsLoading(true);
        }
    };

    const resetPosts = () => {
        setPosts([]);
        setCursor(undefined);
        setHasMore(true);
        setIsLoading(false);
        setError(null);
    };

    const getPostById = (id: Id<"blog">) => {
        const post = posts.find((post) => post._id === id);
        return post;
    };

    return (
        <PostContext.Provider value={{ posts, isLoading, hasMore, error, resetPosts, loadMore, getPostById }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePosts must be used within a PostProvider");
    }
    return context;
};

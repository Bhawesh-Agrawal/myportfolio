import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConvexHttpClient } from 'convex/browser';
import { api } from "../../../../convex/_generated/api";
import BlogPostClient from './BlogPostClient';

// Initialize Convex client for server-side usage
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper function to create short slug
function createShortSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 50)
        .replace(/-$/, '');
}

// Function to find blog by slug (similar to your client logic)
async function getBlogPost(slug: string) {
    try {
        // First, get all posts from Convex
        const posts = await convex.query(api.getPost.getAllPosts); // Adjust query name as needed

        if (!posts || posts.length === 0) {
            return null;
        }

        // Filter blog posts only
        const blogPosts = posts.filter((post: any) => post.type === "blog");

        // Find by exact slug match
        let foundBlog = blogPosts.find((post: any) => post.slug === slug);

        // If not found, try matching with generated short slug
        if (!foundBlog) {
            foundBlog = blogPosts.find((post: any) =>
                createShortSlug(post.title) === slug
            );
        }

        // If still not found, try case-insensitive match
        if (!foundBlog) {
            foundBlog = blogPosts.find((post: any) =>
                post.slug?.toLowerCase() === slug.toLowerCase() ||
                createShortSlug(post.title).toLowerCase() === slug.toLowerCase()
            );
        }

        return foundBlog || null;
    } catch (error) {
        console.error('Error fetching blog post from Convex:', error);
        return null;
    }
}

// Alternative approach: If you have a specific query to get post by slug
async function getBlogPostBySlug(slug: string) {
    try {
        // Option 1: If you have a specific query function in Convex
        const post = await convex.query(api.getPost.getBySlug, { slug });
        if (post && post.type === "blog") {
            return post;
        }

        // Option 2: If the above doesn't work, try with short slug
        const postByShortSlug = await convex.query(api.getPost.getBySlug, {
            slug: createShortSlug(slug)
        });
        if (postByShortSlug && postByShortSlug.type === "blog") {
            return postByShortSlug;
        }

        // Fallback to the previous method
        return await getBlogPost(slug);
    } catch (error) {
        console.error('Error fetching blog post by slug:', error);
        return await getBlogPost(slug);
    }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    // Try to get the post from Convex
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Article Not Found',
            description: 'The article you\'re looking for doesn\'t exist.',
            robots: 'noindex, nofollow',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    const shortSlug = createShortSlug(post.title);
    const canonicalUrl = `${baseUrl}/blog/${shortSlug}`;

    return {
        title: post.title,
        description: post.slug || post.title,
        authors: [{ name: 'Admin' }],
        keywords: post.tags?.join(', ') || '',

        // Open Graph
        openGraph: {
            title: post.title,
            description: post.slug || post.title,
            url: canonicalUrl,
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt || post.createdAt,
            authors: ['Admin'],
            tags: post.tags || [],
            images: post.bannerImage ? [
                {
                    url: post.bannerImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ] : [],
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.slug || post.title,
            images: post.bannerImage ? [post.bannerImage] : [],
        },

        // Other meta tags
        alternates: {
            canonical: canonicalUrl,
        },

        // Structured data
        other: {
            'article:author': 'Admin',
            'article:published_time': post.createdAt,
            'article:modified_time': post.updatedAt || post.createdAt,
            'article:section': post.tags?.join(', ') || '',
            ...(post.tags || []).reduce((acc, tag, index) => {
                acc[`article:tag${index}`] = tag;
                return acc;
            }, {} as Record<string, string>),
        },
    };
}

// Main server component
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Generate structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.slug || post.title,
        "image": post.bannerImage || "",
        "author": {
            "@type": "Person",
            "name": "Admin"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Your Site Name", // Replace with your actual site name
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png` // Replace with your logo URL
            }
        },
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt || post.createdAt,
        "articleSection": post.tags?.join(", ") || "",
        "keywords": post.tags?.join(", ") || "",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/Blog/${createShortSlug(post.title)}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            <BlogPostClient initialPost={post} />
        </>
    );
}

// Optional: Generate static paths for better performance
export async function generateStaticParams() {
    try {
        const posts = await convex.query(api.getPost.getAllPosts);
        const blogPosts = posts.filter((post: any) => post.type === "blog");

        return blogPosts.map((post: any) => ({
            slug: createShortSlug(post.title),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}
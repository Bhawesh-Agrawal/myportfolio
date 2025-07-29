"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaShare,
  FaTag,
  FaUser,
} from "react-icons/fa";
import DOMPurify from "isomorphic-dompurify";

interface Post {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug: string;
  type: string;
  author?: string;
  bannerImage?: string | null;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
}

interface BlogPostClientProps {
  initialPost: Post;
}

export default function BlogPostClient({ initialPost }: BlogPostClientProps) {
  const router = useRouter();
  const [blog] = useState<Post>(initialPost);

  const createShortSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .substring(0, 50)
      .replace(/-$/, "");
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return "No date";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const calculateReadTime = (content: string | undefined): string => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleShare = async (): Promise<void> => {
    const shortSlug = createShortSlug(blog.title);
    const shareUrl = `${window.location.origin}/Blog/${shortSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.slug || blog.title,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-serif"> {/* Set base font to serif */}
      {/* Hero Section */}
      <div className="relative">
        {blog.bannerImage && (
          <div
            className="h-96 bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(96, 150, 180, 0.7) 0%, rgba(189, 205, 214, 0.5) 100%), url('${blog.bannerImage}')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors shadow-sm font-sans" // Use sans for UI elements
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight font-sans"> {/* Use sans for headings */}
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4 font-sans"> {/* Use sans for meta */}
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                <span>{blog.author || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{formatDate(blog.createdAt || blog.publishedAt)}</span>
              </div>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>{calculateReadTime(blog.content)}</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags?.length! > 0 && (
              <div className="flex items-center gap-2 mb-4 font-sans"> {/* Use sans for tags */}
                <FaTag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#EEE9DA] text-gray-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="flex justify-end">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-[#6096B4] hover:text-[#6096B4]/80 transition-colors font-sans" // Use sans for UI elements
              >
                <FaShare className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </div>

          {/* Article Excerpt */}
          {blog.excerpt && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#6096B4]">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {blog.content ? (
            <>
              <div
                className="text-gray-800 prose prose-lg md:prose-xl max-w-none blog-content-area"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content || ""),
                }}
              />
              <style jsx global>{`
                /* Apply the base body font from our layout.tsx variable */
                .blog-content-area.prose {
                  font-family: var(--font-lora), serif;
                }

                /* --- NEW: Enhanced Paragraph Styling --- */
                .blog-content-area.prose p {
                  margin-top: 1.25em; /* Space above each paragraph */
                  margin-bottom: 1.25em; /* Space below each paragraph */
                  font-size: 1.15rem; /* Increased font size for readability (~18.4px) */
                  line-height: 1.9; /* Generous line spacing for an "open" feel */
                  letter-spacing: 0.01em; /* Subtle spacing between letters */
                  font-weight: 400; /* Normal weight for body text */
                  color: #374151; /* A slightly softer black (gray-700) */
                }
                
                /* --- NEW: Heading Styling with Montserrat --- */
                .blog-content-area.prose h1,
                .blog-content-area.prose h2,
                .blog-content-area.prose h3,
                .blog-content-area.prose h4,
                .blog-content-area.prose h5,
                .blog-content-area.prose h6 {
                  font-family: var(--font-montserrat), sans-serif; /* Use the heading font */
                  margin-top: 2.5em; 
                  margin-bottom: 1em; 
                  font-weight: 700; /* Bolder headings */
                  letter-spacing: -0.01em; /* Slightly tighter letter spacing for headings */
                }

                .blog-content-area.prose h2 {
                  font-size: 1.8em;
                }
                .blog-content-area.prose h3 {
                  font-size: 1.5em;
                }
                
                /* Ensure first/last child within prose doesn't have extra margin */
                .blog-content-area.prose > *:first-child {
                  margin-top: 0;
                }
                .blog-content-area.prose > *:last-child {
                  margin-bottom: 0;
                }

                /* Other styles for a complete look */
                .blog-content-area.prose img {
                  margin-top: 2.5em;
                  margin-bottom: 2.5em;
                  border-radius: 0.5rem; /* Softer rounded corners for images */
                }

                .blog-content-area.prose a {
                  color: #6096B4;
                  font-weight: 500;
                  text-decoration: none; /* Remove underline by default */
                  border-bottom: 2px solid #bdcdd6; /* Use a border for a modern underline */
                  transition: all 0.2s ease-in-out;
                }
                .blog-content-area.prose a:hover {
                  color: #4a7d97;
                  background-color: #f0f4f7; /* Slight highlight on hover */
                  border-bottom-color: #6096B4;
                }

                .blog-content-area.prose blockquote {
                  margin-top: 2em;
                  margin-bottom: 2em;
                  padding: 1em 1.5em;
                  border-left: 4px solid #6096B4;
                  color: #4b5563;
                  font-style: italic;
                  font-size: 1.1rem;
                  line-height: 1.8;
                }

                .blog-content-area.prose ul,
                .blog-content-area.prose ol {
                  margin-top: 1.5em;
                  margin-bottom: 1.5em;
                }
                .blog-content-area.prose li {
                  margin-bottom: 0.75em;
                  line-height: 1.9;
                }

                .blog-content-area.prose code:not(pre code) {
                  background-color: #e5e7eb;
                  padding: 0.2em 0.4em;
                  border-radius: 4px;
                  font-size: 0.9em;
                  color: #111827;
                }

                .blog-content-area.prose pre {
                  margin-top: 2em;
                  margin-bottom: 2em;
                }
              `}</style>
            </>
          ) : (
            <div className="text-center py-16 font-sans">
              <p className="text-gray-500 text-lg">
                Article content is not available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
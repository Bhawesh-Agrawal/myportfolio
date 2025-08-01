// app/sitemap.ts

import { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper: create short slug as in your codebase
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bhaweshagrawal.com.np';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch blog posts from Convex
  const posts = await convex.query(api.getPost.getAllPosts);
  const blogPosts = posts.filter((post: any) => post.type === "blog" && post.published);

  // 2. Fetch projects, assuming similar Convex usage
  // You may have to tweak this if projects come from another endpoint
  const projects = posts.filter((post: any) => post.type === "project");

  // 3. Generate URLs for all dynamic routes
  const blogUrls = blogPosts.map((post: any) => ({
    url: `/Blog/${createShortSlug(post.title)}`,
    lastModified: post.updatedAt || post.createdAt,
  }));

  const projectUrls = projects.map((post: any) => ({
    url: `/Project/${post._id}`,
    lastModified: post.updatedAt || post.createdAt,
  }));

  // 4. Static page URLs
  const basePages = [
    { url: '/', lastModified: new Date().toISOString() },
    { url: '/Blog', lastModified: new Date().toISOString() },
    { url: '/Contact', lastModified: new Date().toISOString() },
    { url: '/Project', lastModified: new Date().toISOString() },  // Adjust as per your route
  ];

  // 5. Merge all routes
  const allRoutes = [
    ...basePages,
    ...blogUrls,
    ...projectUrls,
  ];

  
    return allRoutes.map(route => ({
    url: baseUrl + route.url,
    lastModified: route.lastModified,
    }));

}

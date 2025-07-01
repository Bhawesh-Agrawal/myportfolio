import { mutation } from "./_generated/server";
import { v } from "convex/values";

const createPostArgs = {
    type: v.union(v.literal("blog"), v.literal("project")),
    title: v.string(),
    slug: v.string(),
    bannerImage: v.optional(v.string()),
    content: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    published: v.boolean(),
    tags: v.array(v.string()),
    projectLinks: v.optional(
        v.object({
            website: v.optional(v.string()),
            github: v.optional(v.string()),
            references: v.optional(v.array(
                v.object({
                    label: v.string(),
                    url: v.string(),
                })
            )),
        })
    ),
} as const;

export const createPost = mutation({
    args: createPostArgs,
    handler: async (ctx, args) => {
        const { title, slug, tags, projectLinks } = args;

        if (title.trim() === "") throw new Error("Title cannot be empty.");
        if (slug.trim() === "") {
            throw new Error("Description cannot be empty.");
        }

        if (tags.length > 10) throw new Error("Too many tags. Max is 10.");

        const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;

        if (projectLinks) {
            const { website, github, references } = projectLinks;

            if (website && !urlPattern.test(website)) {
                throw new Error("Invalid website URL.");
            }

            if (github && !urlPattern.test(github)) {
                throw new Error("Invalid GitHub URL.");
            }

            for (const ref of references || []) { // <-- make sure references can be undefined or empty
                if (ref.label.trim() === "") {
                    throw new Error("Reference label cannot be empty.");
                }
                if (!urlPattern.test(ref.url)) {
                    throw new Error(`Reference URL "${ref.url}" is invalid.`);
                }
            }
        }

        const id = await ctx.db.insert("blog", {
            ...args,
        });

        return { success: true, id };
    },
});

export const updatePost = mutation({
    args: {
        id: v.id("blog"),
        title: v.string(),
        slug: v.string(),
        type: v.union(v.literal("blog"), v.literal("project")),
        bannerImage: v.optional(v.string()),
        content: v.string(),
        tags: v.array(v.string()),
        published: v.boolean(),
        updatedAt: v.string(),
        projectLinks: v.optional(
            v.object({
                website: v.optional(v.string()),
                github: v.optional(v.string()),
                references: v.array(
                    v.object({ label: v.string(), url: v.string() })
                ),
            })
        ),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, { ...rest });
    },
});
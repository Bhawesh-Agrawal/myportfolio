import { query } from "./_generated/server";
import { v } from "convex/values"

export const getPost = query({
    args : {
        publishedOnly : v.optional(v.boolean()),
        limit: v.optional(v.number()),
        cursor : v.optional(v.string())
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("blog")

        if(args.publishedOnly){
            query = query.filter((q) => q.eq(q.field("published"), true));
        }

        const results = await query
            .order("desc")
            .paginate({
                numItems: args.limit ?? 10,
                cursor : args.cursor ?? null
            });

        return {
            posts : results.page,
            nextCursor : results.isDone ? null : results.continueCursor,
        };
    },
});

export const getPostById = query({
    args : { id : v.id("blog")},
    handler : async (ctx, args) => {
        const post = await ctx.db.get(args.id);
        return post;
    },
});


export const getAllPosts = query({
    handler: async (ctx) => {
        return await ctx.db.query("blog").collect();
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("blog")
            .filter((q) => q.eq(q.field("slug"), args.slug))
            .first();
    },
});
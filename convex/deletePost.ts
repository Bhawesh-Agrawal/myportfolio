import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deletePostByTitle = mutation({
    args: { title: v.string() },
    handler: async ({ db }, { title }) => {
        const posts = await db
            .query("blog")
            .filter((q) => q.eq(q.field("title"), title))
            .collect();

        for (const post of posts) {
            await db.delete(post._id);
        }
    },
});

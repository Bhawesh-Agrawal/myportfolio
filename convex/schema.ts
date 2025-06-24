import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    blog: defineTable({
        type: v.union(v.literal("blog"), v.literal("project")),
        title: v.string(),
        slug: v.string(),
        bannerImage: v.optional(v.string()),
        content: v.string(),
        createdAt: v.string(),
        updatedAt: v.string(),
        published: v.boolean(),
        tags: v.array(v.string()),
        projectLinks: v.optional(v.object({
            website: v.optional(v.string()),
            github: v.optional(v.string()),
            references: v.optional(v.array(v.object({
                label: v.string(),
                url: v.string(),
            })))
        }))
    })
})

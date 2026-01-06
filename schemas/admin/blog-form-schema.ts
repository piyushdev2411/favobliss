import * as z from "zod";

export const BlogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  banner: z.string().min(1, "Banner image is required"),
  postedBy: z.string().optional(),
  published: z.boolean(),
  metaTitle: z
    .string()
    .max(60, "Meta title must be at most 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be at most 160 characters")
    .optional(),
  metaKeywords: z.array(z.string()).optional(),
  openGraphImage: z.string().optional(),
});

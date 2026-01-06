import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  bannerImage: z.string().min(1, {
    message: "Banner Image is required",
  }),
  description: z.string().optional(),
  landingPageBanner: z.string().optional(),
});

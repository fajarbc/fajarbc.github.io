import { z } from 'zod';

export const PostSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  coverImageUrl: z.string().url().optional(),
  relatedProjectSlugs: z.array(z.string()).default([]),
  body: z.array(z.any()),
});

export type Post = z.infer<typeof PostSchema>;

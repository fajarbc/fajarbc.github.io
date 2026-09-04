import { z } from 'zod';

export const ProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  role: z.string().optional(),
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  link: z.string().url().optional(),
  featured: z.boolean().default(false),
  coverImageUrl: z.string().url().optional(),
  body: z.array(z.any()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

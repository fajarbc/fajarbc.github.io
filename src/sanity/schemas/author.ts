import { z } from 'zod';

export const AuthorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
